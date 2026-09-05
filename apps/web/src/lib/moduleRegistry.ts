import React, { lazy } from 'react';

export interface ModuleManifestItem {
  id: string;
  name: string;
  category: string;
  description: string;
  route: string;
  accentColor: string;
  glowColor: string;
  tag: string;
  enabled: boolean;
  status: 'active' | 'coming_soon' | 'disabled';
  component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
}

// Read feature flags from Vite environment (defaults to true for coming-soon hub display)
const isFlagEnabled = (flagName: string, defaultValue: boolean = true): boolean => {
  const envVal = import.meta.env[flagName];
  if (envVal === undefined) return defaultValue;
  return envVal === 'true' || envVal === true || envVal === '1';
};

export const MODULE_REGISTRY: ModuleManifestItem[] = [
  {
    id: 'western-astrology',
    name: 'Western Astrology',
    category: 'Natal & Aspects',
    description: 'Deep psychological synthesis, natal planetary chart calculations, and tight aspect analysis.',
    route: '/m/western-astrology',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    tag: 'Psychological Depth',
    enabled: isFlagEnabled('VITE_FEATURE_WESTERN_ASTROLOGY', true),
    status: 'coming_soon',
    component: lazy(() => import('@modules/western-astrology/routes')),
  },
  {
    id: 'vedic-astrology',
    name: 'Vedic Astrology',
    category: 'Sidereal & Dashas',
    description: 'Sidereal calculations, lunar mansions (27 Nakshatras), and Vimshottari Dasha life cycles.',
    route: '/m/vedic-astrology',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    tag: 'Nakshatra Engine',
    enabled: isFlagEnabled('VITE_FEATURE_VEDIC_ASTROLOGY', true),
    status: 'coming_soon',
    component: lazy(() => import('@modules/vedic-astrology/routes')),
  },
  {
    id: 'compatibility-checker',
    name: 'Compatibility Checker',
    category: 'Synastry Dynamics',
    description: 'Composite chart harmonies, inter-aspect tension points, and relational behavioral resonance.',
    route: '/m/compatibility-checker',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    tag: 'Relational Resonance',
    enabled: isFlagEnabled('VITE_FEATURE_COMPATIBILITY_CHECKER', true),
    status: 'coming_soon',
    component: lazy(() => import('@modules/compatibility-checker/routes')),
  },
  {
    id: 'mbti-checker',
    name: 'MBTI Checker',
    category: 'Typology & Cognitive',
    description: 'Jungian cognitive function stacks, shadow function dynamics, and behavioral typology matrix.',
    route: '/m/mbti-checker',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    tag: 'Archetypal Psychology',
    enabled: isFlagEnabled('VITE_FEATURE_MBTI_CHECKER', true),
    status: 'coming_soon',
    component: lazy(() => import('@modules/mbti-checker/routes')),
  },
];

export function getRegisteredModules(): ModuleManifestItem[] {
  return MODULE_REGISTRY;
}

export function getEnabledModules(): ModuleManifestItem[] {
  return MODULE_REGISTRY.filter((mod) => mod.enabled);
}

export function getModuleById(id: string): ModuleManifestItem | undefined {
  return MODULE_REGISTRY.find((mod) => mod.id === id);
}
