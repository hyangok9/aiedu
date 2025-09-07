
import type { RouteObject } from 'react-router-dom';
import HomePage from '../pages/home/page';
import AdminPage from '../pages/admin/page';
import InquiryPage from '../pages/inquiry/page';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/inquiry',
    element: <InquiryPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
