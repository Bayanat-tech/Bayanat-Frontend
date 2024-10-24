import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
import Message from './Message';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import MegaMenuSection from './MegaMenuSection';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';

// types
import { MenuOrientation } from 'types/config';
import Localization from './Localization';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const { i18n, menuOrientation } = useConfig();

  const megaMenu = useMemo(() => <MegaMenuSection />, []);
  const localization = useMemo(() => <Localization />, [i18n]);

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />}
      {!downLG && megaMenu}
      {!downLG && localization}

      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      <Message />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
};

export default HeaderContent;
