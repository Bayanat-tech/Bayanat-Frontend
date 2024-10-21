import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import CommonLayout from 'layout/CommonLayout';
import MainLayout from 'layout/MainLayout';
import AppSelectionPage from 'pages/AppSelection/AppSelectionPage';
import PickWaveWmsPage from 'pages/WMS/PickWaveWmsPage';
import WareHouseManagmentSystemPage from 'pages/WMS/WareHouseManagmentSystemPage';
import FlowmasterSecPage from 'pages/Security/flowmaster-sec.types';
import AuthGuard from 'utils/route-guard/AuthGuard';
import SalesmanWmsPage from 'pages/WMS/SalesmanWmsPage';
//import SecrollmasterWmsPage from 'pages/WMS/SecrollmasterWmsPage';
//import ProjectmasterPfPage from 'pages/Purchasefolder/ProjectmasterPfPage';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));
const CountryWmsPage = Loadable(lazy(() => import('pages/WMS/CountryWmsPage')));
const DepartmentWmsPage = Loadable(lazy(() => import('pages/WMS/DepartmentWmsPage')));
const LocationWmsPage = Loadable(lazy(() => import('pages/WMS/LocationWmsPage')));
const CurrencyWmsPage = Loadable(lazy(() => import('pages/WMS/CurrencyWmsPage')));
const CostmasterPfPage = Loadable(lazy(() => import('pages/Purchasefolder/CostmasterPfpage')));
const ProjectmasterPfPage = Loadable(lazy(() => import('pages/Purchasefolder/ProjectmasterPfPage')));
//const RollmasterSecPage = Loadable(lazy(() => import('pages/Security/r')));
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
          path: 'security',
          children: [
            {
              path: 'masters',
              children: [
                {
                  path: 'gm',
                  children: [
                    { path: 'flowmaster', element: <FlowmasterSecPage /> },
         //           { path: 'rolemaster', element: <RollmasterSecPage /> },
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
          path: 'pf',
          children: [
            {
              path: 'master',
              children: [
                {
                  path: 'gm',
                  children: [
                    { path: 'costmaster', element: <CostmasterPfPage /> },
                    { path: 'projectmaster', element: <ProjectmasterPfPage /> },
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
