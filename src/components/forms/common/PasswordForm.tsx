import { TextField } from '@mui/material';
import { Dispatch } from 'react';

const PasswordForm = ({ password, setPassword }: { password: string; setPassword: Dispatch<React.SetStateAction<string>> }) => {
  return (
    <>
      <TextField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        id="outlined-basic"
        variant="outlined"
        name="password"
      />
    </>
  );
};

export default PasswordForm;
