import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import CommonLayout from 'layout/CommonLayout';
import MainLayout from 'layout/MainLayout';
import AppSelectionPage from 'pages/AppSelection/AppSelectionPage';
import WareHouseManagmentSystemPage from 'pages/WMS/WareHouseManagmentSystemPage';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));

// render - sample page
// const AppSelectionPage = Loadable(lazy(() => import('pages/AppSelection/AppSelectionPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'apps',
          element: <AppSelectionPage />
        },
        { path: 'wms', element: <WareHouseManagmentSystemPage /> },
        { path: 'wms/:level1', element: <WareHouseManagmentSystemPage /> },
        { path: 'wms/:level1/:level2', element: <WareHouseManagmentSystemPage /> },
        { path: 'wms/:level1/:level2/:level3', element: <WareHouseManagmentSystemPage /> },
        { path: 'finance', element: <WareHouseManagmentSystemPage /> },
        { path: 'finance/:level1', element: <WareHouseManagmentSystemPage /> },
        { path: 'finance/:level1/:level2', element: <WareHouseManagmentSystemPage /> },
        { path: 'finance/:level1/:level2/:level3', element: <WareHouseManagmentSystemPage /> }
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    },
    {
      path: '*',
      element: <MaintenanceError />
    }
  ]
};

export default MainRoutes;
