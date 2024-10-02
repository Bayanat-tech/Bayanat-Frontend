import { To } from 'history';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase, CardMedia } from '@mui/material';
import { SxProps } from '@mui/system';

// project import
// import LogoIcon from './LogoIcon';
import bayanatLogo from 'assets/images/bayanat.png';

import { APP_DEFAULT_PATH } from 'config';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps;
  to?: To;
}

const LogoSection = ({ reverse, isIcon, sx, to }: Props) => (
  <ButtonBase disableRipple component={Link} to={!to ? APP_DEFAULT_PATH : to} sx={sx}>
    {
      isIcon ? (
        <CardMedia component={'img'} src={bayanatLogo} sx={{ width: '200px', height: '50px' }} />
      ) : (
        <CardMedia component={'img'} src={bayanatLogo} sx={{ width: '200px', height: '50px' }} />
      )
      //  <Logo reverse={reverse} />
    }
  </ButtonBase>
);

export default LogoSection;
