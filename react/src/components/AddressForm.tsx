/**
 * Address Form Component
 * Example component showing how to use the Address API
 */

import { useState } from 'react';
import { useAddress } from '@/hooks/useAddress';
import { ETAGE_CHOICES, ASCENSEUR_CHOICES, AddressData } from '@/services/addressApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddressFormProps {
  clientId: number;
  onSuccess?: (address: AddressData) => void;
}

export const AddressForm = ({ clientId, onSuccess }: AddressFormProps) => {
  const { loading, error, create, clearError } = useAddress();

  // Form state
  const [formData, setFormData] = useState({
    adresse_depart: '',
    etage_depart: 'RDC',
    ascenseur_depart: 'Non',
    options_depart: {
      monte_meuble: false,
      cave_ou_garage: false,
      cours_a_traverser: false,
    },
    has_stopover: false,
    escale_adresse: '',
    escale_etage: 'RDC',
    escale_ascenseur: 'Non',
    escale_options: {
      monte_meuble: false,
      cave_ou_garage: false,
      cours_a_traverser: false,
    },
    adresse_arrivee: '',
    etage_arrivee: 'RDC',
    ascenseur_arrivee: 'Non',
    options_arrivee: {
      monte_meuble: false,
      cave_ou_garage: false,
      cours_a_traverser: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const addressData = {
      client_info: clientId,
      ...formData,
    };

    const result = await create(addressData);

    if (result && onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Adresse de départ */}
      <Card>
        <CardHeader>
          <CardTitle>Adresse de départ</CardTitle>
          <CardDescription>Informations sur votre adresse actuelle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adresse_depart">Adresse complète *</Label>
            <Input
              id="adresse_depart"
              value={formData.adresse_depart}
              onChange={(e) => setFormData({ ...formData, adresse_depart: e.target.value })}
              placeholder="123 Rue de la Paix, 75001 Paris"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="etage_depart">Étage *</Label>
              <Select
                value={formData.etage_depart}
                onValueChange={(value) => setFormData({ ...formData, etage_depart: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ETAGE_CHOICES.map((etage) => (
                    <SelectItem key={etage} value={etage}>
                      {etage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ascenseur_depart">Ascenseur *</Label>
              <Select
                value={formData.ascenseur_depart}
                onValueChange={(value) => setFormData({ ...formData, ascenseur_depart: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASCENSEUR_CHOICES.map((choice) => (
                    <SelectItem key={choice} value={choice}>
                      {choice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Options</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="monte_meuble_depart"
                checked={formData.options_depart.monte_meuble}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options_depart: { ...formData.options_depart, monte_meuble: checked },
                  })
                }
              />
              <Label htmlFor="monte_meuble_depart" className="cursor-pointer">
                Monte-meuble
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="cave_ou_garage_depart"
                checked={formData.options_depart.cave_ou_garage}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options_depart: { ...formData.options_depart, cave_ou_garage: checked },
                  })
                }
              />
              <Label htmlFor="cave_ou_garage_depart" className="cursor-pointer">
                Cave ou garage
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="cours_a_traverser_depart"
                checked={formData.options_depart.cours_a_traverser}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options_depart: { ...formData.options_depart, cours_a_traverser: checked },
                  })
                }
              />
              <Label htmlFor="cours_a_traverser_depart" className="cursor-pointer">
                Cours à traverser
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Escale */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Escale intermédiaire</CardTitle>
              <CardDescription>Arrêt entre le départ et l'arrivée (optionnel)</CardDescription>
            </div>
            <Switch
              checked={formData.has_stopover}
              onCheckedChange={(checked) => setFormData({ ...formData, has_stopover: checked })}
            />
          </div>
        </CardHeader>
        {formData.has_stopover && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="escale_adresse">Adresse escale *</Label>
              <Input
                id="escale_adresse"
                value={formData.escale_adresse}
                onChange={(e) => setFormData({ ...formData, escale_adresse: e.target.value })}
                placeholder="456 Avenue des Champs, 75008 Paris"
                required={formData.has_stopover}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="escale_etage">Étage *</Label>
                <Select
                  value={formData.escale_etage}
                  onValueChange={(value) => setFormData({ ...formData, escale_etage: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ETAGE_CHOICES.map((etage) => (
                      <SelectItem key={etage} value={etage}>
                        {etage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escale_ascenseur">Ascenseur *</Label>
                <Select
                  value={formData.escale_ascenseur}
                  onValueChange={(value) => setFormData({ ...formData, escale_ascenseur: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASCENSEUR_CHOICES.map((choice) => (
                      <SelectItem key={choice} value={choice}>
                        {choice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Adresse d'arrivée */}
      <Card>
        <CardHeader>
          <CardTitle>Adresse d'arrivée</CardTitle>
          <CardDescription>Informations sur votre nouvelle adresse</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adresse_arrivee">Adresse complète *</Label>
            <Input
              id="adresse_arrivee"
              value={formData.adresse_arrivee}
              onChange={(e) => setFormData({ ...formData, adresse_arrivee: e.target.value })}
              placeholder="789 Boulevard Saint-Germain, 75006 Paris"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="etage_arrivee">Étage *</Label>
              <Select
                value={formData.etage_arrivee}
                onValueChange={(value) => setFormData({ ...formData, etage_arrivee: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ETAGE_CHOICES.map((etage) => (
                    <SelectItem key={etage} value={etage}>
                      {etage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ascenseur_arrivee">Ascenseur *</Label>
              <Select
                value={formData.ascenseur_arrivee}
                onValueChange={(value) => setFormData({ ...formData, ascenseur_arrivee: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASCENSEUR_CHOICES.map((choice) => (
                    <SelectItem key={choice} value={choice}>
                      {choice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Options</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="monte_meuble_arrivee"
                checked={formData.options_arrivee.monte_meuble}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options_arrivee: { ...formData.options_arrivee, monte_meuble: checked },
                  })
                }
              />
              <Label htmlFor="monte_meuble_arrivee" className="cursor-pointer">
                Monte-meuble
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="cave_ou_garage_arrivee"
                checked={formData.options_arrivee.cave_ou_garage}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options_arrivee: { ...formData.options_arrivee, cave_ou_garage: checked },
                  })
                }
              />
              <Label htmlFor="cave_ou_garage_arrivee" className="cursor-pointer">
                Cave ou garage
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="cours_a_traverser_arrivee"
                checked={formData.options_arrivee.cours_a_traverser}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    options_arrivee: { ...formData.options_arrivee, cours_a_traverser: checked },
                  })
                }
              />
              <Label htmlFor="cours_a_traverser_arrivee" className="cursor-pointer">
                Cours à traverser
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Enregistrement...' : 'Enregistrer l\'adresse'}
      </Button>
    </form>
  );
};

