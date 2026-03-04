"""
Send emails via Gmail API using OAuth2 refresh_token credentials.
Used to send devis confirmations and admin notifications (without attachments).
"""
import base64
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

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


def send_devis_email(recipient_email: str, recipient_name: str):
    """
    Send a professional devis confirmation email to the client.

    Args:
        recipient_email: The client's email address.
        recipient_name: The client's display name.
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

    <p style="font-size: 15px; line-height: 1.7; color: #444; margin-top: 24px;">
      Une question avant notre retour&nbsp;?
    </p>
    <div style="background: #f8f9fa; padding: 16px 20px; border-radius: 10px; margin: 16px 0;">
      <p style="margin: 0 0 6px; font-size: 14px; color: #555;">📞 <strong style="color: #1C2E42;">+33 7 46 32 66 78</strong> <span style="color: #888;"></span></p>
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
    valeur_bien_eur: float,
    demontage: bool,
    emb_fragile: bool,
    emb_cartons: bool,
    monte_meuble_depart: bool,
    monte_meuble_arrivee: bool,
    has_stopover: bool,
    monte_meuble_escale: bool,
    portage_dep: float,
    portage_arr: float,
    portage_esc: float,
    demi_etage_depart: bool,
    demi_etage_arrivee: bool,
    volume_method: Optional[str] = None,
    method_output: Optional[str] = None,
):
    """
    Send an admin notification email when a client requests un devis.
    Includes a detailed, styled recap of client info, trajet and options.

    Args:
        admin_email: Admin email (e.g. contact@guivarchedemenagement.fr)
        client_name, client_email, client_phone: Client contact info
        adresse_depart, adresse_arrivee: Addresses
        distance_km, volume_m3, final_price: Quote summary
        reference: Quote reference (e.g. GV-123-202503021430)
        valeur_bien_eur: Declared value of goods (for assurance)
        demontage, emb_fragile, emb_cartons: Selected paid options
        monte_meuble_*, has_stopover, portage_*, demi_etage_*: Access constraints
    """
    sender = settings.GMAIL_SENDER_EMAIL
    if not sender:
        raise ValueError('GMAIL_SENDER_EMAIL is not configured')

    # Helper labels for options / constraints
    def yes_no(value: bool) -> str:
        return "Oui" if value else "Non"

    valeur_bien_label = f"{valeur_bien_eur:.0f} €" if valeur_bien_eur and valeur_bien_eur > 0 else "Non renseignée"
    portage_dep_label = f"{portage_dep:.0f} m" if portage_dep and portage_dep > 0 else "—"
    portage_arr_label = f"{portage_arr:.0f} m" if portage_arr and portage_arr > 0 else "—"
    portage_esc_label = f"{portage_esc:.0f} m" if portage_esc and portage_esc > 0 else "—"

    msg = MIMEMultipart('mixed')
    msg['From'] = f'Guivarche Déménagement <{sender}>'
    msg['To'] = admin_email
    msg['Subject'] = f'[Nouvelle demande] {client_name} – {reference}'

    # Badge colors: gold for "Oui", light gray for "Non"
    badge_oui = "background: #fef3c7; color: #b45309; border: 1px solid #fcd34d;"
    badge_non = "background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb;"

    # Method colors for admin reflex (distinct per method)
    METHOD_STYLES = {
        'manual': {
            'bg': '#eff6ff',
            'border': '#3b82f6',
            'accent': '#1d4ed8',
            'label': 'Sélection manuelle',
            'icon': '📋',
        },
        'ai': {
            'bg': '#f5f3ff',
            'border': '#8b5cf6',
            'accent': '#6d28d9',
            'label': 'Analyse IA',
            'icon': '🤖',
        },
        'superficie': {
            'bg': '#ecfdf5',
            'border': '#10b981',
            'accent': '#047857',
            'label': 'Calcul superficie',
            'icon': '📐',
        },
    }
    method_style = METHOD_STYLES.get(volume_method or '', {
        'bg': '#f8fafc',
        'border': '#94a3b8',
        'accent': '#64748b',
        'label': 'Non déterminé',
        'icon': '❓',
    })
    method_label = method_style['label']
    method_output_safe = (method_output or '—').replace('<', '&lt;').replace('>', '&gt;')

    html_body = f"""\
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%%, #e2e8f0 100%%);">
  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 32px 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #1C3957 0%%, #2d4a6a 100%%); border-radius: 16px 16px 0 0; box-shadow: 0 4px 20px rgba(28,57,87,0.3);">
          <tr>
            <td style="padding: 32px 28px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 14px; font-size: 26px; font-weight: 700;">
                Go<span style="background: #CC922F; color: #fff; padding: 5px 12px; border-radius: 6px; margin-left: 4px; font-weight: 700; box-shadow: 0 2px 8px rgba(204,146,47,0.4);">YARD</span>
              </h1>
              <span style="display: inline-block; background: #CC922F; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; padding: 8px 16px; border-radius: 8px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(204,146,47,0.35);">NOUVELLE DEMANDE</span>
              <h2 style="color: #fff; margin: 0; font-size: 20px; font-weight: 600;">Demande de devis reçue</h2>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 14px; font-weight: 500;">{reference}</p>
            </td>
            </tr>
        </table>

        <!-- Method badge (color-coded for admin reflex) -->
        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
          <tr>
            <td style="padding: 0;">
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background: {method_style['bg']}; border: 2px solid {method_style['border']}; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
                <tr>
                  <td style="padding: 20px 24px; border-left: 6px solid {method_style['border']};">
                    <p style="margin: 0 0 8px; font-size: 10px; color: {method_style['accent']}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em;">Méthode utilisée</p>
                    <p style="margin: 0 0 12px; font-size: 18px; color: {method_style['accent']}; font-weight: 700;">{method_style['icon']} {method_label}</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #334155; word-wrap: break-word;">{method_output_safe}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Content card -->
        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background: #fff; border-radius: 0 0 16px 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; border-top: none; margin-top: 16px;">
          <tr>
            <td style="padding: 0;">
              <!-- Client card -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 24px 28px; border-left: 4px solid #CC922F; background: linear-gradient(90deg, #fffbeb 0%%, #fff 100%%);">
                    <p style="margin: 0 0 8px; font-size: 11px; color: #CC922F; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Contact client</p>
                    <p style="margin: 0 0 4px; font-size: 18px; color: #1e293b; font-weight: 700;">{client_name}</p>
                    <p style="margin: 0 0 2px;"><a href="mailto:{client_email}" style="color: #1C3957; text-decoration: none; font-size: 14px; font-weight: 500;">{client_email}</a></p>
                    <p style="margin: 0; font-size: 14px; color: #475569;">{client_phone or 'Téléphone non renseigné'}</p>
                  </td>
                </tr>
              </table>

              <!-- Trajet card -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 24px 28px; border-left: 4px solid #1C3957; background: linear-gradient(90deg, #f0f9ff 0%%, #fff 100%%);">
                    <p style="margin: 0 0 8px; font-size: 11px; color: #1C3957; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">Trajet</p>
                    <p style="margin: 0 0 6px; font-size: 13px; color: #64748b;"><strong>Départ</strong> · {adresse_depart or '—'}</p>
                    <p style="margin: 0 0 12px; font-size: 13px; color: #64748b;"><strong>Arrivée</strong> · {adresse_arrivee or '—'}</p>
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 12px; background: #1C3957; border-radius: 8px; margin-right: 8px;">
                          <span style="font-size: 13px; color: #fff; font-weight: 600;">{distance_km:.0f} km</span>
                        </td>
                        <td style="padding-left: 8px;">
                          <span style="font-size: 13px; color: #475569;">{volume_m3:.1f} m³</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Prix highlight -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 20px 28px; background: linear-gradient(135deg, #CC922F 0%%, #d4a84b 100%%); text-align: center;">
                    <p style="margin: 0 0 4px; font-size: 12px; color: rgba(255,255,255,0.9); font-weight: 600; text-transform: uppercase;">Estimation TTC</p>
                    <p style="margin: 0; font-size: 28px; color: #fff; font-weight: 800; letter-spacing: -0.5px;">{final_price:.2f} €</p>
                  </td>
                </tr>
              </table>

              <!-- Options & contraintes -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 24px 28px;">
                    <p style="margin: 0 0 16px; font-size: 12px; color: #1C3957; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Options & contraintes</p>

                    <!-- Options payantes -->
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                      <tr>
                        <td style="padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                          <p style="margin: 0 0 10px; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Options payantes</p>
                          <p style="margin: 0;">
                            <span style="display: inline-block; padding: 6px 12px; border-radius: 8px; margin: 0 6px 6px 0; font-size: 12px; font-weight: 600; {badge_oui if demontage else badge_non}">Démontage / remontage : {yes_no(demontage)}</span>
                            <span style="display: inline-block; padding: 6px 12px; border-radius: 8px; margin: 0 6px 6px 0; font-size: 12px; font-weight: 600; {badge_oui if emb_fragile else badge_non}">Emballage fragile : {yes_no(emb_fragile)}</span>
                            <span style="display: inline-block; padding: 6px 12px; border-radius: 8px; margin: 0 6px 6px 0; font-size: 12px; font-weight: 600; {badge_oui if emb_cartons else badge_non}">Emballage cartons : {yes_no(emb_cartons)}</span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 20px; background: #fff;">
                          <p style="margin: 0 0 8px; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Accès & portage</p>
                          <p style="margin: 0 0 4px; font-size: 13px; color: #334155;">Monte-meuble · Départ : <strong>{yes_no(monte_meuble_depart)}</strong> · Arrivée : <strong>{yes_no(monte_meuble_arrivee)}</strong> · Escale : <strong>{yes_no(monte_meuble_escale) if has_stopover else 'N/A'}</strong></p>
                          <p style="margin: 0; font-size: 13px; color: #334155;">Portage · Départ : <strong>{portage_dep_label}</strong> · Arrivée : <strong>{portage_arr_label}</strong> · Escale : <strong>{portage_esc_label}</strong></p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
                          <p style="margin: 0 0 8px; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">Autres éléments</p>
                          <p style="margin: 0 0 4px; font-size: 13px; color: #334155;">Demi-étage · Départ : <strong>{yes_no(demi_etage_depart)}</strong> · Arrivée : <strong>{yes_no(demi_etage_arrivee)}</strong> · Escale : <strong>{yes_no(has_stopover)}</strong></p>
                          <p style="margin: 0; font-size: 13px; color: #334155;">Valeur des biens : <strong>{valeur_bien_label}</strong></p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA -->
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #1C3957 0%%, #2d4a6a 100%%); border-radius: 12px; box-shadow: 0 4px 14px rgba(28,57,87,0.25);">
                      <tr>
                        <td style="padding: 20px 24px; text-align: center;">
                          <p style="margin: 0; font-size: 15px; color: #fff; font-weight: 600;">→ Recontacter le client par e-mail ou téléphone pour finaliser le devis</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <p style="margin: 24px 0 0; text-align: center; font-size: 12px; color: #94a3b8;">Guivarche Déménagement · Notification automatique</p>
        <p style="margin: 8px 0 0; text-align: center; font-size: 11px; color: #cbd5e1;"><span style="color: #3b82f6;">●</span> Liste · <span style="color: #8b5cf6;">●</span> IA · <span style="color: #10b981;">●</span> Surface</p>
      </td>
    </tr>
  </table>
</body>
</html>"""

    html_part = MIMEText(html_body, 'html', 'utf-8')
    msg.attach(html_part)

    raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode('utf-8')

    service = _get_gmail_service()
    result = service.users().messages().send(
        userId='me',
        body={'raw': raw_message}
    ).execute()

    logger.info('Admin devis notification sent to %s (Gmail message id: %s)', admin_email, result.get('id'))
    return result
