import { Typography } from '@mui/material';
import AppIcon from 'components/AppIcon';
import useAuth from 'hooks/useAuth';

const AppSelectionPage = () => {
  const { permissionBasedMenuTree } = useAuth();
  console.log(permissionBasedMenuTree, 'permissionBasedMenuTree');

  return (
    <div className="flex flex-col space-y-2">
      <Typography className="text-2xl font-semibold">Application</Typography>
      <div className="flex space-x-2 ">
        {permissionBasedMenuTree.map((eachApplication) => (
          <AppIcon item={eachApplication} />
        ))}
      </div>
    </div>
  );
};

export default AppSelectionPage;
