"""
Send emails via Gmail API using OAuth2 refresh_token credentials.
Used to send devis confirmations and admin notifications (without attachments).
"""
import base64
import logging
import html as html_lib
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
      <img src="https://goyard-demenagement.fr/logo.svg" alt="Guivarche Déménagement" style="height:100px; width:120px; display:block; margin:0 auto; border:0; outline:none; text-decoration:none;" />
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
    escale_adresse: Optional[str],
    etage_depart: Optional[str],
    etage_arrivee: Optional[str],
    escale_etage: Optional[str],
    ascenseur_depart: Optional[str],
    ascenseur_arrivee: Optional[str],
    escale_ascenseur: Optional[str],
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
    demi_etage_escale: bool,
    volume_method: Optional[str] = None,
    method_output: Optional[str] = None,
    date_demenagement=None,
):
    """
    Send an admin notification email when a client requests un devis.
    Includes a detailed, styled recap of client info, trajet and options.

    Args:
        admin_email: Admin email (e.g. contact@guivarchedemenagement.fr)
        client_name, client_email, client_phone: Client contact info
        adresse_depart, adresse_arrivee, escale_adresse: Addresses
        etage_depart, etage_arrivee, escale_etage: Floor values ("RDC", "1".."20")
        ascenseur_depart, ascenseur_arrivee, escale_ascenseur: Elevator size/choice (or "Non")
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
    date_demenagement_label = date_demenagement.strftime("%d/%m/%Y") if date_demenagement else "—"

    etage_depart_display = etage_depart or "RDC"
    etage_arrivee_display = etage_arrivee or "RDC"
    escale_etage_display = escale_etage or "RDC"
    escale_adresse_safe = (escale_adresse or '').strip().replace('<', '&lt;').replace('>', '&gt;')
    show_escale_row = bool(has_stopover and escale_adresse_safe)

    escale_trajet_row_html = ""
    if show_escale_row:
        escale_trajet_row_html = f"""
                      <tr>
                        <td style="padding:14px 20px; border-bottom:1px solid #eef0f3;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width:110px; font-size:12px; color:#6b7280; font-weight:600;">Escale</td>
                              <td style="font-size:13px; color:#111827; font-weight:500;">{escale_adresse_safe}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>"""

    # Escape elevator labels (safe for HTML even if they don't contain "<" / ">")
    ascenseur_depart_safe = (ascenseur_depart or "Non").replace("<", "&lt;").replace(">", "&gt;")
    ascenseur_arrivee_safe = (ascenseur_arrivee or "Non").replace("<", "&lt;").replace(">", "&gt;")
    escale_ascenseur_safe = (escale_ascenseur or "Non").replace("<", "&lt;").replace(">", "&gt;")

    msg = MIMEMultipart('mixed')
    msg['From'] = f'Guivarche Déménagement <{sender}>'
    msg['To'] = admin_email
    msg['Subject'] = f'[Nouvelle demande] {client_name} – {reference}'

    # Badge colors: gold for "Oui", light gray for "Non"
    badge_oui = "background: #fef3c7; color: #b45309; border: 1px solid #fcd34d;"
    badge_non = "background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb;"

    escale_row_html = ""
    if show_escale_row:
        escale_row_html = f"""
                      <tr>
                        <td style="padding:16px 16px; font-size:12px; color:#374151; font-weight:700; border-bottom:1px solid #eef0f3;">Escale</td>
                        <td style="padding:16px 10px; text-align:center; font-size:13px; color:#111827; font-weight:700; border-bottom:1px solid #eef0f3;">{escale_etage_display}</td>
                        <td style="padding:16px 10px; text-align:center; border-bottom:1px solid #eef0f3;">
                          <span style="display:inline-block; padding:3px 12px; border-radius:20px; font-size:11px; font-weight:800; {badge_oui if (monte_meuble_escale or escale_ascenseur_safe != 'Non') else badge_non}">
                            {('Monte-meuble' if monte_meuble_escale else escale_ascenseur_safe)}
                          </span>
                        </td>
                        <td style="padding:16px 10px; text-align:center; font-size:13px; color:#111827; font-weight:700; border-bottom:1px solid #eef0f3;">{portage_esc_label}</td>
                        <td style="padding:16px 10px; text-align:center; border-bottom:1px solid #eef0f3;">
                          <span style="display:inline-block; padding:3px 12px; border-radius:20px; font-size:11px; font-weight:800; {badge_oui if demi_etage_escale else badge_non}">
                            {yes_no(demi_etage_escale)}
                          </span>
                        </td>
                      </tr>"""

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
    method_output_display = method_output_safe
    if volume_method == 'manual' and method_output:
        # Highlight "room names" (text before ':') in manual selection for readability, and display each room on a new line.
        # Each part is rendered as a separate line in the output.
        escaped_output = html_lib.escape(method_output, quote=False)
        parts = [p.strip() for p in escaped_output.split(' · ')]
        formatted_parts = []
        for p in parts:
            if ':' in p:
                label, rest = p.split(':', 1)
                formatted_parts.append(
                    f'<span style="display:inline-block; background:#fef3c7; border:1px solid #fcd34d; color:#92400e; padding:2px 8px; border-radius:999px; font-weight:800; font-size:12px;">{label}</span>: {rest}'
                )
            else:
                formatted_parts.append(p)
        method_output_display = '<br>'.join(formatted_parts)

    html_body = f"""\
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#f0f2f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; padding:24px 16px;">
    <tr>
      <td>

        <!-- ========== HEADER ========== -->
        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#1C2E42; border-radius:12px 12px 0 0;">
          <tr>
            <td style="padding:30px 32px; text-align:center;">
              <h1 style="margin:0 0 14px; font-size:24px; color:#fff; font-weight:700;">
                <img src="https://goyard-demenagement.fr/logo.svg" alt="Guivarche Déménagement" style="height:100px; width:120px; display:block; margin:0 auto; border:0; outline:none; text-decoration:none;" />
              </h1>
              <div style="display:inline-block; background:rgba(204,146,47,0.15); border:1px solid #CC922F; border-radius:6px; padding:6px 18px; margin-bottom:14px;">
                <span style="font-size:11px; font-weight:700; color:#CC922F; letter-spacing:1.5px; text-transform:uppercase;">NOUVELLE DEMANDE DE DEVIS</span>
              </div>
              <p style="margin:0; font-size:13px; color:rgba(255,255,255,0.7);">Réf. {reference}</p>
              <!-- final_price is intentionally hidden (removed from visible layout) : {final_price:.2f} -->
            </td>
          </tr>
        </table>

        <!-- ========== MAIN CARD ========== -->
        <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:0 0 12px 12px; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:0;">

              <!-- ---- SECTION : Client ---- -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-bottom:2px solid #f0f2f5;">
                <tr>
                  <td style="padding:28px 32px 24px;">
                    <p style="margin:0 0 16px; font-size:10px; font-weight:700; color:#CC922F; text-transform:uppercase; letter-spacing:1.5px;">&#x1F464; INFORMATIONS CLIENT</p>
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#fafbfc; border-radius:8px; border:1px solid #eef0f3;">
                      <tr>
                        <td style="padding:14px 20px; border-bottom:1px solid #eef0f3;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width:110px; font-size:12px; color:#6b7280; font-weight:600; vertical-align:middle;">Nom</td>
                              <td style="font-size:15px; color:#111827; font-weight:700;">{client_name}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 20px; border-bottom:1px solid #eef0f3;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width:110px; font-size:12px; color:#6b7280; font-weight:600; vertical-align:middle;">Email</td>
                              <td><a href="mailto:{client_email}" style="color:#1C2E42; text-decoration:none; font-size:13px; font-weight:500;">{client_email}</a></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 20px;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width:110px; font-size:12px; color:#6b7280; font-weight:600; vertical-align:middle;">T&eacute;l&eacute;phone</td>
                              <td style="font-size:13px; color:#111827;">{client_phone or 'Non renseign&eacute;'}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ---- SECTION : Trajet ---- -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-bottom:2px solid #f0f2f5;">
                <tr>
                  <td style="padding:28px 32px 24px;">
                    <p style="margin:0 0 16px; font-size:10px; font-weight:700; color:#1C2E42; text-transform:uppercase; letter-spacing:1.5px;">&#x1F4CD; TRAJET</p>
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#fafbfc; border-radius:8px; border:1px solid #eef0f3;">
                      <tr>
                        <td style="padding:14px 20px; border-bottom:1px solid #eef0f3;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width:110px; font-size:12px; color:#6b7280; font-weight:600;">D&eacute;part</td>
                              <td style="font-size:13px; color:#111827; font-weight:500;">{adresse_depart or '&mdash;'}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 20px; border-bottom:1px solid #eef0f3;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width:110px; font-size:12px; color:#6b7280; font-weight:600;">Arriv&eacute;e</td>
                              <td style="font-size:13px; color:#111827; font-weight:500;">{adresse_arrivee or '&mdash;'}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      {escale_trajet_row_html}
                      <tr>
                        <td style="padding:14px 20px;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="width:110px; font-size:12px; color:#6b7280; font-weight:600;">Date</td>
                              <td style="font-size:13px; color:#111827; font-weight:500;">{date_demenagement_label}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:14px;">
                      <tr>
                        <td style="padding:8px 18px; background:#1C2E42; border-radius:6px;">
                          <span style="font-size:13px; color:#fff; font-weight:700;">{distance_km:.0f} km</span>
                        </td>
                        <td style="width:10px;"></td>
                        <td style="padding:8px 18px; background:#f0f4f8; border-radius:6px; border:1px solid #d1d9e6;">
                          <span style="font-size:13px; color:#1C2E42; font-weight:700;">{volume_m3:.1f} m&sup3;</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ---- SECTION : M&eacute;thode de calcul ---- -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-bottom:2px solid #f0f2f5;">
                <tr>
                  <td style="padding:28px 32px 24px;">
                    <p style="margin:0 0 16px; font-size:10px; font-weight:700; color:{method_style['accent']}; text-transform:uppercase; letter-spacing:1.5px;">{method_style['icon']} M&Eacute;THODE DE CALCUL</p>
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:{method_style['bg']}; border-radius:8px; border:1px solid {method_style['border']}; border-left:4px solid {method_style['border']};">
                      <tr>
                        <td style="padding:18px 20px;">
                          <p style="margin:0 0 8px; font-size:16px; color:{method_style['accent']}; font-weight:700;">{method_label}</p>
                          <p style="margin:0; font-size:12px; color:#4b5563; line-height:1.6; word-wrap:break-word;">{method_output_display}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ---- SECTION : Options payantes ---- -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-bottom:2px solid #f0f2f5;">
                <tr>
                  <td style="padding:28px 32px 24px;">
                    <p style="margin:0 0 16px; font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:1.5px;">&#x1F6E0; OPTIONS PAYANTES</p>
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-radius:8px; border:1px solid #eef0f3; overflow:hidden;">
                      <tr>
                        <td style="padding:13px 20px; background:#fafbfc; border-bottom:1px solid #eef0f3;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="font-size:13px; color:#374151;">D&eacute;montage / remontage</td>
                              <td style="text-align:right;"><span style="display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; {badge_oui if demontage else badge_non}">{yes_no(demontage)}</span></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:13px 20px; border-bottom:1px solid #eef0f3;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="font-size:13px; color:#374151;">Emballage fragile</td>
                              <td style="text-align:right;"><span style="display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; {badge_oui if emb_fragile else badge_non}">{yes_no(emb_fragile)}</span></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:13px 20px;">
                          <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="font-size:13px; color:#374151;">Emballage cartons</td>
                              <td style="text-align:right;"><span style="display:inline-block; padding:4px 14px; border-radius:20px; font-size:11px; font-weight:700; {badge_oui if emb_cartons else badge_non}">{yes_no(emb_cartons)}</span></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ---- SECTION : Acc&egrave;s & Portage (DATA GRID) ---- -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-bottom:2px solid #f0f2f5;">
                <tr>
                  <td style="padding:28px 32px 24px;">
                    <p style="margin:0 0 16px; font-size:10px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:1.5px;">&#x1F3D7; ACC&Egrave;S &amp; PORTAGE</p>
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="border-radius:8px; border:1px solid #eef0f3; overflow:hidden;">
                      <tr style="background:#f8fafc;">
                        <td style="padding:10px 16px; font-size:11px; font-weight:800; color:#1C2E42; width:26%%;">&nbsp;</td>
                        <td style="padding:10px 10px; font-size:11px; font-weight:800; color:#1C2E42; text-align:center; width:18%%;">&eacute;tage</td>
                        <td style="padding:10px 10px; font-size:11px; font-weight:800; color:#1C2E42; text-align:center; width:30%%;">Ascenseur</td>
                        <td style="padding:10px 10px; font-size:11px; font-weight:800; color:#1C2E42; text-align:center; width:16%%;">portage</td>
                        <td style="padding:10px 10px; font-size:11px; font-weight:800; color:#1C2E42; text-align:center; width:20%%;">Demi &eacute;tage</td>
                      </tr>

                      <!-- Départ -->
                      <tr style="background:#ffffff;">
                        <td style="padding:16px 16px; font-size:12px; color:#374151; font-weight:700; border-bottom:1px solid #eef0f3;">D&eacute;part</td>
                        <td style="padding:16px 10px; text-align:center; font-size:13px; color:#111827; font-weight:700; border-bottom:1px solid #eef0f3;">{etage_depart_display}</td>
                        <td style="padding:16px 10px; text-align:center; border-bottom:1px solid #eef0f3;">
                          <span style="display:inline-block; padding:3px 12px; border-radius:20px; font-size:11px; font-weight:800;
                            {badge_oui if monte_meuble_depart else (badge_oui if ascenseur_depart_safe != 'Non' else badge_non)}">
                            {('Monte-meuble' if monte_meuble_depart else ascenseur_depart_safe)}
                          </span>
                        </td>
                        <td style="padding:16px 10px; text-align:center; font-size:13px; color:#111827; font-weight:700; border-bottom:1px solid #eef0f3;">{portage_dep_label}</td>
                        <td style="padding:16px 10px; text-align:center; border-bottom:1px solid #eef0f3;">
                          <span style="display:inline-block; padding:3px 12px; border-radius:20px; font-size:11px; font-weight:800; {badge_oui if demi_etage_depart else badge_non}">
                            {yes_no(demi_etage_depart)}
                          </span>
                        </td>
                      </tr>

                      {escale_row_html}

                      <!-- Arrivée -->
                      <tr style="background:#ffffff;">
                        <td style="padding:16px 16px; font-size:12px; color:#374151; font-weight:700;">arriv&eacute;e</td>
                        <td style="padding:16px 10px; text-align:center; font-size:13px; color:#111827; font-weight:700;">{etage_arrivee_display}</td>
                        <td style="padding:16px 10px; text-align:center;">
                          <span style="display:inline-block; padding:3px 12px; border-radius:20px; font-size:11px; font-weight:800;
                            {badge_oui if monte_meuble_arrivee else (badge_oui if ascenseur_arrivee_safe != 'Non' else badge_non)}">
                            {('Monte-meuble' if monte_meuble_arrivee else ascenseur_arrivee_safe)}
                          </span>
                        </td>
                        <td style="padding:16px 10px; text-align:center; font-size:13px; color:#111827; font-weight:700;">{portage_arr_label}</td>
                        <td style="padding:16px 10px; text-align:center;">
                          <span style="display:inline-block; padding:3px 12px; border-radius:20px; font-size:11px; font-weight:800; {badge_oui if demi_etage_arrivee else badge_non}">
                            {yes_no(demi_etage_arrivee)}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- valeur_bien_label is intentionally hidden (removed from visible layout) : {valeur_bien_label} -->
              <!-- ---- CTA ---- -->
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:24px 32px 28px;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#fef9ee; border-radius:8px; border:1px solid #f59e0b;">
                      <tr>
                        <td style="padding:18px 24px; text-align:center;">
                          <p style="margin:0; font-size:14px; color:#92400e; font-weight:700;">&#x26A1; Recontacter le client par e-mail ou t&eacute;l&eacute;phone pour finaliser le devis</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

        <!-- ========== FOOTER ========== -->
        <p style="margin:22px 0 0; text-align:center; font-size:11px; color:#9ca3af;">Guivarche D&eacute;m&eacute;nagement &middot; Notification automatique</p>
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
