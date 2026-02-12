/**
 * Address input with Google Places Autocomplete
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { getPlacePredictions, type PlacePrediction } from '@/services/googleMapsApi';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DEBOUNCE_MS = 300;

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Saisir une adresse...',
  className,
  disabled,
}: AddressAutocompleteProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchPredictions = useCallback(async (input: string) => {
    setLoading(true);
    setPredictions([]);
    try {
      const results = await getPlacePredictions(input);
      setPredictions(results);
      setShowDropdown(results.length > 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!value || value.length < 3) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }
    timeoutRef.current = setTimeout(() => fetchPredictions(value), DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, fetchPredictions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (prediction: PlacePrediction) => {
    onChange(prediction.description);
    setPredictions([]);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 3 && predictions.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        autoComplete="off"
      />
      {showDropdown && predictions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {predictions.map((p) => (
            <li
              key={p.place_id}
              role="option"
              onClick={() => handleSelect(p)}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-100 text-slate-900"
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">
          Recherche...
        </span>
      )}
    </div>
  );
}
