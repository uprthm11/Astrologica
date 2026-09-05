import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { appRoutes } from '../router';

// Mock WebGL canvas in jsdom to avoid headless WebGL errors while tracking mount count
let canvasMountCount = 0;
let canvasUnmountCount = 0;

vi.mock('@shell/UniverseCanvas', () => {
  return {
    UniverseCanvas: () => {
      React.useEffect(() => {
        canvasMountCount++;
        return () => {
          canvasUnmountCount++;
        };
      }, []);
      return <div data-testid="mocked-universe-canvas">WebGL Universe Canvas Singleton</div>;
    },
    default: () => {
      React.useEffect(() => {
        canvasMountCount++;
        return () => {
          canvasUnmountCount++;
        };
      }, []);
      return <div data-testid="mocked-universe-canvas">WebGL Universe Canvas Singleton</div>;
    },
  };
});

describe('Frontend Global Routing Architecture', () => {
  beforeEach(() => {
    canvasMountCount = 0;
    canvasUnmountCount = 0;
  });

  it('renders the Hub route (/) with 4 dynamic module cards', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { level: 1, name: /Astrologica/i })).toBeDefined();
    expect(screen.getByTestId('module-card-western-astrology')).toBeDefined();
    expect(screen.getByTestId('module-card-vedic-astrology')).toBeDefined();
    expect(screen.getByTestId('module-card-compatibility-checker')).toBeDefined();
    expect(screen.getByTestId('module-card-mbti-checker')).toBeDefined();
  });

  it('renders 404 NotFound view when accessing invalid routes', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/unknown-galactic-route'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByText(/Coordinates Not Found/i)).toBeDefined();
    expect(screen.getByText(/Return to Hub/i)).toBeDefined();
  });

  it('redirects unknown module routes (/m/invalid-module) to /not-found', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/m/invalid-module-id'],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByText(/Coordinates Not Found/i)).toBeDefined();
  });

  it('guarantees ZERO UniverseCanvas unmounts across page route transitions', async () => {
    const router = createMemoryRouter(appRoutes, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={router} />);

    // Initial mount at /
    expect(canvasMountCount).toBe(1);
    expect(canvasUnmountCount).toBe(0);

    // Transition to another route: /not-found
    await act(async () => {
      await router.navigate('/not-found');
    });

    // Verify canvas context was NOT unmounted
    expect(canvasMountCount).toBe(1);
    expect(canvasUnmountCount).toBe(0);

    // Transition back to /
    await act(async () => {
      await router.navigate('/');
    });

    // Still exactly 1 mount, 0 unmounts
    expect(canvasMountCount).toBe(1);
    expect(canvasUnmountCount).toBe(0);
  });

  it('confirms complete elimination of legacy step machine variables', () => {
    // Verify no window or global step variables remain
    expect((window as any).cinematicStep).toBeUndefined();
    expect((window as any).advanceStep).toBeUndefined();
    expect((window as any).revealSlide).toBeUndefined();
  });
});
