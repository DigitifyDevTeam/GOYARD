"""
HTML email for landing-page devis formulaires (ClientInformation).
Sent to the business inbox; optional user confirmation reuses send_devis_email.
"""
from __future__ import annotations

import base64
import html as html_lib
import logging
import re
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import TYPE_CHECKING, Any, Optional

from django.conf import settings

from .gmail_service import _get_gmail_service

if TYPE_CHECKING:
    from .models import ClientInformation

logger = logging.getLogger(__name__)


def _esc(value: Any) -> str:
    if value is None:
        return "—"
    s = str(value).strip()
    if not s:
        return "—"
    return html_lib.escape(s, quote=False)


_LANDING_PROJECT_KEYS = (
    ("type_client", "Type de client"),
    ("volume", "Volume (m³)"),
    ("superficie", "Superficie (m²)"),
    ("info_complementaire", "Infos complémentaires"),
)

_ACCESS_OPTION_LABELS = {
    "monte_meuble": "Monte-meuble",
    "cave_ou_garage": "Cave / garage",
    "cours_a_traverser": "Cour à traverser",
    "distance_portage": "Portage (m)",
}

_ENTRY_PAGE_LABELS = {
    "/lp/paris": "Landing Paris",
    "/lp/hauts-de-seine": "Landing Hauts-de-Seine (92)",
}


def _format_entry_page(entry_page: Optional[str]) -> str:
    raw = (entry_page or "").strip()
    if not raw:
        return "—"
    return _ENTRY_PAGE_LABELS.get(raw, raw)


def _contact_name_rows(prenom: str, nom: str) -> str:
    prenom = (prenom or "").strip()
    nom = (nom or "").strip()
    if prenom:
        return (
            f'<tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Prénom</td>'
            f'<td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(prenom)}</td></tr>'
            f'<tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Nom</td>'
            f'<td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(nom)}</td></tr>'
        )
    return (
        f'<tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Nom</td>'
        f'<td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(nom or None)}</td></tr>'
    )


def _project_rows(opts: Optional[dict]) -> str:
    if not isinstance(opts, dict):
        opts = {}
    rows: list[str] = []
    for key, label in _LANDING_PROJECT_KEYS:
        raw = opts.get(key)
        if raw is None or str(raw).strip() == "":
            continue
        rows.append(
            "<tr>"
            f'<td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;width:38%;">{_esc(label)}</td>'
            f'<td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(str(raw).strip())}</td>'
            "</tr>"
        )
    return "".join(rows) if rows else (
        '<tr><td colspan="2" style="padding:14px 18px;font-size:13px;color:#5B4A72;">Non renseigné</td></tr>'
    )


def _access_options_rows(opts: Optional[dict]) -> str:
    if not isinstance(opts, dict) or not opts:
        return ""
    rows: list[str] = []
    for key, label in _ACCESS_OPTION_LABELS.items():
        if key not in opts:
            continue
        raw = opts[key]
        if raw is True:
            val = "Oui"
        elif raw is False:
            val = "Non"
        else:
            val = str(raw).strip() if raw not in (None, "") else "—"
        rows.append(
            "<tr>"
            f'<td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;width:38%;">{_esc(label)}</td>'
            f'<td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(val)}</td>'
            "</tr>"
        )
    return "".join(rows)


def _arrival_info_rows(opts: Optional[dict]) -> str:
    """Infos complémentaires saisies côté arrivée (formulaire long)."""
    if not isinstance(opts, dict):
        return ""
    raw = opts.get("info_complementaire")
    if raw is None or str(raw).strip() == "":
        return ""
    return (
        "<tr>"
        f'<td style="padding:12px 18px;font-size:12px;color:#5B4A72;font-weight:600;width:38%;">Infos complémentaires</td>'
        f'<td style="padding:12px 18px;font-size:14px;color:#1C3957;">{_esc(str(raw).strip())}</td>'
        "</tr>"
    )


