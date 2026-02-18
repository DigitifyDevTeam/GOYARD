import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/HeroSection";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RoomSelector } from "@/components/RoomSelector";
import { ArrowLeft, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type Step = 'hero' | 'selection' | 'analysis' | 'quote';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  roomId: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('hero');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [_surfaceArea, setSurfaceArea] = useState<number>(0);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setCurrentStep('selection');
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const handleContinueToAnalysis = async () => {
    // Allow continuing if either a room is selected OR images are uploaded
    if (selectedRoom || uploadedImages.length > 0) {
      setCompletedSteps(prev => [...prev, 'selection']);
      setCurrentStep('analysis');
      
      // Start analysis if there are uploaded images
      if (uploadedImages.length > 0) {
        await analyzeImages();
      } else {
        // If no images, just simulate analysis completion
        setTimeout(() => {
          setAnalysisResults({
            success: true,
            summary: `Estimation basée sur les données moyennes pour ${getRoomName(selectedRoom!)}`,
            object_counts: {},
            total_objects: 0
          });
          setIsAnalyzing(false);
          setAnalysisProgress(100);
        }, 2000);
      }
    }
  };

  const analyzeImages = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResults(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Analyze each uploaded image
      const allResults = [];
      for (const image of uploadedImages) {
        const formData = new FormData();
        formData.append('image', image.file);

        const response = await fetch('/api/predict/', {
          method: 'POST',
          body: formData,
        });

        const results = await response.json();
        
        if (results.success) {
          allResults.push(results);
        } else {
          throw new Error(results.error || 'Analysis failed');
        }
      }

      // Combine results
      const combinedResults = combineAnalysisResults(allResults);
      setAnalysisResults(combinedResults);
      setAnalysisProgress(100);
      
      clearInterval(progressInterval);
      
      toast({
        title: "Analyse terminée",
        description: combinedResults.summary || "Analyse des images terminée avec succès",
      });

    } catch (error) {
      console.error('Analysis error:', error);
      let errorMessage = 'Erreur lors de l\'analyse';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setAnalysisResults({
        success: false,
        error: errorMessage
      });
      
      toast({
        title: "Erreur d'analyse",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to calculate volume and quote based on object counts
  const calculateVolumeAndQuote = (objectCounts: Record<string, number>) => {
    // Object volumes mapping (same as backend)
    const OBJECT_VOLUMES: Record<string, number> = {
      "Banc": 0.5,
      "Chaise": 0.25,
      "Chaise de bureau": 0.8,
      "Transat": 0.5,
      "Canapé 3 places (-80KG)": 2.50,
      "Canapé d'angle (-80KG)": 3.0,
      "Table basse": 0.8,
      "Moyenne table": 1.0,
      "Table moyenne": 1.0,
      "Table de jardin": 2.6,
      "Table de ping-pong (-80KG)": 2.6,
      "Bureau": 0.9,
      "lit simple": 2.0,
      "lit double": 2.5,
      "Banc de musculation (-80KG)": 0.25,
      "Armoire 2p (-80KG)": 3.0,
      "Armoire ancienne (-80KG)": 3.0,
      "Commode": 0.9,
      "Buffet haut": 1.5,
      "Meuble TV bas": 1.5,
      "Meuble a chaussure": 0.5,
      "Meuble salle de bain": 0.9,
      "Colonne salle de bain": 0.75,
      "Vaisselier (-80KG)": 3.0,
      "Chiffronier": 0.75,
      "Etagère": 0.75,
      "Etagére muale": 1.0,
      "Console": 0.75,
      "Coffre a linge": 0.25,
      "Coffre de rangement": 0.5,
      "Boîte ou panier": 0.3,
      "Télevision": 0.25,
      "hifi": 0.2,
      "Aspirateur": 0.2,
      "séche linge": 0.5,
      "Lave linge": 0.5,
      "Lave vaisselle": 0.5,
      "Micro ondes": 0.25,
      "Four": 0.55,
      "Cuisinière (-80KG)": 0.5,
      "Frigo-congélateur": 1.0,
      "Lampadaire": 0.3,
      "Lampe de bureau": 0.2,
      "Cadre": 0.2,
      "Miroir": 0.2,
      "Plante en pot": 0.7,
      "Paravent": 0.07,
      "Guitare": 0.05,
      "Tapis petit": 0.7,
      "Tapis moyen": 1.4,
      "Barbecue": 0.75,
      "Parasol": 0.4,
      "Echelle": 0.5,
      "Escabeau": 0.7,
      "Etendoir": 0.2,
      "Vélo": 0.5,
      "Vélo d'intérieur (-80KG)": 0.7,
      "Tapis de course (-80KG)": 1.5,
      "valises": 0.2,
      "Carton": 0.10,
      "Porte manteau": 0.5,
    };

    const PRICE_PER_M3 = 50.0;
    
    let totalVolume = 0.0;
    const volumeBreakdown: Record<string, any> = {};
    const calculationDetails: string[] = [];

    // Calculate volume for each object type
    for (const [objectName, count] of Object.entries(objectCounts)) {
      const volumePerUnit = OBJECT_VOLUMES[objectName] || 0.0;
      
      if (volumePerUnit > 0) {
        const objectTotalVolume = count * volumePerUnit;
        totalVolume += objectTotalVolume;
        
        volumeBreakdown[objectName] = {
          count: count,
          volume_per_unit: volumePerUnit,
          total_volume: objectTotalVolume
        };
        
        calculationDetails.push(
          `${count} × ${objectName} = ${count} × ${volumePerUnit}m³ = ${objectTotalVolume}m³`
        );
      } else {
        volumeBreakdown[objectName] = {
          count: count,
          volume_per_unit: 0.0,
          total_volume: 0.0,
          note: 'Volume not defined for this object'
        };
        calculationDetails.push(
          `${count} × ${objectName} = Volume not defined (0m³)`
        );
      }
    }

    // Calculate quote
    const finalPrice = totalVolume * PRICE_PER_M3;
    const quoteCalculationSteps = [
      `Total Volume Detected: ${totalVolume.toFixed(2)}m³`,
      `Price per m³: ${PRICE_PER_M3}€`,
      `Final Calculation: ${totalVolume.toFixed(2)}m³ × ${PRICE_PER_M3}€ = ${finalPrice.toFixed(2)}€`
    ];

    return {
      volume_calculation: {
        total_volume: Math.round(totalVolume * 100) / 100,
        volume_breakdown: volumeBreakdown,
        calculation_details: calculationDetails,
        formula: `Total = ${Object.values(volumeBreakdown).filter((v: any) => v.total_volume > 0).map((v: any) => `${v.total_volume}m³`).join(' + ')} = ${totalVolume.toFixed(2)}m³`
      },
      quote_calculation: {
        total_volume_m3: Math.round(totalVolume * 100) / 100,
        price_per_m3: PRICE_PER_M3,
        final_price: Math.round(finalPrice * 100) / 100,
        currency: 'EUR',
        calculation_steps: quoteCalculationSteps,
        breakdown: {
          volume_cost: `${totalVolume.toFixed(2)}m³ × ${PRICE_PER_M3}€ = ${finalPrice.toFixed(2)}€`,
          total: `Total: ${finalPrice.toFixed(2)}€`
        }
      }
    };
  };

  const combineAnalysisResults = (results: any[]) => {
    const combinedCounts: Record<string, number> = {};
    let totalObjects = 0;

    // Combine all object counts from all results
    results.forEach(result => {
      if (result.object_counts) {
        Object.entries(result.object_counts).forEach(([object, count]) => {
          combinedCounts[object] = (combinedCounts[object] || 0) + (count as number);
          totalObjects += count as number;
        });
      }
    });

    // Create summary
    const summaryParts: string[] = [];
    Object.entries(combinedCounts).forEach(([object, count]) => {
      if (count === 1) {
        summaryParts.push(`1 ${object}`);
      } else {
        summaryParts.push(`${count} ${object}s`);
      }
    });

    // Calculate volume and quote based on combined counts
    const calculations = calculateVolumeAndQuote(combinedCounts);

    return {
      success: true,
      object_counts: combinedCounts,
      summary: summaryParts.length > 0 ? summaryParts.join(', ') : "Aucun objet détecté",
      total_objects: totalObjects,
      individual_results: results,
      volume_calculation: calculations.volume_calculation,
      quote_calculation: calculations.quote_calculation
    };
  };

  const handleSurfaceChange = (surface: number) => {
    setSurfaceArea(surface);
  };

  const handleImagesUpload = (images: UploadedImage[]) => {
    setUploadedImages(prev => [...prev, ...images]);
  };

  const handleDeleteImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(image => image.id !== imageId));
  };

  const getRoomName = (roomId: string) => {
    const roomNames: Record<string, string> = {
      'salon': 'salon',
      'cuisine': 'cuisine',
      'chambre': 'chambre',
      'salle-de-bain': 'salle de bain',
      'bureau': 'bureau',
      'entree': 'entrée',
      'garage': 'garage',
      'salle-a-manger': 'salle à manger',
      'autre': 'autre pièce'
    };
    return roomNames[roomId] || roomId;
  };

  if (currentStep === 'hero') {
    return (
      <div className="min-h-screen">
        <HeroSection onGetStarted={handleGetStarted} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {currentStep !== 'selection' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep('hero')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            )}
            <h1 className="text-2xl font-bold">Move AI Snap</h1>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Devis gratuit par IA
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'selection' && (
            <>
              <RoomSelector
                selectedRoom={selectedRoom}
                onRoomSelect={handleRoomSelect}
                rooms={['salon', 'cuisine', 'chambre', 'salle-de-bain', 'bureau', 'entree', 'garage', 'salle-a-manger', 'autre']}
                uploadedImages={uploadedImages}
                onImagesUpload={(imgs) => handleImagesUpload(imgs as UploadedImage[])}
                onContinue={handleContinueToAnalysis}
                hasUploadedImages={uploadedImages.length > 0}
                onSurfaceChange={handleSurfaceChange}
                onDeleteImage={handleDeleteImage}
              />
            </>
          )}

          {currentStep === 'quote' && analysisResults && (
            <div className="text-center py-16 fade-in">
              <div className="max-w-4xl mx-auto">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-green-600">Votre Devis Personnalisé</h2>
                
                {analysisResults.quote_calculation ? (
                  <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Volume Information */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">Détails du Volume</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Volume total détecté:</span>
                            <span className="font-semibold">{analysisResults.quote_calculation.total_volume_m3} m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prix par m³:</span>
                            <span className="font-semibold">{analysisResults.quote_calculation.price_per_m3}€</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Prix total:</span>
                            <span className="font-semibold">{analysisResults.quote_calculation.final_price}€</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quote Summary */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">Résumé du Devis</h3>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-2">
                              {analysisResults.quote_calculation.final_price}€
                            </div>
                            <div className="text-blue-100">
                              Prix total pour votre déménagement
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Volume × Prix:</span>
                            <span>{analysisResults.quote_calculation.total_volume_m3}m³ × {analysisResults.quote_calculation.price_per_m3}€</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>{analysisResults.quote_calculation.final_price}€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Explanation - Calculation Details */}
                    {analysisResults.volume_calculation && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Explanation</h3>
                        
                        {/* Calculation Steps - Dynamic from API */}
                        <div className="bg-blue-50 rounded-lg p-6 mb-6">
                          <h4 className="font-semibold mb-3 text-blue-800">Calculation Steps:</h4>
                          <div className="space-y-2 text-sm">
                            {analysisResults.volume_calculation.calculation_details && analysisResults.volume_calculation.calculation_details.length > 0 ? (
                              analysisResults.volume_calculation.calculation_details.map((step: string, index: number) => (
                                <div key={index} className="flex items-center">
                                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                    {index + 1}
                                  </span>
                                  <span className="text-blue-700">{step}</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-blue-700">No objects detected - using default room estimation</div>
                            )}
                          </div>
                          <div className="mt-4 pt-3 border-t border-blue-200">
                            <div className="flex items-center">
                              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                =
                              </span>
                              <span className="font-semibold text-green-700">
                                Total Volume: {analysisResults.volume_calculation.total_volume}m³
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Final Quote Calculation - Dynamic from API */}
                        <div className="bg-green-50 rounded-lg p-6">
                          <h4 className="font-semibold mb-3 text-green-800">Final Quote Calculation:</h4>
                          <div className="space-y-2 text-sm">
                            {analysisResults.quote_calculation.calculation_steps ? (
                              analysisResults.quote_calculation.calculation_steps.map((step: string, index: number) => (
                                <div key={index} className="flex items-center">
                                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                    {index + 1}
                                  </span>
                                  <span className="text-green-700">{step}</span>
                                </div>
                              ))
                            ) : (
                              // Fallback to static display if calculation_steps not available
                              <>
                                <div className="flex items-center">
                                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                    1
                                  </span>
                                  <span className="text-green-700">
                                    Total Volume: {analysisResults.quote_calculation.total_volume_m3}m³
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                    2
                                  </span>
                                  <span className="text-green-700">
                                    Price per m³: {analysisResults.quote_calculation.price_per_m3}€
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                    3
                                  </span>
                                  <span className="text-green-700">
                                    Calculation: {analysisResults.quote_calculation.total_volume_m3}m³ × {analysisResults.quote_calculation.price_per_m3}€ = {analysisResults.quote_calculation.final_price}€
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="mt-4 pt-3 border-t border-green-200">
                            <div className="flex items-center">
                              <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                                €
                              </span>
                              <span className="font-bold text-lg text-green-800">
                                Final Quote: {analysisResults.quote_calculation.final_price}€
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                    <p className="text-yellow-800">
                      Aucun objet détecté. Estimation basée sur la surface de la pièce.
                    </p>
                  </div>
                )}
                
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => setCurrentStep('selection')}
                    variant="outline"
                  >
                    Nouvelle Estimation
                  </Button>
                  <Button 
                    onClick={() => {
                      // Here you could implement quote saving or sharing
                      toast({
                        title: "Devis généré",
                        description: "Votre devis a été généré avec succès!",
                      });
                    }}
                    className="px-8 py-3"
                  >
                    Confirmer le Devis
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'analysis' && (
            <div className="text-center py-16 fade-in">
              <div className="max-w-md mx-auto">
                {isAnalyzing ? (
                  <>
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 float">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Analyse IA en cours...</h2>
                    <p className="text-muted-foreground mb-6">
                      Notre IA analyse {uploadedImages.length > 0 ? 'vos photos et ' : ''}le type de pièce sélectionné pour estimer le volume et la complexité de votre déménagement.
                    </p>
                    <div className="w-full bg-muted rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${analysisProgress}%` }} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {uploadedImages.length > 0 
                        ? `Analyse de ${uploadedImages.length} photo(s) pour ${selectedRoom ? getRoomName(selectedRoom) : 'cette pièce'}...`
                        : `Estimation basée sur les données moyennes pour ${selectedRoom ? getRoomName(selectedRoom) : 'cette pièce'}...`
                      }
                    </p>
                  </>
                ) : analysisResults ? (
                  <>
                    {analysisResults.success ? (
                      <>
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-green-600">Analyse terminée !</h2>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                          <p className="text-green-800 font-medium mb-2">Résultats de l'analyse :</p>
                          <p className="text-green-700">{analysisResults.summary}</p>
                          {analysisResults.total_objects > 0 ? (
                            <p className="text-sm text-green-600 mt-2">
                              Total : {analysisResults.total_objects} objet{analysisResults.total_objects > 1 ? 's' : ''}
                            </p>
                          ) : (
                            <p className="text-sm text-green-600 mt-2">
                              Aucun objet détecté dans cette image
                            </p>
                          )}
                        </div>
                        <Button 
                          onClick={() => setCurrentStep('quote')}
                          className="px-8 py-3"
                        >
                          Générer le devis
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Erreur d'analyse</h2>
                        <p className="text-red-600 mb-6">{analysisResults.error}</p>
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep('selection')}
                        >
                          Réessayer
                        </Button>
                      </>
                    )}
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
