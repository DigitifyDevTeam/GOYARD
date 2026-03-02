/**
 * Address input with Google Places Autocomplete
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const updateDropdownPosition = useCallback(() => {
    if (containerRef.current && showDropdown) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [showDropdown]);

  useEffect(() => {
    if (!showDropdown || !containerRef.current) {
      setDropdownStyle(null);
      return;
    }
    updateDropdownPosition();
    const onScrollOrResize = () => updateDropdownPosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [showDropdown, predictions.length, updateDropdownPosition]);

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
        const target = e.target as HTMLElement;
        if (!target.closest('[data-address-autocomplete-dropdown]')) {
          setShowDropdown(false);
        }
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

  const dropdownList = showDropdown && predictions.length > 0 && dropdownStyle && typeof document !== 'undefined' && (
    <ul
      data-address-autocomplete-dropdown
      className="fixed z-[9999] rounded-md border border-slate-200 bg-white py-1 shadow-lg max-h-[280px] overflow-y-auto overflow-x-auto"
      role="listbox"
      style={{
        top: dropdownStyle.top,
        left: dropdownStyle.left,
        width: dropdownStyle.width,
      }}
    >
      {predictions.map((p) => (
        <li
          key={p.place_id}
          role="option"
          onClick={() => handleSelect(p)}
          className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-100 text-slate-900 whitespace-nowrap"
        >
          {p.description}
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 3 && predictions.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        className={cn("min-w-0", className)}
        disabled={disabled}
        autoComplete="off"
      />
      {dropdownList && createPortal(dropdownList, document.body)}
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600">
          Recherche...
        </span>
      )}
    </div>
  );
}
