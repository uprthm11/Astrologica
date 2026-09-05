import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouteObject,
  useParams,
  Navigate,
} from 'react-router-dom';
import { ShellLayout } from '@shell/ShellLayout';
import { Hub } from '@routes/Hub';
import { NotFound } from '@routes/NotFound';
import { getModuleById } from '@lib/moduleRegistry';
import { RouteErrorBoundary } from './RouteErrorBoundary';

/**
 * Dynamic Module Route Container
 * Lazily renders pluggable modules registered in moduleRegistry,
 * or redirects unknown modules to /not-found.
 */
export const ModuleRouteView: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const moduleItem = moduleId ? getModuleById(moduleId) : undefined;

  if (!moduleItem) {
    return <Navigate to="/not-found" replace />;
  }

  const Component = moduleItem.component;

  return (
    <Suspense
      fallback={
        <div
          data-testid="module-suspense-fallback"
          className="flex items-center justify-center min-h-[50vh] text-zinc-500 font-mono text-xs tracking-widest uppercase"
        >
          INITIALIZING MODULE...
        </div>
      }
    >
      <div data-testid={`active-module-${moduleItem.id}`}>
        <Component />
      </div>
    </Suspense>
  );
};

export const appRoutes: RouteObject[] = [
  {
    element: <ShellLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Hub />,
      },
      {
        path: '/m/:moduleId/*',
        element: <ModuleRouteView />,
      },
      {
        path: '/not-found',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(appRoutes);
}
