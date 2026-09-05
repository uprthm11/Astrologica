import React, { useState, useRef, useEffect } from 'react';

export interface LocationSelectedPayload {
  lat: number;
  lon: number;
  locationName: string;
}

export interface GeocodeResultItem {
  lat: number;
  lon: number;
  display_name: string;
  country?: string;
  state?: string;
  city?: string;
}

export interface LocationSearchInputProps {
  apiBaseUrl?: string;
  onSelectLocation?: (location: LocationSelectedPayload) => void;
  placeholder?: string;
  className?: string;
}

export const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  apiBaseUrl = '',
  onSelectLocation,
  placeholder = 'Enter birthplace (city, country)...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationSelectedPayload | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const debounceTimerRef = useRef<any>(null);

  const searchGeocode = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setErrorMsg(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const endpoint = `${apiBaseUrl}/api/v1/geocode/search`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Geocoding proxy responded with status ${response.status}`);
      }

      const data = await response.json();
      const items: GeocodeResultItem[] = Array.isArray(data) ? data : data.results || [];

      // Filter out any invalid or (0,0) coordinates
      const validItems = items.filter(
        (item) =>
          typeof item.lat === 'number' &&
          typeof item.lon === 'number' &&
          !(item.lat === 0 && item.lon === 0)
      );

      if (validItems.length === 0) {
        setErrorMsg('Location not resolved. No terrestrial coordinates found.');
        setResults([]);
      } else {
        setResults(validItems);
        setIsOpen(true);
      }
    } catch (err: any) {
      // Strictly do not fall back to Null Island (0,0)
      setErrorMsg('Geocoding resolution error. Coordinates remain unanchored.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedLocation(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchGeocode(val);
    }, 400);
  };

  const handleSelectItem = (item: GeocodeResultItem) => {
    // Strictly verify coordinates are valid and not Null Island
    if (item.lat === 0 && item.lon === 0) {
      setErrorMsg('Invalid coordinates (Null Island detected).');
      return;
    }

    const payload: LocationSelectedPayload = {
      lat: item.lat,
      lon: item.lon,
      locationName: item.display_name,
    };

    setSelectedLocation(payload);
    setQuery(item.display_name);
    setIsOpen(false);
    setErrorMsg(null);

    if (onSelectLocation) {
      onSelectLocation(payload);
    }
  };

  return (
    <div
      data-testid="location-search-input"
      className={`relative flex flex-col gap-2 p-6 rounded-2xl bg-zinc-950/60 border border-white/[0.08] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
        <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
          Terrestrial Coordinates
        </span>
        <span className="text-[11px] font-mono text-indigo-400/80 uppercase">
          Backend Proxy Gateway
        </span>
      </div>

      {/* Input */}
      <div className="relative mt-2">
        <input
          type="text"
          data-testid="location-query-input"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-100 placeholder-zinc-500 text-sm font-light focus:outline-none focus:border-white/[0.25] transition-colors"
        />

        {isLoading && (
          <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            <span>RESOLVING...</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div
          data-testid="location-error-message"
          className="text-xs font-mono text-rose-400/90 tracking-wide mt-1"
        >
          {errorMsg}
        </div>
      )}

      {/* Selected Location Pill */}
      {selectedLocation && (
        <div
          data-testid="location-selected-pill"
          className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/30 mt-2"
        >
          <div className="flex flex-col">
            <span className="text-xs text-emerald-200 font-light truncate max-w-xs sm:max-w-md">
              {selectedLocation.locationName}
            </span>
            <span className="text-[10px] font-mono text-emerald-400/70">
              LAT: {selectedLocation.lat.toFixed(4)}° &bull; LON: {selectedLocation.lon.toFixed(4)}°
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300">
            ANCHORED
          </span>
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          data-testid="location-results-dropdown"
          className="absolute left-6 right-6 top-[105px] z-50 max-h-60 overflow-y-auto rounded-xl bg-zinc-950/95 border border-white/[0.15] backdrop-blur-2xl shadow-2xl p-1 divide-y divide-white/[0.05]"
        >
          {results.map((item, index) => (
            <button
              key={`${item.lat}-${item.lon}-${index}`}
              type="button"
              data-testid={`location-result-item-${index}`}
              onClick={() => handleSelectItem(item)}
              className="w-full text-left p-3 rounded-lg hover:bg-white/[0.06] transition-colors flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="text-xs text-zinc-200 font-light truncate">
                {item.display_name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {item.lat.toFixed(4)}°, {item.lon.toFixed(4)}°
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;
