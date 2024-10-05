import { useEffect, useState } from 'react';

// material-ui
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project import
import NavGroup from './NavGroup';

import { HORIZONTAL_MAX_ITEM } from 'config';
import useConfig from 'hooks/useConfig';
import { dispatch, useSelector } from 'store';

// types
import useAuth from 'hooks/useAuth';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router';
import { setSelectedApp } from 'store/reducers/customReducer/slice.menuSelectionSlice';
import { MenuOrientation } from 'types/config';
import { NavItemType } from 'types/menu';
import { getPathNameList } from 'utils/functions';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const theme = useTheme();
  const location = useLocation();

  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { app } = useSelector((state) => state.menuSelectionSlice);
  const { permissionBasedMenuTree } = useAuth();

  const { menuOrientation } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);
  const [selectedItems, setSelectedItems] = useState<string | undefined>('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<{ items: NavItemType[] }>({ items: [] });

  useEffect(() => {
    const pathNameList = getPathNameList(location.pathname);
    dispatch(setSelectedApp(pathNameList[0]));
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    handlerMenuItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app]);

  const handlerMenuItem = () => {
    if (!!app && !!permissionBasedMenuTree) {
      const selectAppIndex = permissionBasedMenuTree.findIndex((eachApp) => eachApp.url_path === app);

      setMenuItems(() => {
        return {
          items: [
            {
              id: 'other',
              title: <FormattedMessage id="Modules" />,
              type: 'group',
              children: [...(permissionBasedMenuTree[selectAppIndex]?.children ?? [])]
            }
            // ...menuItem.items
          ]
        };
      });
    }
  };

  // useLayoutEffect(() => {
  //   setMenuItems(menuItem);
  //   // eslint-disable-next-line
  // }, [menuItem]);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems: NavItemType[] = [];
  let lastItemId: string;

  //  first it checks menu item is more than giving HORIZONTAL_MAX_ITEM after that get lastItemid by giving horizontal max
  // item and it sets horizontal menu by giving horizontal max item lastly slice menuItem from array and set into remItems

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id!;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem!}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });
  return (
    <Box
      sx={{
        pt: drawerOpen ? (isHorizontal ? 0 : 2) : 0,
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block'
      }}
    >
      {navGroups}
    </Box>
  );
};

export default Navigation;
