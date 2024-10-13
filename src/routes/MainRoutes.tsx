import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MasterSelectionAutoComplete from 'components/MasterSelectionAutoComplete';
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
const CountryWmsPage = Loadable(lazy(() => import('pages/WMS/CountryWmsPage')));
const DepartmentWmsPage = Loadable(lazy(() => import('pages/WMS/DepartmentWmsPage')));

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
        {
          path: 'wms',
          children: [
            {
              path: 'masters',
              children: [
                {
                  path: 'gm',
                  children: [
                    { path: 'city', element: <CountryWmsPage /> },
                    { path: 'country', element: <CountryWmsPage /> },
                    { path: 'department', element: <DepartmentWmsPage /> },
                    { path: '*', element: <MaintenanceError /> }
                  ]
                },
                {
                  path: 'inbound'
                },
                {
                  path: '*',
                  element: <MaintenanceComingSoon />
                }
              ]
            }
          ]
        },
        {
          path: 'finance',
          element: <MasterSelectionAutoComplete />,
          children: [
            { path: 'accounts/ac_tree', element: <MasterSelectionAutoComplete /> },
            { path: ':level1', element: <MasterSelectionAutoComplete /> },
            { path: ':level1/:level2/:level3', element: <MasterSelectionAutoComplete /> }
          ]
        },
        {
          path: '*',
          element: <MaintenanceComingSoon />
        }
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
      element: <WareHouseManagmentSystemPage />
    }
  ]
};

export default MainRoutes;
