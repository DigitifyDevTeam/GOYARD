import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { List, Camera, Maximize2 } from 'lucide-react';

interface PDFReportProps {
  clientData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    date_demenagement: string;
  };
  methodData: {
    method: 'list' | 'photo' | 'surface';
    volume_m3?: number;
    surface_area?: number;
    roomObjectQuantities?: Record<string, Record<string, number>>;
    uploadedImages?: Array<{
      id: string;
      preview: string;
      roomId: string;
    }>;
    roomAnalysisResults?: Record<string, Record<string, number | { quantity: number; volume_per_unit: number; total_volume: number; is_ai_detected: boolean; confidence: number | null }>>;
    specialObjectQuantities?: Record<string, number>;
  };
  quoteData: {
    final_price: number;
    base_price_transport?: number;
    volume_m3?: number;
    distance_km?: number;
    etage_total?: number;
    ascenseur_total?: number;
    demi_etage_total?: number;
    escale_total?: number;
    portage_total?: number;
  };
  addressData: {
    departure: {
      address: string;
      floor: string;
      elevator: boolean;
      options: {
        portageDistanceM: number;
      };
    };
    arrival: {
      address: string;
      floor: string;
      elevator: boolean;
      options: {
        portageDistanceM: number;
      };
    };
  };
  optionsData: {
    demontageRemontage: boolean;
    emballageFragile: boolean;
    emballageCartons: boolean;
    packCartons: boolean;
    dateFlexible: boolean;
    prixFlexible: boolean;
    autorisationStationnement: boolean;
    transportVetements: boolean;
    assurance: number;
    cleaningQuantities: Record<string, number>;
  };
  propertyValue: number;
}

