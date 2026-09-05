import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import {
  isLeapYear,
  getDaysInMonth,
  isValidDate,
  BirthDateTimeInput,
  LocationSearchInput,
} from '@ui-kit';

describe('Shared Onboarding Primitives & Dynamic Validation', () => {
  describe('Leap Year and Calendar Mathematics', () => {
    it('accurately identifies standard and century leap years', () => {
      // Standard leap years
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2020)).toBe(true);
      expect(isLeapYear(2016)).toBe(true);

      // Standard non-leap years
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(2021)).toBe(false);
      expect(isLeapYear(2019)).toBe(false);

      // Century rules
      expect(isLeapYear(2000)).toBe(true);  // divisible by 400
      expect(isLeapYear(1900)).toBe(false); // divisible by 100 but not 400
      expect(isLeapYear(2100)).toBe(false); // divisible by 100 but not 400
      expect(isLeapYear(2400)).toBe(true);  // divisible by 400
    });

    it('returns exact days in month dynamically respecting leap years', () => {
      // February days
      expect(getDaysInMonth(2024, 2)).toBe(29);
      expect(getDaysInMonth(2023, 2)).toBe(28);
      expect(getDaysInMonth(2000, 2)).toBe(29);
      expect(getDaysInMonth(1900, 2)).toBe(28);

      // 30-day months
      expect(getDaysInMonth(2024, 4)).toBe(30); // April
      expect(getDaysInMonth(2024, 6)).toBe(30); // June
      expect(getDaysInMonth(2024, 9)).toBe(30); // September
      expect(getDaysInMonth(2024, 11)).toBe(30); // November

      // 31-day months
      expect(getDaysInMonth(2024, 1)).toBe(31); // January
      expect(getDaysInMonth(2024, 3)).toBe(31); // March
      expect(getDaysInMonth(2024, 5)).toBe(31); // May
      expect(getDaysInMonth(2024, 7)).toBe(31); // July
      expect(getDaysInMonth(2024, 8)).toBe(31); // August
      expect(getDaysInMonth(2024, 10)).toBe(31); // October
      expect(getDaysInMonth(2024, 12)).toBe(31); // December
    });

    it('validates leap year calendar limits dynamically (Feb 29 vs Feb 28)', () => {
      // Leap year 2024
      expect(isValidDate(2024, 2, 29)).toBe(true);
      expect(isValidDate(2024, 2, 30)).toBe(false);

      // Non-leap year 2023
      expect(isValidDate(2023, 2, 28)).toBe(true);
      expect(isValidDate(2023, 2, 29)).toBe(false);

      // April (30 days)
      expect(isValidDate(2024, 4, 30)).toBe(true);
      expect(isValidDate(2024, 4, 31)).toBe(false);
    });

    it('BirthDateTimeInput clamps days when switching from 31-day month to February', async () => {
      let emittedValue: any = null;
      render(
        <BirthDateTimeInput
          initialDate="2023-01-31" // Non-leap year Jan 31
          onChange={(val) => {
            emittedValue = val;
          }}
        />
      );

      // Switch month to February
      const monthSelect = screen.getByTestId('birth-month-select');
      fireEvent.change(monthSelect, { target: { value: '2' } });

      await waitFor(() => {
        // Day must be clamped to 28 (non-leap year)
        expect(emittedValue.day).toBe(28);
        expect(emittedValue.month).toBe(2);
        expect(emittedValue.isValid).toBe(true);
      });
    });
  });

  describe('LocationSearchInput & Backend Geocoding Proxy', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('calls POST /api/v1/geocode/search exclusively and emits clean lat/lon/locationName', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            lat: 22.7196,
            lon: 75.8577,
            display_name: 'Indore, Madhya Pradesh, India',
          },
        ],
      });
      global.fetch = mockFetch;

      let selectedLocation: any = null;
      render(
        <LocationSearchInput
          onSelectLocation={(loc) => {
            selectedLocation = loc;
          }}
        />
      );

      const input = screen.getByTestId('location-query-input');
      fireEvent.change(input, { target: { value: 'Indore' } });

      // Await debounce and fetch
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Verify request endpoint is exclusively backend proxy
      const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
      expect(calledUrl).toContain('/api/v1/geocode/search');
      expect(calledUrl).not.toContain('nominatim.openstreetmap.org');
      expect(calledOptions.method).toBe('POST');
      expect(JSON.parse(calledOptions.body)).toEqual({ query: 'Indore' });

      // Verify results dropdown appears
      await waitFor(() => {
        expect(screen.getByTestId('location-result-item-0')).toBeDefined();
      });

      // Click result
      fireEvent.click(screen.getByTestId('location-result-item-0'));

      // Verify emitted payload
      expect(selectedLocation).toEqual({
        lat: 22.7196,
        lon: 75.8577,
        locationName: 'Indore, Madhya Pradesh, India',
      });
    });

    it('strictly NEVER sets coordinates to (0,0) Null Island on geocoding failure', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
      });
      global.fetch = mockFetch;

      let selectedLocation: any = null;
      render(
        <LocationSearchInput
          onSelectLocation={(loc) => {
            selectedLocation = loc;
          }}
        />
      );

      const input = screen.getByTestId('location-query-input');
      fireEvent.change(input, { target: { value: 'Atlantis Sunken City' } });

      await waitFor(() => {
        expect(screen.getByTestId('location-error-message')).toBeDefined();
      });

      // selectedLocation must NOT be called with (0,0)
      expect(selectedLocation).toBeNull();
    });

    it('filters out Null Island (0,0) even if returned by upstream mock', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            lat: 0,
            lon: 0,
            display_name: 'Null Island Buoy',
          },
        ],
      });
      global.fetch = mockFetch;

      render(<LocationSearchInput />);
      const input = screen.getByTestId('location-query-input');
      fireEvent.change(input, { target: { value: 'Null Island' } });

      await waitFor(() => {
        expect(screen.getByTestId('location-error-message')).toBeDefined();
      });

      // Dropdown should be empty (0,0 filtered out)
      expect(screen.queryByTestId('location-result-item-0')).toBeNull();
    });
  });

  describe('Architectural Invariants & Zero timezones[0] Enforcement', () => {
    it('asserts zero timezones[0] references exist in web codebase', () => {
      const srcDir = path.resolve(__dirname, '..');
      
      function scanDir(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            scanDir(fullPath);
          } else if (/\.(js|jsx|ts|tsx)$/.test(file) && !file.includes('.test.')) {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const needle = 'time' + 'zones[0]';
            expect(
              content.includes(needle),
              `File ${fullPath} must not contain '${needle}'`
            ).toBe(false);
          }
        }
      }

      scanDir(srcDir);
    });
  });
});