def _plain_landing_recap(
    *,
    cid: Any,
    entry_display: str,
    full_name: str,
    email: str,
    phone: str,
    date_label: str,
    client: "ClientInformation",
) -> str:
    opts_dep = getattr(client, "options_depart", None) or {}
    opts_arr = getattr(client, "options_arrivee", None) or {}
    lines = [
        f"Nouvelle demande formulaire site (#{cid})",
        f"Page : {entry_display}",
        f"Contact : {full_name}",
        f"Email : {email or '—'}",
        f"Tél : {phone or '—'}",
        f"Date déménagement : {date_label}",
        "",
        f"Départ : {getattr(client, 'adresse_depart', '') or '—'}",
        f"  Étage : {getattr(client, 'etage_depart', '') or '—'} | Ascenseur : {getattr(client, 'ascenseur_depart', '') or '—'}",
        f"Arrivée : {getattr(client, 'adresse_arrivee', '') or '—'}",
        f"  Étage : {getattr(client, 'etage_arrivee', '') or '—'} | Ascenseur : {getattr(client, 'ascenseur_arrivee', '') or '—'}",
        "",
    ]
    for key, label in _LANDING_PROJECT_KEYS:
        val = opts_dep.get(key)
        if val is not None and str(val).strip():
            lines.append(f"{label} : {val}")
    arr_info = opts_arr.get("info_complementaire")
    if arr_info is not None and str(arr_info).strip():
        lines.append(f"Infos arrivée : {arr_info}")
    return "\n".join(lines) + "\n"


