import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// material-ui
import { Box, Container, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Drawer from './Drawer';
import HorizontalBar from './Drawer/HorizontalBar';
import Footer from './Footer';
import Header from './Header';

import useConfig from 'hooks/useConfig';
import navigation from 'menu-items';
import AppSelectionPage from 'pages/AppSelection/AppSelectionPage';
import { dispatch } from 'store';
import { openDrawer } from 'store/reducers/menu';
import { MenuOrientation } from 'types/config';
// const AppSelectionPage = Loadable(lazy(() => import('pages/AppSelection/AppSelectionPage')));

// types

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownXL = useMediaQuery(theme.breakpoints.down('xl'));
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const location = useLocation();
  const pathName = location.pathname;
  const { container, miniDrawer, menuOrientation } = useConfig();

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      dispatch(openDrawer(!matchDownXL));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownXL]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      {pathName.substring(1) === 'apps' ? (
        <div className="m-28">
          <AppSelectionPage />
        </div>
      ) : (
        <>
          <Header />
          {!isHorizontal ? <Drawer /> : <HorizontalBar />}
          <Box component="main" sx={{ width: 'calc(100% - 260px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
            <Toolbar sx={{ mt: isHorizontal ? 8 : 'inherit' }} />
            <Container
              maxWidth={container ? 'xl' : false}
              sx={{
                ...(container && { px: { xs: 0, sm: 2 } }),
                position: 'relative',
                minHeight: 'calc(100vh - 110px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />
              {/*---------main contrnt here------ */}
              <Outlet />
              <Footer />
            </Container>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MainLayout;
