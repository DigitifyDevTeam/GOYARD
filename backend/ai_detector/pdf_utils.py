from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime
import os

def generate_quote_pdf(quote_data):
    """Generate a PDF quote with the given data"""
    buffer = BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72,
                           topMargin=72, bottomMargin=18)
    
    # Custom styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='Title',
        fontSize=18,
        leading=22,
        alignment=1,  # Center aligned
        spaceAfter=20,
        textColor=colors.HexColor('#1c3957')  # Dark blue
    ))
    
    styles.add(ParagraphStyle(
        name='Header',
        fontSize=12,
        leading=14,
        spaceAfter=6,
        textColor=colors.HexColor('#1c3957')
    ))
    
    styles.add(ParagraphStyle(
        name='Normal',
        fontSize=10,
        leading=12,
        spaceAfter=6
    ))
    
    # Build the PDF content
    elements = []
    
    # Add logo (if available)
    logo_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'logo.png')
    if os.path.exists(logo_path):
        img = Image(logo_path, width=2*inch, height=1*inch)
        elements.append(img)
    
    # Title
    elements.append(Paragraph("Devis de Déménagement", styles['Title']))
    
    # Date and reference
    elements.append(Paragraph(f"Date: {datetime.now().strftime('%d/%m/%Y')}", styles['Normal']))
    elements.append(Paragraph(f"Référence: {quote_data.get('reference', 'N/A')}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Client information
    elements.append(Paragraph("Informations Client", styles['Header']))
    elements.append(Paragraph(f"Nom: {quote_data.get('client_name', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"Email: {quote_data.get('client_email', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"Téléphone: {quote_data.get('client_phone', 'N/A')}", styles['Normal']))
    elements.append(Spacer(1, 15))
    
    # Détails du déménagement
    elements.append(Paragraph("Détails du Déménagement", styles['Header']))
    elements.append(Paragraph(f"Adresse de départ: {quote_data.get('adresse_depart', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"Adresse d'arrivée: {quote_data.get('adresse_arrivee', 'N/A')}", styles['Normal']))
    elements.append(Paragraph(f"Distance: {quote_data.get('distance_km', 0)} km", styles['Normal']))
    elements.append(Paragraph(f"Volume estimé: {quote_data.get('volume_m3', 0)} m³", styles['Normal']))
    elements.append(Spacer(1, 15))
    
    # Détails du prix
    elements.append(Paragraph("Détail des Prix", styles['Header']))
    
    # Create price breakdown table
    price_data = [
        ['Description', 'Montant (€)'],
        ['Prix de base', f"{quote_data.get('base_price_transport', 0):.2f}"],
        ['Frais d\'étages', f"{quote_data.get('etage_total', 0):.2f}"],
        ['Ascenseur', f"{quote_data.get('ascenseur_total', 0):.2f}"],
        ['Portage', f"{quote_data.get('portage_total', 0):.2f}"],
        ['Escale', f"{quote_data.get('escale_total', 0):.2f}"],
    ]
    
    # Add optional services if they exist and are greater than 0
    if quote_data.get('assurance_valeur_bien', 0) > 0:
        price_data.append(['Assurance', f"{quote_data['assurance_valeur_bien']:.2f}"])
    if quote_data.get('demontage_remontage', 0) > 0:
        price_data.append(['Démontage/Remontage', f"{quote_data['demontage_remontage']:.2f}"])
    if quote_data.get('emballage_fragile', 0) > 0:
        price_data.append(['Emballage Fragile', f"{quote_data['emballage_fragile']:.2f}"])
    
    # Add total row
    price_data.append(['TOTAL TTC', f"{quote_data.get('final_price', 0):.2f} €"])
    
    # Create and style the table
    table = Table(price_data, colWidths=[doc.width*0.7, doc.width*0.3])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1c3957')),  # Header background
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),  # Header text color
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),  # Center align all cells
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Header font
        ('FONTSIZE', (0, 0), (-1, 0), 10),  # Header font size
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),  # Header bottom padding
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f8f9fa')),  # Total row background
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#1c3957')),  # Total row text color
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),  # Total row font
        ('FONTSIZE', (0, -1), (-1, -1), 12),  # Total row font size
        ('ALIGN', (0, -1), (-1, -1), 'RIGHT'),  # Right align total row
        ('TOPPADDING', (0, -1), (-1, -1), 6),  # Total row top padding
        ('BOTTOMPADDING', (0, -1), (-1, -1), 6),  # Total row bottom padding
        ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),  # Grid lines
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),  # Vertical alignment
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 20))
    
    # Terms and conditions
    elements.append(Paragraph("Conditions Générales", styles['Header']))
    terms = [
        "Ce devis est valable 30 jours à compter de sa date d'émission.",
        "Un acompte de 30% est requis pour confirmer la réservation.",
        "Les prix incluent la TVA au taux en vigueur.",
        "Pour toute annulation, merci de nous prévenir au moins 72h à l'avance."
    ]
    
    for term in terms:
        elements.append(Paragraph(f"• {term}", styles['Normal']))
    
    # Build the PDF
    doc.build(elements)
    
    # Get the value of the BytesIO buffer and return it
    buffer.seek(0)
    return buffer
