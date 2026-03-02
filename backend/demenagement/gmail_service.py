"""
Send emails via Gmail API using OAuth2 refresh_token credentials.
Supports PDF file attachments for sending devis quotes.
"""
import base64
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

from django.conf import settings
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

logger = logging.getLogger(__name__)


def _get_gmail_service():
    """Build an authenticated Gmail API service using OAuth2 refresh_token."""
    creds = Credentials(
        token=None,
        refresh_token=settings.GMAIL_OAUTH_REFRESH_TOKEN,
        token_uri=settings.GMAIL_OAUTH_TOKEN_URI,
        client_id=settings.GMAIL_OAUTH_CLIENT_ID,
        client_secret=settings.GMAIL_OAUTH_CLIENT_SECRET,
        scopes=['https://mail.google.com/'],
    )
    return build('gmail', 'v1', credentials=creds)


def send_devis_email(recipient_email: str, recipient_name: str, pdf_buffer, pdf_filename: str):
    """
    Send a professional devis email with the PDF attached.

    Args:
        recipient_email: The client's email address.
        recipient_name: The client's display name.
        pdf_buffer: A BytesIO buffer containing the PDF bytes (seeked to 0).
        pdf_filename: The filename for the attachment (e.g. "devis-dupont.pdf").
    """
    sender = settings.GMAIL_SENDER_EMAIL
    if not sender:
        raise ValueError('GMAIL_SENDER_EMAIL is not configured')

    msg = MIMEMultipart('mixed')
    msg['From'] = f'Guivarche Déménagement <{sender}>'
    msg['To'] = recipient_email
    msg['Subject'] = 'Nous avons bien reçu votre demande de devis – Guivarche Déménagement'

    html_body = f"""\
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; max-width: 600px; margin: 0 auto; background: #f5f6f8;">
  <div style="background: #1C2E42; padding: 32px 24px; text-align: center; border-radius: 0 0 16px 16px;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
      Go<span style="background: #CC922F; color: #1C2E42; padding: 4px 10px; border-radius: 4px; margin-left: 4px; font-weight: 700;">YARD</span>
    </h1>
    <p style="color: #CC922F; margin: 8px 0 0; font-size: 14px;">Déménagement professionnel pour tous</p>
  </div>

  <div style="padding: 40px 28px 32px; background: #ffffff; margin: 0 12px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-top: -8px; position: relative; z-index: 1;">
    <p style="font-size: 17px; color: #1a1a2e; margin: 0 0 20px;">Bonjour <strong>{recipient_name}</strong>,</p>

    <p style="font-size: 15px; line-height: 1.7; color: #444;">
      Nous avons bien <strong>reçu votre demande de devis</strong>. Merci de l’intérêt que vous portez à nos services.
    </p>

    <div style="background: linear-gradient(135deg, #f8f9fc 0%%, #f0f4f8 100%%); border-left: 4px solid #CC922F; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0 0 10px; font-size: 15px; color: #1a1a2e; font-weight: 600;">
        Prochaines étapes
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #555;">
        Un membre de notre équipe va vous recontacter <strong>par e-mail ou par téléphone</strong> sous peu pour finaliser votre devis personnalisé et répondre à vos questions.
      </p>
    </div>

    <p style="font-size: 15px; line-height: 1.7; color: #444;">
      Vous trouverez en pièce jointe un <strong>récapitulatif PDF</strong> de tout ce que vous avez renseigné (volume, adresses, options). Conservez-le pour votre suivi.
    </p>

    <p style="font-size: 15px; line-height: 1.7; color: #444; margin-top: 24px;">
      Une question avant notre retour&nbsp;?
    </p>
    <div style="background: #f8f9fa; padding: 16px 20px; border-radius: 10px; margin: 16px 0;">
      <p style="margin: 0 0 6px; font-size: 14px; color: #555;">📞 <strong style="color: #1C2E42;">09 74 50 50 47</strong> <span style="color: #888;"></span></p>
      <p style="margin: 0; font-size: 14px;">📧 <a href="mailto:{sender}" style="color: #1C2E42; text-decoration: none; font-weight: 500;">{sender}</a></p>
    </div>

    <p style="font-size: 15px; color: #444; margin-top: 28px;">Cordialement,<br><strong style="color: #1a1a2e;">L’équipe Guivarche Déménagement</strong></p>
  </div>

  <div style="padding: 20px 28px; text-align: center; font-size: 12px; color: #888;">
    <p style="margin: 0;">Guivarche Déménagement – Société française de déménagement professionnel</p>
    <p style="margin: 6px 0 0;"><a href="https://goyard-demenagement.fr" style="color: #1C2E42;">goyard-demenagement.fr</a></p>
  </div>
</body>
</html>"""

    html_part = MIMEText(html_body, 'html', 'utf-8')
    msg.attach(html_part)

    pdf_bytes = pdf_buffer.read()
    pdf_attachment = MIMEApplication(pdf_bytes, _subtype='pdf')
    pdf_attachment.add_header('Content-Disposition', 'attachment', filename=pdf_filename)
    msg.attach(pdf_attachment)

    raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')

    service = _get_gmail_service()
    result = service.users().messages().send(
        userId='me',
        body={'raw': raw_message}
    ).execute()

    logger.info('Devis email sent to %s (Gmail message id: %s)', recipient_email, result.get('id'))
    return result


