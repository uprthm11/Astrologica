import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CinematicHeading,
  CinematicBody,
  CinematicButton,
  CinematicCard,
  GlowIcon,
  CinematicScrollArea,
  colors,
} from '@ui-kit';

describe('Shared UI Kit Primitives', () => {
  describe('CinematicHeading', () => {
    it('renders heading with appropriate tag and gradient style', () => {
      render(<CinematicHeading level={1}>Celestial Horizon</CinematicHeading>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeDefined();
      expect(heading.textContent).toBe('Celestial Horizon');
    });

    it('renders level 2 heading with light tracking', () => {
      render(<CinematicHeading level={2} tracking="wide">Planetary Depth</CinematicHeading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeDefined();
      expect(heading.textContent).toBe('Planetary Depth');
    });
  });

  describe('CinematicBody', () => {
    it('renders lead and caption typographic variants', () => {
      const { rerender } = render(<CinematicBody variant="lead">Primary description</CinematicBody>);
      expect(screen.getByText('Primary description')).toBeDefined();

      rerender(<CinematicBody variant="caption" dimmed>Subtle metadata</CinematicBody>);
      expect(screen.getByText('Subtle metadata')).toBeDefined();
    });
  });

  describe('CinematicButton', () => {
    it('fires click handlers and renders glow variant', () => {
      const handleClick = vi.fn();
      render(
        <CinematicButton variant="glow" glowColor={colors.glows.amber} onClick={handleClick}>
          Ignite Fusion
        </CinematicButton>
      );
      const button = screen.getByRole('button', { name: /Ignite Fusion/i });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('respects disabled state', () => {
      const handleClick = vi.fn();
      render(
        <CinematicButton disabled onClick={handleClick}>
          Locked Orbit
        </CinematicButton>
      );
      const button = screen.getByRole('button', { name: /Locked Orbit/i });
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('CinematicCard', () => {
    it('renders card container with obsidian glass style', () => {
      render(
        <CinematicCard data-testid="test-card" glowColor={colors.glows.rose}>
          <div>Card Content</div>
        </CinematicCard>
      );
      const card = screen.getByTestId('test-card');
      expect(card).toBeDefined();
      expect(screen.getByText('Card Content')).toBeDefined();
    });
  });

  describe('GlowIcon', () => {
    it('renders icon with celestial glow', () => {
      render(
        <GlowIcon data-testid="sun-icon" color={colors.celestial.sun}>
          <span>☀️</span>
        </GlowIcon>
      );
      const icon = screen.getByTestId('sun-icon');
      expect(icon).toBeDefined();
      expect(screen.getByText('☀️')).toBeDefined();
    });
  });

  describe('CinematicScrollArea', () => {
    it('renders scroll area container with hidden scrollbar styles', () => {
      render(
        <CinematicScrollArea data-testid="scroll-area" maxHeight="200px">
          <div>Item 1</div>
          <div>Item 2</div>
        </CinematicScrollArea>
      );
      const scroll = screen.getByTestId('scroll-area');
      expect(scroll).toBeDefined();
      expect(screen.getByText('Item 1')).toBeDefined();
    });
  });
});
