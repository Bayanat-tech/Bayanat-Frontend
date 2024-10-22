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
import PrincipalWmsPage from 'pages/WMS/PrincipalWmsPage';
import SalesmanWmsPage from 'pages/WMS/SalesmanWmsPage';
<<<<<<< HEAD
//import GroupWmsPage from 'pages/WMS/GroupWmsPage';
=======
import SecrollmasterWmsPage from 'pages/Security/SecrollmasterWmsPage';
import SecmasterWmsPage from 'pages/Security/secmasterWmsPage';
import ItemmasterPfPage from 'pages/Purchasefolder/ItemmasterPfpage';
>>>>>>> qa

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));
const CountryWmsPage = Loadable(lazy(() => import('pages/WMS/CountryWmsPage')));
<<<<<<< HEAD
const DepartmentWmsPage = Loadable(lazy(() => import('pages/WMS/DepartmentWmsPage')));
const BrandWmsPage = Loadable(lazy(() => import('pages/WMS/BrandWmsPage')));
const SupplierWmsPage = Loadable(lazy(() => import('pages/WMS/SupplierWmsPage')));
const LocationWmsPage = Loadable(lazy(() => import('pages/WMS/LocationWmsPage')));
const CurrencyWmsPage = Loadable(lazy(() => import('pages/WMS/CurrencyWmsPage')));
const GroupWmsPage = Loadable(lazy(() => import('pages/WMS/GroupWmsPage')));
const ManufactureWmsPage = Loadable(lazy(() => import('pages/WMS/ManufactureWmsPage')));
=======
// const DepartmentWmsPage = Loadable(lazy(() => import('pages/WMS/DepartmentWmsPage')));
const LocationWmsPage = Loadable(lazy(() => import('pages/WMS/LocationWmsPage')));
const CurrencyWmsPage = Loadable(lazy(() => import('pages/WMS/CurrencyWmsPage')));
const CostmasterPfPage = Loadable(lazy(() => import('pages/Purchasefolder/CostmasterPfpage')));
const ProjectmasterPfPage = Loadable(lazy(() => import('pages/Purchasefolder/ProjectmasterPfPage')));
const BillingActivityPage = Loadable(lazy(() => import('../pages/WMS/ActivityBillingPage')));
>>>>>>> qa

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
                    { path: 'principal', element: <PrincipalWmsPage /> },
                    // { path: 'department', element: <DepartmentWmsPage /> },
                    { path: 'location', element: <LocationWmsPage /> },
                    { path: 'currency', element: <CurrencyWmsPage /> },
                    { path: 'supplier', element: <SupplierWmsPage /> },
                    { path: 'pickwave', element: <PickWaveWmsPage /> },
                    { path: 'salesman', element: <SalesmanWmsPage /> },
<<<<<<< HEAD
                    { path: 'brand', element: <BrandWmsPage /> },
                    { path: 'group', element: <GroupWmsPage /> },
                    { path: 'manufacturer', element: <ManufactureWmsPage /> },
=======
                    { path: 'billingactivity', element: <BillingActivityPage /> },
                    { path: 'secrole', element: <SecrollmasterWmsPage /> },
>>>>>>> qa
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
                    { path: 'rolemaster', element: <SecrollmasterWmsPage /> },
                    { path: 'seclogin', element: <SecmasterWmsPage /> },
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
                    { path: 'itemmaster', element: <ItemmasterPfPage /> },
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
