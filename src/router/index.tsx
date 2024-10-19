import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

import Providers from '../Providers';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Providers />,
    children: [
      // Public routes
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/:listId',
        element: <HomePage />,
      },
      {
        path: '/dashboard',
        element: <h1>Dashboard</h1>,
      },
      {
        path: '/protected',
        element: (
          <ProtectedRoute>
            <h1>Protected Route</h1>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
