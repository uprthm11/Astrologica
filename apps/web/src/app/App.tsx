import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { ShellLayout } from '@shell/ShellLayout';
import { Hub } from '@routes/Hub';
import { NotFound } from '@routes/NotFound';
import { getModuleById } from '@lib/moduleRegistry';

const ModuleRouteView: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const moduleItem = moduleId ? getModuleById(moduleId) : undefined;

  if (!moduleItem) {
    return <Navigate to="/not-found" replace />;
  }

  const Component = moduleItem.component;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-zinc-500 font-mono text-xs">
          INITIALIZING MODULE...
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShellLayout />}>
          <Route path="/" element={<Hub />} />
          <Route path="/m/:moduleId/*" element={<ModuleRouteView />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