def send_landing_form_team_notification(client: "ClientInformation", entry_page: Optional[str] = None) -> Optional[dict]:
    """
    Notify the team when a visitor submits the landing devis form (ClientInformation saved).
    """
    admin_to = (getattr(settings, "LANDING_LEAD_NOTIFICATION_EMAIL", None) or "").strip()
    if not admin_to:
        admin_to = "Contact@guivarche-demenagement.fr"

    sender = settings.GMAIL_SENDER_EMAIL
    if not sender:
        raise ValueError("GMAIL_SENDER_EMAIL is not configured")

    prenom = getattr(client, "prenom", "") or ""
    nom = getattr(client, "nom", "") or ""
    prenom_s = str(prenom).strip()
    nom_s = str(nom).strip()
    full_name = f"{prenom_s} {nom_s}".strip() if prenom_s else (nom_s or "Prospect")
    cid = getattr(client, "id", None) or "—"

    dd = getattr(client, "date_demenagement", None)
    date_label = dd.strftime("%d/%m/%Y") if dd else "—"

    entry_display = _format_entry_page(entry_page)
    # Subject (objet) : include page d'origine for tri côté boîte mail
    entry_subject = re.sub(r"\s+", " ", (entry_page or "").strip()) or "—"
    if len(entry_subject) > 85:
        entry_subject = entry_subject[:82] + "..."
    full_name_subject = full_name if len(full_name) <= 50 else full_name[:47] + "..."
    subject = f"[Formulaire] {full_name_subject} | {entry_subject}"
    if len(subject) > 200:
        subject = subject[:197] + "..."

    opts_depart = getattr(client, "options_depart", None) or {}
    opts_arrivee = getattr(client, "options_arrivee", None) or {}
    access_rows = _access_options_rows(opts_depart)
    access_section_html = ""
    if access_rows:
        access_section_html = f"""
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #DDD4EC;border-radius:12px;overflow:hidden;margin-bottom:20px;background:#FDFBFF;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#3A2852;background:linear-gradient(90deg,#EDE8F4 0%%,#F5F0FB 70%%);border-left:4px solid #CC922F;">Accès départ (options)</td>
                </tr>
                {access_rows}
              </table>"""
    arrival_rows = _arrival_info_rows(opts_arrivee)
    arrival_section_html = ""
    if arrival_rows:
        arrival_section_html = f"""
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #DDD4EC;border-radius:12px;overflow:hidden;margin-bottom:24px;background:#FDFBFF;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#3A2852;background:linear-gradient(90deg,#EDE8F4 0%%,#F5F0FB 70%%);border-left:4px solid #CC922F;">Arrivée — compléments</td>
                </tr>
                {arrival_rows}
              </table>"""

    logo_url = "https://goyard-demenagement.fr/logo.svg"

    ce = (getattr(client, "email", None) or "").strip()
    mailto_href = html_lib.escape(ce, quote=True) if ce and "@" in ce else ""
    email_cell = (
        f'<a href="mailto:{mailto_href}" style="color:#4A3568;font-weight:600;text-decoration:none;">{_esc(ce)}</a>'
        if mailto_href
        else _esc(ce or None)
    )
    reply_button_html = ""
    if mailto_href:
        reply_button_html = f"""
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 8px;">
                <tr>
                  <td style="border-radius:10px;background:#3A2852;border:2px solid #CC922F;">
                    <a href="mailto:{mailto_href}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#CC922F;text-decoration:none;">Répondre au prospect</a>
                  </td>
                </tr>
              </table>"""

    html_body = f"""<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EDE8F4;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#EDE8F4;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%%;background:#F9F6FC;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(58,40,82,0.12);border:1px solid #E8E0F2;">
          <tr>
            <td style="background:linear-gradient(135deg,#2d1f42 0%%,#1C3957 55%%,#152a40 100%%);padding:26px 22px 0;text-align:center;border-bottom:3px solid #CC922F;">
              <img src="{logo_url}" alt="Guivarche" width="140" height="auto" style="display:block;margin:0 auto 14px;max-height:48px;width:auto;border:0;">
              <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#CC922F;">Nouvelle demande</p>
              <p style="margin:6px 0 0;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#B8A3D4;">Formulaire site</p>
              <h1 style="margin:14px 0 16px;font-size:23px;line-height:1.3;color:#CC922F;font-weight:800;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;text-shadow:0 1px 3px rgba(0,0,0,0.35);">Récapitulatif prospect</h1>
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background:#3A2852;padding:12px 16px;text-align:center;border-top:1px solid rgba(204,146,47,0.35);">
                    <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.04em;color:#CC922F;">Demande enregistrée — réponse sous 24h</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 24px 8px;background:#F9F6FC;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">
                Une personne vient de soumettre le <strong style="color:#3A2852;">formulaire de devis</strong> sur le site. Voici les informations enregistrées.
              </p>
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #DDD4EC;border-radius:12px;overflow:hidden;margin-bottom:20px;background:#FDFBFF;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#3A2852;background:linear-gradient(90deg,#EDE8F4 0%%,#F5F0FB 70%%);border-left:4px solid #CC922F;">Contact</td>
                </tr>
                {_contact_name_rows(prenom_s, nom_s)}
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">E-mail</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{email_cell}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Téléphone</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(getattr(client,'phone',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Date déménagement</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(date_label)}</td></tr>
                <tr><td style="padding:12px 18px;font-size:12px;color:#5B4A72;font-weight:600;">Page d'origine</td><td style="padding:12px 18px;font-size:14px;color:#1C3957;">{_esc(entry_display)}</td></tr>
              </table>

              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #DDD4EC;border-radius:12px;overflow:hidden;margin-bottom:20px;background:#FDFBFF;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#3A2852;background:linear-gradient(90deg,#EDE8F4 0%%,#F5F0FB 70%%);border-left:4px solid #CC922F;">Adresses &amp; accès</td>
                </tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;vertical-align:top;">Départ</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(getattr(client,'adresse_depart',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Étage départ</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(getattr(client,'etage_depart',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Ascenseur départ</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(getattr(client,'ascenseur_depart',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;vertical-align:top;">Arrivée</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(getattr(client,'adresse_arrivee',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Étage arrivée</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(getattr(client,'etage_arrivee',None))}</td></tr>
                <tr><td style="padding:12px 18px;font-size:12px;color:#5B4A72;font-weight:600;">Ascenseur arrivée</td><td style="padding:12px 18px;font-size:14px;color:#1C3957;">{_esc(getattr(client,'ascenseur_arrivee',None))}</td></tr>
              </table>

              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #DDD4EC;border-radius:12px;overflow:hidden;margin-bottom:20px;background:#FDFBFF;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#3A2852;background:linear-gradient(90deg,#EDE8F4 0%%,#F5F0FB 70%%);border-left:4px solid #CC922F;">Projet &amp; logement</td>
                </tr>
                {_project_rows(opts_depart)}
              </table>
{access_section_html}{arrival_section_html}
{reply_button_html}
              <p style="margin:16px 0 0;font-size:12px;color:#6B5B88;text-align:center;">ID enregistrement : {_esc(cid)} · Guivarche Déménagement</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    plain = _plain_landing_recap(
        cid=cid,
        entry_display=entry_display,
        full_name=full_name,
        email=(getattr(client, "email", "") or "").strip(),
        phone=(getattr(client, "phone", "") or "").strip(),
        date_label=date_label,
        client=client,
    )

    msg = MIMEMultipart("alternative")
    msg["From"] = f"Guivarche Déménagement <{sender}>"
    msg["To"] = admin_to
    msg["Subject"] = str(Header(subject, "utf-8"))
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")
    service = _get_gmail_service()
    result = service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
    logger.info("Landing lead email sent to %s (id=%s, Gmail=%s)", admin_to, cid, result.get("id"))
    return result