def send_admin_devis_notification(
    admin_email: str,
    client_name: str,
    client_email: str,
    client_phone: str,
    adresse_depart: str,
    adresse_arrivee: str,
    distance_km: float,
    volume_m3: float,
    final_price: float,
    reference: str,
    pdf_buffer,
    pdf_filename: str,
):
    """
    Send an admin notification email when a client requests a devis.
    Includes client summary and PDF attachment.

    Args:
        admin_email: Admin email (e.g. contact@guivarchedemenagement.fr)
        client_name, client_email, client_phone: Client contact info
        adresse_depart, adresse_arrivee: Addresses
        distance_km, volume_m3, final_price: Quote summary
        reference: Quote reference (e.g. GV-123-202503021430)
        pdf_buffer: BytesIO with PDF bytes (seeked to 0)
        pdf_filename: Attachment filename
    """
    sender = settings.GMAIL_SENDER_EMAIL
    if not sender:
        raise ValueError('GMAIL_SENDER_EMAIL is not configured')

    msg = MIMEMultipart('mixed')
    msg['From'] = f'Guivarche Déménagement <{sender}>'
    msg['To'] = admin_email
    msg['Subject'] = f'[Nouvelle demande] {client_name} – {reference}'

    html_body = f"""\
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f0f2f5;">
  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; padding: 24px 16px;">
    <tr>
      <td>
        <!-- Header -->
        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background: #1C2E42; border-radius: 12px 12px 0 0;">
          <tr>
            <td style="padding: 28px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 12px; font-size: 24px; font-weight: 700;">
                Go<span style="background: #CC922F; color: #1C2E42; padding: 4px 10px; border-radius: 4px; margin-left: 4px; font-weight: 700;">YARD</span>
              </h1>
              <span style="display: inline-block; background: #CC922F; color: #1C2E42; font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 6px 12px; border-radius: 6px; margin-bottom: 12px;">NOUVELLE DEMANDE</span>
              <h2 style="color: #fff; margin: 0; font-size: 18px; font-weight: 600;">Demande de devis reçue</h2>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">{reference}</p>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background: #fff; border-radius: 0 0 12px 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding: 32px 28px;">
              <!-- Client -->
              <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Contact client</p>
              <p style="margin: 0 0 4px; font-size: 17px; font-weight: 600; color: #111;">{client_name}</p>
              <p style="margin: 0 0 2px;"><a href="mailto:{client_email}" style="color: #1C2E42; text-decoration: none; font-size: 15px;">{client_email}</a></p>
              <p style="margin: 0 0 24px; font-size: 15px; color: #374151;">{client_phone or 'Téléphone non renseigné'}</p>

              <!-- Route -->
              <p style="margin: 0 0 12px; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase;">Trajet</p>
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e7eb; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 18px; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 4px; font-size: 11px; color: #9ca3af;">Départ</p>
                    <p style="margin: 0; font-size: 14px; color: #111;">{adresse_depart or '—'}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <p style="margin: 0 0 4px; font-size: 11px; color: #9ca3af;">Arrivée</p>
                    <p style="margin: 0; font-size: 14px; color: #111;">{adresse_arrivee or '—'}</p>
                  </td>
                </tr>
              </table>
              <p style="margin: 12px 0 24px; font-size: 13px; color: #6b7280;">{distance_km:.0f} km · {volume_m3:.1f} m³</p>

              <!-- CTA -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">→ Recontacter le client par e-mail ou téléphone pour finaliser le devis.</p>
                    <p style="margin: 8px 0 0; font-size: 13px; color: #b45309;">Le récapitulatif PDF est joint à cet e-mail.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="margin: 20px 0 0; text-align: center; font-size: 12px; color: #9ca3af;">Guivarche Déménagement · Notification automatique</p>
      </td>
    </tr>
  </table>
</body>
</html>"""

    html_part = MIMEText(html_body, 'html', 'utf-8')
    msg.attach(html_part)

    pdf_bytes = pdf_buffer.read()
    pdf_attachment = MIMEApplication(pdf_bytes, _subtype='pdf')
    pdf_attachment.add_header('Content-Disposition', 'attachment', filename=pdf_filename)
    msg.attach(pdf_attachment)

    raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')

    service = _get_gmail_service()
    result = service.users().messages().send(
        userId='me',
        body={'raw': raw_message}
    ).execute()

    logger.info('Admin devis notification sent to %s (Gmail message id: %s)', admin_email, result.get('id'))
    return result
