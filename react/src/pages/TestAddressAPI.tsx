/**
 * Test Page for Address API
 * Simple page to test if the Address API integration works
 */

import { useState, useEffect } from 'react';
import { useAddress } from '@/hooks/useAddress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function TestAddressAPI() {
  const { loading, error, addresses, fetchAll, create } = useAddress();
  const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check API status on mount
  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/demenagement/addresses/');
      if (response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (error) {
      console.error('API Status Check Error:', error);
      setApiStatus('offline');
    }
  };

  const handleTestGet = async () => {
    setTestResult('idle');
    const result = await fetchAll();
    if (result) {
      setTestResult('success');
    } else {
      setTestResult('error');
    }
  };

  const handleTestCreate = async () => {
    setTestResult('idle');
    
    // Create a test address
    const testAddress = {
      client_info: 1, // Make sure you have a client with ID 1
      adresse_depart: "Test Address - " + new Date().toLocaleTimeString(),
      etage_depart: "3",
      ascenseur_depart: "Non",
      options_depart: {
        monte_meuble: false,
        cave_ou_garage: true,
        cours_a_traverser: false
      },
      has_stopover: false,
      adresse_arrivee: "Test Arrival Address",
      etage_arrivee: "RDC",
      ascenseur_arrivee: "Non",
      options_arrivee: {
        monte_meuble: true,
        cave_ou_garage: false,
        cours_a_traverser: true
      }
    };

    const result = await create(testAddress);
    if (result) {
      setTestResult('success');
      // Refresh the list
      await fetchAll();
    } else {
      setTestResult('error');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Address API</h1>

      {/* API Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Status</CardTitle>
          <CardDescription>Backend API connection status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {apiStatus === 'checking' && (
              <>
                <Loader2 className="animate-spin" />
                <span>Checking API...</span>
              </>
            )}
            {apiStatus === 'online' && (
              <>
                <CheckCircle2 className="text-green-500" />
                <span className="text-green-500 font-semibold">API is Online ✓</span>
              </>
            )}
            {apiStatus === 'offline' && (
              <>
                <XCircle className="text-red-500" />
                <span className="text-red-500 font-semibold">API is Offline ✗</span>
                <span className="text-sm text-gray-500 ml-2">
                  Make sure the Django server is running on http://127.0.0.1:8000
                </span>
              </>
            )}
          </div>
          <Button 
            onClick={checkAPIStatus} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Recheck
          </Button>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
          <CardDescription>Test API endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={handleTestGet} 
              disabled={loading || apiStatus === 'offline'}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Test GET (List Addresses)
            </Button>
            
            <Button 
              onClick={handleTestCreate} 
              disabled={loading || apiStatus === 'offline'}
              variant="secondary"
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Test POST (Create Address)
            </Button>
          </div>

          {testResult === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>API call completed successfully</AlertDescription>
            </Alert>
          )}

          {testResult === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || 'Failed to complete API call'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Results ({addresses.length} addresses)</CardTitle>
          <CardDescription>Data from the API</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Loading...</span>
            </div>
          )}

          {!loading && addresses.length === 0 && (
            <p className="text-gray-500">No addresses found. Try creating one!</p>
          )}

          {!loading && addresses.length > 0 && (
            <div className="space-y-2">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">ID: {address.id}</p>
                      <p className="text-sm">Client: {address.client_info}</p>
                      <p className="text-sm">De: {address.adresse_depart}</p>
                      <p className="text-sm">À: {address.adresse_arrivee}</p>
                      <p className="text-sm text-gray-500">
                        Étage: {address.etage_depart} → {address.etage_arrivee}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ascenseur: {address.ascenseur_depart} → {address.ascenseur_arrivee}
                      </p>
                      {address.has_stopover && (
                        <p className="text-sm text-blue-500">
                          ✓ Escale: {address.escale_adresse}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(address.created_at || '').toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({
              apiStatus,
              loading,
              error,
              addressCount: addresses.length,
              apiUrl: 'http://127.0.0.1:8000',
            }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

