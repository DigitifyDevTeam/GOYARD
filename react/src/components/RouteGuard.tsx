import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredData?: string[];
  redirectTo?: string;
}

// Define which routes require data completion
const PROTECTED_ROUTES = [
  '/tunnel/choix-volume',
  '/tunnel/mon-volume/liste',
  '/tunnel/mon-volume/ai', 
  '/tunnel/mon-volume/surface',
  '/tunnel/ai-results',
  '/tunnel/adresses',
  '/tunnel/devis',
  '/tunnel/info',
  '/tunnel/options'
];

// Define the first step route that must be completed
const FIRST_STEP_ROUTE = '/tunnel/mes-coordonnees';

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredData = ['firstName', 'lastName', 'email', 'phone'],
  redirectTo = FIRST_STEP_ROUTE 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDataComplete, setIsDataComplete] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkDataCompletion = () => {
      // Check if current route is protected
      const isProtectedRoute = PROTECTED_ROUTES.includes(location.pathname);
      
      if (!isProtectedRoute) {
        setIsDataComplete(true);
        setIsChecking(false);
        return;
      }

      // Check if user has completed the first step (API submission)
      const completionStatus = localStorage.getItem('formCompletionStatus');
      const hasCompletedFirstStep = completionStatus === 'true' || 
                                   localStorage.getItem('clientId') !== null ||
                                   localStorage.getItem('userFormSubmitted') === 'true';
      
      if (hasCompletedFirstStep) {
        setIsDataComplete(true);
      } else {
        // Check if required data exists in localStorage as fallback
        const storedData = localStorage.getItem('userFormData');
        
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            const hasRequiredData = requiredData.every(field => 
              parsedData[field] && parsedData[field].trim() !== ''
            );
            
            setIsDataComplete(hasRequiredData);
            
            if (!hasRequiredData) {
              // Redirect to first step if data is incomplete
              navigate(redirectTo, { replace: true });
            }
          } catch (error) {
            console.error('Error parsing stored data:', error);
            setIsDataComplete(false);
            navigate(redirectTo, { replace: true });
          }
        } else {
          // No data stored, redirect to first step
          setIsDataComplete(false);
          navigate(redirectTo, { replace: true });
        }
      }
      
      setIsChecking(false);
    };

    checkDataCompletion();
  }, [location.pathname, navigate, redirectTo, requiredData]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  // If data is not complete, show access denied message
  if (!isDataComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h1>
          
          <p className="text-gray-600 mb-6">
            Vous devez d'abord compléter vos informations personnelles pour accéder à cette page.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => navigate(redirectTo)}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux informations
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Data is complete, render the protected content
  return <>{children}</>;
};

export default RouteGuard;
