"""
HTML emails for the public contact form (/contact).
Notifies the team inbox and sends an optional acknowledgment to the visitor.
"""
from __future__ import annotations

import base64
import html as html_lib
import logging
import re
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any, Optional

from django.conf import settings

from .gmail_service import _get_gmail_service

logger = logging.getLogger(__name__)

SUBJECT_LABELS = {
    "devis": "Demande de devis",
    "info": "Demande d'information",
    "reclamation": "Réclamation",
    "autre": "Autre",
}

LOGO_URL = "https://guivarche-demenagement.fr/logo.svg"
SITE_URL = "https://guivarche-demenagement.fr"


def _esc(value: Any) -> str:
    if value is None:
        return "—"
    s = str(value).strip()
    if not s:
        return "—"
    return html_lib.escape(s, quote=False)


def _esc_multiline(value: Any) -> str:
    if value is None:
        return "—"
    s = str(value).strip()
    if not s:
        return "—"
    return html_lib.escape(s, quote=False).replace("\n", "<br>")


def _admin_recipient() -> str:
    for key in ("CONTACT_NOTIFICATION_EMAIL", "LANDING_LEAD_NOTIFICATION_EMAIL"):
        val = (getattr(settings, key, None) or "").strip()
        if val:
            return val
    return "Contact@guivarche-demenagement.fr"


def _email_header_block(title: str, subtitle: str) -> str:
    return f"""
          <tr>
            <td style="background:linear-gradient(135deg,#2d1f42 0%,#1C3957 55%,#152a40 100%);padding:26px 22px 0;text-align:center;border-bottom:3px solid #CC922F;">
              <img src="{LOGO_URL}" alt="Guivarche Déménagement" width="140" height="auto" style="display:block;margin:0 auto 14px;max-height:48px;width:auto;border:0;">
              <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#CC922F;">{title}</p>
              <p style="margin:6px 0 0;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#B8A3D4;">{subtitle}</p>
              <h1 style="margin:14px 0 16px;font-size:23px;line-height:1.3;color:#CC922F;font-weight:800;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;text-shadow:0 1px 3px rgba(0,0,0,0.35);">Message reçu</h1>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background:#3A2852;padding:12px 16px;text-align:center;border-top:1px solid rgba(204,146,47,0.35);">
                    <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.04em;color:#CC922F;">Réponse sous 24h ouvrées</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>"""


