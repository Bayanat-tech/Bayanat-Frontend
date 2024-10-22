import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MasterSelectionAutoComplete from 'components/MasterSelectionAutoComplete';
import CommonLayout from 'layout/CommonLayout';
import MainLayout from 'layout/MainLayout';
import AppSelectionPage from 'pages/AppSelection/AppSelectionPage';
import PickWaveWmsPage from 'pages/WMS/PickWaveWmsPage';
import SalesmanWmsPage from 'pages/WMS/SalesmanWmsPage';
import WareHouseManagmentSystemPage from 'pages/WMS/WareHouseManagmentSystemPage';
import AuthGuard from 'utils/route-guard/AuthGuard';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));
const CountryWmsPage = Loadable(lazy(() => import('pages/WMS/CountryWmsPage')));
const DepartmentWmsPage = Loadable(lazy(() => import('pages/WMS/DepartmentWmsPage')));
const LocationWmsPage = Loadable(lazy(() => import('pages/WMS/LocationWmsPage')));
const CurrencyWmsPage = Loadable(lazy(() => import('pages/WMS/CurrencyWmsPage')));
const UomWmsPage = Loadable(lazy(() => import('pages/WMS/UomWmsPage')));
const MocWmsPage = Loadable(lazy(() =>import('pages/WMS/MocWmsPage')));
const Moc2WmsPage = Loadable(lazy(() =>import('pages/WMS/MocWmsPage')));
const UocWmsPage = Loadable(lazy(() =>import('pages/WMS/UocWmsPage')));
const Harmonize = Loadable(lazy(() =>import('pages/WMS/HarmonizeWmsPage')));
const ActivitySubgroupWms = Loadable(lazy(() =>import('pages/WMS/ActivitySubgroupWmsPage')));


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
                    { path: 'location', element: <LocationWmsPage /> },
                    { path: 'currency', element: <CurrencyWmsPage /> },
                    { path: 'pickwave', element: <PickWaveWmsPage /> },
                    { path: 'salesman', element: <SalesmanWmsPage /> },
                    { path: 'uom', element: <UomWmsPage /> },
                    { path: 'moc', element: <MocWmsPage/>},
                    { path: 'moc2', element: <Moc2WmsPage/>},
                    { path: 'uoc', element: <UocWmsPage/>},
                    { path: 'harmonize', element: <Harmonize/>},
                    { path: 'activitysubgroup', element: <ActivitySubgroupWms/>},
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
