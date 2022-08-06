import { TextField } from '@mui/material';

const LoginForm = () => {
  return (
    <div>
      <TextField
        id="outlined-basic"
        label="Username"
        variant="outlined"
        helperText="Username"
      />
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        type="password"
        helperText="Password"
      />
    </div>
  );
};

export default LoginForm;
