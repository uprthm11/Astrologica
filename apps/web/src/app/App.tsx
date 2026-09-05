import React, { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createAppRouter } from './router';

export const App: React.FC = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};

export default App;
