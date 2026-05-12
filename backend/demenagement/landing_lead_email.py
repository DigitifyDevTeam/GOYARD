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


def _options_rows(opts: Optional[dict]) -> str:
    if not isinstance(opts, dict) or not opts:
        return '<tr><td colspan="2" style="padding:14px 18px;font-size:13px;color:#64748b;">Aucune option</td></tr>'

    labels = {
        "info_complementaire": "Infos complémentaires",
        "volume": "Volume (m³)",
        "superficie": "Superficie (m²)",
        "type_client": "Type de client",
        "monte_meuble": "Monte-meuble",
        "cave_ou_garage": "Cave / garage",
        "cours_a_traverser": "Cour à traverser",
        "distance_portage": "Portage (m)",
    }
    boolean_keys = {"monte_meuble", "cave_ou_garage", "cours_a_traverser", "distance_portage"}
    rows: list[str] = []
    for key, raw in opts.items():
        label = labels.get(key, key.replace("_", " ").title())
        if key in boolean_keys:
            if raw is True:
                val = "Oui"
            elif raw is False:
                val = "Non"
            else:
                val = str(raw).strip() if raw not in (None, "") else "—"
        else:
            if raw is None or str(raw).strip() == "":
                continue
            val = str(raw).strip()
        rows.append(
            "<tr>"
            f'<td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;width:38%;">{_esc(label)}</td>'
            f'<td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(val)}</td>'
            "</tr>"
        )
    return "".join(rows) if rows else (
        '<tr><td colspan="2" style="padding:14px 18px;font-size:13px;color:#64748b;">Aucune option</td></tr>'
    )


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
    full_name = f"{prenom} {nom}".strip() or "Prospect"
    cid = getattr(client, "id", None) or "—"

    dd = getattr(client, "date_demenagement", None)
    date_label = dd.strftime("%d/%m/%Y") if dd else "—"

    entry_display = (entry_page or "").strip() or "—"
    # Subject (objet) : include page d'origine for tri côté boîte mail
    entry_subject = re.sub(r"\s+", " ", (entry_page or "").strip()) or "—"
    if len(entry_subject) > 85:
        entry_subject = entry_subject[:82] + "..."
    full_name_subject = full_name if len(full_name) <= 50 else full_name[:47] + "..."
    subject = f"[Formulaire] {full_name_subject} | {entry_subject}"
    if len(subject) > 200:
        subject = subject[:197] + "..."

    logo_url = "https://goyard-demenagement.fr/logo.svg"

    ce = (getattr(client, "email", None) or "").strip()
    mailto_href = html_lib.escape(ce, quote=True) if ce and "@" in ce else ""
    email_cell = (
        f'<a href="mailto:{mailto_href}" style="color:#1C3957;text-decoration:none;">{_esc(ce)}</a>'
        if mailto_href
        else _esc(ce or None)
    )
    reply_button_html = ""
    if mailto_href:
        reply_button_html = f"""
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 8px;">
                <tr>
                  <td style="border-radius:10px;background:#CC922F;">
                    <a href="mailto:{mailto_href}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">Répondre au prospect</a>
                  </td>
                </tr>
              </table>"""

    html_body = f"""<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#1C3957 0%%,#152a40 100%%);padding:26px 22px 24px;text-align:center;border-bottom:3px solid #CC922F;">
              <img src="{logo_url}" alt="Guivarche" width="140" height="auto" style="display:block;margin:0 auto 14px;max-height:48px;width:auto;border:0;">
              <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#CC922F;">Nouvelle demande</p>
              <p style="margin:6px 0 0;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9BB4CC;">Formulaire site</p>
              <h1 style="margin:14px 0 0;font-size:23px;line-height:1.3;color:#CC922F;font-weight:800;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;text-shadow:0 1px 2px rgba(0,0,0,0.25);">Récapitulatif prospect</h1>
              <p style="margin:10px auto 0;max-width:420px;font-size:13px;line-height:1.5;color:#C9D6E4;font-weight:500;">Demande enregistrée — réponse sous 24h</p>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 24px 8px;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">
                Une personne vient de soumettre le <strong>formulaire de devis</strong> sur le site. Voici les informations enregistrées.
              </p>
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:20px;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#1C3957;background:linear-gradient(90deg,#FEF8EC 0%%,#f8fafc 55%%);border-left:4px solid #CC922F;">Contact</td>
                </tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;">Nom</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(nom)}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;">Prénom</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(prenom)}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;">E-mail</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{email_cell}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;">Téléphone</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(getattr(client,'phone',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;">Date déménagement</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(date_label)}</td></tr>
                <tr><td style="padding:12px 18px;font-size:12px;color:#64748b;font-weight:600;">Page d'origine</td><td style="padding:12px 18px;font-size:14px;color:#0f172a;">{_esc(entry_display)}</td></tr>
              </table>

              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:20px;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#1C3957;background:linear-gradient(90deg,#FEF8EC 0%%,#f8fafc 55%%);border-left:4px solid #CC922F;">Adresses &amp; accès</td>
                </tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;vertical-align:top;">Départ</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(getattr(client,'adresse_depart',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;">Étage départ</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(getattr(client,'etage_depart',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;">Ascenseur départ</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(getattr(client,'ascenseur_depart',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;vertical-align:top;">Arrivée</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(getattr(client,'adresse_arrivee',None))}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:600;">Étage arrivée</td><td style="padding:12px 18px;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">{_esc(getattr(client,'etage_arrivee',None))}</td></tr>
                <tr><td style="padding:12px 18px;font-size:12px;color:#64748b;font-weight:600;">Ascenseur arrivée</td><td style="padding:12px 18px;font-size:14px;color:#0f172a;">{_esc(getattr(client,'ascenseur_arrivee',None))}</td></tr>
              </table>

              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:8px;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#1C3957;background:linear-gradient(90deg,#FEF8EC 0%%,#f8fafc 55%%);border-left:4px solid #CC922F;">Détails complémentaires — départ</td>
                </tr>
                {_options_rows(getattr(client, "options_depart", None))}
              </table>
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#1C3957;background:linear-gradient(90deg,#FEF8EC 0%%,#f8fafc 55%%);border-left:4px solid #CC922F;">Arrivée — compléments</td>
                </tr>
                {_options_rows(getattr(client, "options_arrivee", None))}
              </table>
{reply_button_html}
              <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;text-align:center;">ID enregistrement : {_esc(cid)} · Guivarche Déménagement</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    plain = (
        f"Nouvelle demande formulaire site (#{cid})\n"
        f"Page : {entry_display}\n"
        f"Nom : {full_name}\n"
        f"Email : {getattr(client, 'email', '') or '—'}\n"
        f"Tél : {getattr(client, 'phone', '') or '—'}\n"
        f"Date : {date_label}\n"
        f"Départ : {getattr(client, 'adresse_depart', '') or '—'}\n"
        f"Arrivée : {getattr(client, 'adresse_arrivee', '') or '—'}\n"
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