def send_contact_form_team_notification(
    *,
    name: str,
    email: str,
    phone: str,
    subject_key: str,
    message: str,
) -> Optional[dict]:
    """Notify the team when someone submits the contact page form."""
    admin_to = _admin_recipient()
    sender = settings.GMAIL_SENDER_EMAIL
    if not sender:
        raise ValueError("GMAIL_SENDER_EMAIL is not configured")

    subject_label = SUBJECT_LABELS.get(subject_key, subject_key or "Non précisé")
    full_name = name.strip() or "Visiteur"
    subject_line = f"[Contact] {full_name} — {subject_label}"
    if len(subject_line) > 200:
        subject_line = subject_line[:197] + "..."

    ce = email.strip()
    mailto_href = html_lib.escape(ce, quote=True) if ce and "@" in ce else ""
    email_cell = (
        f'<a href="mailto:{mailto_href}" style="color:#4A3568;font-weight:600;text-decoration:none;">{_esc(ce)}</a>'
        if mailto_href
        else _esc(ce or None)
    )
    tel = phone.strip()
    tel_cell = (
        f'<a href="tel:{html_lib.escape(re.sub(r"[^\\d+]", "", tel), quote=True)}" '
        f'style="color:#1C3957;font-weight:600;text-decoration:none;">{_esc(tel)}</a>'
        if tel
        else "—"
    )

    reply_button_html = ""
    if mailto_href:
        reply_button_html = f"""
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 8px;">
                <tr>
                  <td style="border-radius:10px;background:#3A2852;border:2px solid #CC922F;">
                    <a href="mailto:{mailto_href}?subject={html_lib.escape(f'Re: {subject_label} — Guivarche', quote=True)}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#CC922F;text-decoration:none;">Répondre au client</a>
                  </td>
                </tr>
              </table>"""

    html_body = f"""<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EDE8F4;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#EDE8F4;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#F9F6FC;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(58,40,82,0.12);border:1px solid #E8E0F2;">
{_email_header_block("Nouveau message", "Formulaire contact")}
          <tr>
            <td style="padding:26px 24px 8px;background:#F9F6FC;">
              <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">
                Un visiteur vient d'envoyer un message via la page <strong style="color:#3A2852;">Contact</strong> du site.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #DDD4EC;border-radius:12px;overflow:hidden;margin-bottom:20px;background:#FDFBFF;">
                <tr>
                  <td colspan="2" style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#3A2852;background:linear-gradient(90deg,#EDE8F4 0%,#F5F0FB 70%);border-left:4px solid #CC922F;">Coordonnées</td>
                </tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;width:38%;">Nom</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{_esc(full_name)}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">E-mail</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{email_cell}</td></tr>
                <tr><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:12px;color:#5B4A72;font-weight:600;">Téléphone</td><td style="padding:12px 18px;border-bottom:1px solid #E8E0F2;font-size:14px;color:#1C3957;">{tel_cell}</td></tr>
                <tr><td style="padding:12px 18px;font-size:12px;color:#5B4A72;font-weight:600;">Sujet</td><td style="padding:12px 18px;font-size:14px;color:#1C3957;font-weight:600;">{_esc(subject_label)}</td></tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #DDD4EC;border-radius:12px;overflow:hidden;margin-bottom:24px;background:#FDFBFF;">
                <tr>
                  <td style="padding:14px 18px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#3A2852;background:linear-gradient(90deg,#EDE8F4 0%,#F5F0FB 70%);border-left:4px solid #CC922F;">Message</td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;font-size:14px;line-height:1.65;color:#1C3957;">{_esc_multiline(message)}</td>
                </tr>
              </table>
{reply_button_html}
              <p style="margin:16px 0 0;font-size:12px;color:#6B5B88;text-align:center;">Guivarche Déménagement · {SITE_URL}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    plain = (
        f"Nouveau message — formulaire contact\n"
        f"Nom : {full_name}\n"
        f"Email : {ce or '—'}\n"
        f"Téléphone : {tel or '—'}\n"
        f"Sujet : {subject_label}\n\n"
        f"Message :\n{message.strip() or '—'}\n"
    )

    msg = MIMEMultipart("alternative")
    msg["From"] = f"Guivarche Déménagement <{sender}>"
    msg["To"] = admin_to
    if ce:
        msg["Reply-To"] = ce
    msg["Subject"] = str(Header(subject_line, "utf-8"))
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")
    service = _get_gmail_service()
    result = service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
    logger.info("Contact form email sent to %s (Gmail=%s)", admin_to, result.get("id"))
    return result


def send_contact_client_acknowledgment(recipient_email: str, recipient_name: str) -> Optional[dict]:
    """Send a short confirmation to the visitor after contact form submission."""
    sender = settings.GMAIL_SENDER_EMAIL
    if not sender:
        raise ValueError("GMAIL_SENDER_EMAIL is not configured")

    display_name = recipient_name.strip() or "Madame, Monsieur"
    safe_name = html_lib.escape(display_name, quote=False)

    html_body = f"""<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f6f8;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f6f8;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(28,57,87,0.1);">
          <tr>
            <td style="background:#1C3957;padding:28px 24px;text-align:center;border-bottom:3px solid #CC922F;">
              <img src="{LOGO_URL}" alt="Guivarche Déménagement" width="130" style="display:block;margin:0 auto 12px;max-height:44px;width:auto;border:0;">
              <p style="margin:0;font-size:13px;color:#CC922F;font-weight:600;letter-spacing:0.06em;">Déménagement professionnel</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;">
              <p style="margin:0 0 16px;font-size:17px;color:#1C3957;">Bonjour <strong>{safe_name}</strong>,</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#475569;">
                Nous avons bien <strong>reçu votre message</strong>. Un membre de l'équipe Guivarche vous répondra
                <strong>par e-mail ou par téléphone</strong> dans les meilleurs délais.
              </p>
              <div style="background:linear-gradient(135deg,#f8f9fc 0%,#f0f4f8 100%);border-left:4px solid #CC922F;padding:18px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
                <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1C3957;">Besoin d'une réponse urgente ?</p>
                <p style="margin:0;font-size:14px;color:#555;">📞 <strong>+33 1 89 70 33 24</strong> · 📞 <strong>+33 7 46 32 66 78</strong></p>
                <p style="margin:8px 0 0;font-size:14px;">📧 <a href="mailto:{html_lib.escape(sender, quote=True)}" style="color:#1C3957;text-decoration:none;font-weight:500;">{html_lib.escape(sender, quote=False)}</a></p>
              </div>
              <p style="margin:0;font-size:15px;color:#475569;">Cordialement,<br><strong style="color:#1C3957;">L'équipe Guivarche Déménagement</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;text-align:center;font-size:12px;color:#94a3b8;background:#f8fafc;">
              <a href="{SITE_URL}" style="color:#1C3957;text-decoration:none;">guivarche-demenagement.fr</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    plain = (
        f"Bonjour {display_name},\n\n"
        "Nous avons bien reçu votre message. Notre équipe vous répondra dans les meilleurs délais.\n\n"
        f"Téléphone : +33 1 89 70 33 24 / +33 7 46 32 66 78\n"
        f"Email : {sender}\n\n"
        "L'équipe Guivarche Déménagement\n"
    )

    msg = MIMEMultipart("alternative")
    msg["From"] = f"Guivarche Déménagement <{sender}>"
    msg["To"] = recipient_email.strip()
    msg["Subject"] = "Nous avons bien reçu votre message — Guivarche Déménagement"
    msg.attach(MIMEText(plain, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")
    service = _get_gmail_service()
    result = service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
    logger.info("Contact acknowledgment sent to %s (Gmail=%s)", recipient_email, result.get("id"))
    return result