const PDFReport: React.FC<PDFReportProps> = ({
  clientData,
  methodData,
  quoteData,
  addressData,
  optionsData,
  propertyValue
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`devis-${clientData.nom}-${clientData.prenom}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={generatePDF}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Télécharger le devis en PDF
      </button>

      <div
        ref={reportRef}
        className="bg-white p-8 space-y-8"
        style={{ minWidth: '210mm' }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-blue-600 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">DEVIS DE DÉMÉNAGEMENT</h1>
          <p className="text-gray-600 mt-2">Établi le {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        {/* Client Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">
            INFORMATIONS CLIENT
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nom complet</p>
              <p className="font-medium">{clientData.prenom} {clientData.nom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{clientData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Téléphone</p>
              <p className="font-medium">{clientData.telephone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date souhaitée</p>
              <p className="font-medium">{formatDate(clientData.date_demenagement)}</p>
            </div>
          </div>
        </div>

        {/* Method and Volume */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">
            MÉTHODE ET VOLUME
          </h2>
          
          {methodData.method === 'list' && methodData.roomObjectQuantities && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <List className="w-5 h-5 mr-2 text-blue-600" />
                  Inventaire par pièce - Liste manuelle
                </h3>
                {Object.entries(methodData.roomObjectQuantities).map(([roomName, objects]) => (
                  <div key={roomName} className="mb-4 p-3 bg-white rounded border border-blue-200">
                    <h4 className="font-medium text-gray-700 mb-2 capitalize">{roomName}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(objects).filter(([_, quantity]) => quantity > 0).map(([objectName, quantity]) => (
                        <div key={objectName} className="flex justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-600">{objectName}</span>
                          <span className="font-medium text-gray-800">{quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {methodData.method === 'photo' && methodData.uploadedImages && methodData.roomAnalysisResults && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-green-600" />
                  Analyse par IA - Photos des pièces
                </h3>
                {methodData.uploadedImages.map((image) => (
                  <div key={image.id} className="mb-4 p-3 bg-white rounded border border-green-200">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={image.preview} 
                          alt="Pièce uploadée" 
                          className="w-24 h-24 object-cover rounded border border-gray-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-700 mb-2 capitalize">{image.roomId}</h4>
                        <div className="text-sm">
                          <p className="font-medium text-gray-600 mb-1">Objets détectés par l'IA :</p>
                          <div className="grid grid-cols-2 gap-1">
                            {Object.entries(methodData.roomAnalysisResults?.[image.roomId] || {})
                              .map(([objectName, val]): [string, number] => [objectName, typeof val === 'number' ? val : (val?.quantity ?? 0)])
                              .filter(([_, q]) => q > 0)
                              .map(([objectName, quantity]) => (
                                <div key={objectName} className="flex justify-between text-xs py-1">
                                  <span className="text-gray-600">{objectName}</span>
                                  <span className="font-medium text-gray-800">{quantity}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {methodData.method === 'surface' && (
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Maximize2 className="w-5 h-5 mr-2 text-orange-600" />
                  Calcul par surface
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Surface déclarée</p>
                    <p className="text-2xl font-bold text-orange-600">{methodData.surface_area || 0} m²</p>
                  </div>
                  <div className="bg-white p-4 rounded border border-orange-200">
                    <p className="text-sm text-gray-600 mb-1">Volume estimé</p>
                    <p className="text-2xl font-bold text-orange-600">{methodData.volume_m3 || 0} m³</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-orange-100 rounded text-sm text-gray-700">
                  <p className="font-medium mb-1">Détail du calcul :</p>
                  <p>• Volume total : {methodData.surface_area ? (parseFloat(methodData.surface_area.toString()) / 2).toFixed(1) : 0} m³</p>
                  <p>• Basé sur la surface : {methodData.surface_area || 0} m²</p>
                  <p>• Coefficient : 1/2 (surface ÷ 2)</p>
                </div>
                
                {/* Special Objects */}
                {methodData.specialObjectQuantities && Object.keys(methodData.specialObjectQuantities).length > 0 && (
                  <div className="mt-4 p-3 bg-orange-50 rounded border border-orange-200">
                    <h4 className="font-medium text-gray-800 mb-2">Objets spéciaux sélectionnés</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(methodData.specialObjectQuantities)
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([objectName, quantity]) => (
                          <div key={objectName} className="flex justify-between py-1 border-b border-orange-100">
                            <span className="text-gray-600">{objectName}</span>
                            <span className="font-medium text-gray-800">{quantity}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Volume total estimé</p>
              <p className="font-medium text-lg">{methodData.volume_m3 || quoteData.volume_m3 || 0} m³</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="font-medium text-lg">{quoteData.distance_km || 0} km</p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">
            ADRESSES
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Adresse de départ</h3>
              <p className="text-sm">{addressData.departure.address}</p>
              <p className="text-sm text-gray-600">
                Étage: {addressData.departure.floor || 'RDC'} | 
                Ascenseur: {addressData.departure.elevator ? 'Oui' : 'Non'}
              </p>
              {addressData.departure.options.portageDistanceM > 0 && (
                <p className="text-sm text-gray-600">
                  Distance de portage: {addressData.departure.options.portageDistanceM}m
                </p>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Adresse d'arrivée</h3>
              <p className="text-sm">{addressData.arrival.address}</p>
              <p className="text-sm text-gray-600">
                Étage: {addressData.arrival.floor || 'RDC'} | 
                Ascenseur: {addressData.arrival.elevator ? 'Oui' : 'Non'}
              </p>
              {addressData.arrival.options.portageDistanceM > 0 && (
                <p className="text-sm text-gray-600">
                  Distance de portage: {addressData.arrival.options.portageDistanceM}m
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">
            OPTIONS SÉLECTIONNÉES
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Pack cartons (fourniture de matériel)</span>
              <span className="font-medium">{optionsData.packCartons ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Date flexible (report jusqu'à 72h avant)</span>
              <span className="font-medium">{optionsData.dateFlexible ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Prix flexible (flexibilité sur 5 jours)</span>
              <span className="font-medium">{optionsData.prixFlexible ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Démontage/Remontage</span>
              <span className="font-medium">{optionsData.demontageRemontage ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Emballage fragile</span>
              <span className="font-medium">{optionsData.emballageFragile ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Emballage cartons (inventaire)</span>
              <span className="font-medium">{optionsData.emballageCartons ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Autorisation de stationnement</span>
              <span className="font-medium">{optionsData.autorisationStationnement ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Transport vêtements (penderies)</span>
              <span className="font-medium">{optionsData.transportVetements ? 'Oui' : 'Non'}</span>
            </div>
            {propertyValue > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Assurance ({formatCurrency(propertyValue)} de biens)</span>
                <span className="font-medium">{formatCurrency(optionsData.assurance)}</span>
              </div>
            )}
            {Object.keys(optionsData.cleaningQuantities).length > 0 && (
              <div className="py-2 border-b">
                {Object.entries(optionsData.cleaningQuantities).map(([service, quantity]) => (
                  <div key={service} className="flex justify-between text-sm">
                    <span>{service}</span>
                    <span>{quantity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quote Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">
            DÉTAIL DU DEVIS
          </h2>
          <div className="space-y-2">
            {quoteData.base_price_transport && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Prix de base transport</span>
                <span className="font-medium">{formatCurrency(quoteData.base_price_transport)}</span>
              </div>
            )}
            {quoteData.etage_total && quoteData.etage_total > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Supplément étages</span>
                <span className="font-medium">{formatCurrency(quoteData.etage_total)}</span>
              </div>
            )}
            {quoteData.ascenseur_total && quoteData.ascenseur_total > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Supplément absence d'ascenseur</span>
                <span className="font-medium">{formatCurrency(quoteData.ascenseur_total)}</span>
              </div>
            )}
            {quoteData.demi_etage_total != null && quoteData.demi_etage_total > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Demi-étage</span>
                <span className="font-medium">{formatCurrency(quoteData.demi_etage_total)}</span>
              </div>
            )}
            {quoteData.escale_total && quoteData.escale_total > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Escales</span>
                <span className="font-medium">{formatCurrency(quoteData.escale_total)}</span>
              </div>
            )}
            {quoteData.portage_total && quoteData.portage_total > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Portage</span>
                <span className="font-medium">{formatCurrency(quoteData.portage_total)}</span>
              </div>
            )}
            {optionsData.assurance > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span>Assurance</span>
                <span className="font-medium">{formatCurrency(optionsData.assurance)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-800">TOTAL DU DEVIS</span>
            <span className="text-3xl font-bold text-blue-600">{formatCurrency(quoteData.final_price)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p>Devis valable 30 jours à compter de la date d'émission</p>
          <p className="mt-2">Pour toute question, contactez-nous au [numéro de téléphone]</p>
        </div>
      </div>
    </div>
  );
};

export default PDFReport;
