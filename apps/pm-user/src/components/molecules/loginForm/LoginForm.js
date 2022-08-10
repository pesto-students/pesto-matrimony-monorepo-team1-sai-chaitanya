import React, { useState } from 'react';
import styles from './loginForm.module.scss';
import { Button, Input } from '../..';

const LoginForm = ({ onLogin }) => {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  function formSubmitHandler(e) {
    e.preventDefault();
    if (emailValue.trim() && passwordValue.trim()) {
      onLogin(passwordValue, emailValue);
    } else {
      console.log('email or password can not be empty');
    }
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <Input
        type="email"
        placeholder="Email Address"
        name="emailValue"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
      />
      <br />
      <Input
        type="password"
        placeholder="Password"
        name="passwordValue"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
      />
      <br />
      <Button type="submit" label="Login" className="btnLoginSignup" />
    </form>
  );
};

export default LoginForm;
