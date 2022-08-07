import React, { useState } from 'react';
import styles from './loginForm.module.scss';
import { Button, Input } from '../..';
// import { loginImage } from '../../../assets';

const LoginForm = ({ onLogin }) => {
  const [formValues, setFormValues] = useState({
    emailValue: '',
    passwordValue: '',
  });

  function submitForm(e) {
    e.preventDefault();

    if (formValues) {
      onLogin(formValues.passwordValue, formValues.emailValue);
    } else {
      console.log('email or password can not be empty');
    }
  }

  function getFormValues(e) {
    const value = e.target.value;
    const name = e.target.name;

    setFormValues((oldVlaues) => {
      return { ...oldVlaues, [name]: value };
    });
  }

  return (
    <div className={styles.super_container}>
      <div className={styles.left_container}>
        {/* <img src={loginImage} alt="couple" /> */}
      </div>
      <div className={styles.right_container}>
        <div className={styles.login_box}>
          <div className={styles.login_logo}>Pesto Matrimony</div>
          <div className={styles.signin_text}>Sign in</div>
          <form onSubmit={submitForm}>
            <Input
              type="email"
              placeholder="Email Address"
              name="emailValue"
              value={formValues.emailValue}
              onChangeHandler={getFormValues}
            />
            <br />
            <Input
              type="password"
              placeholder="Password"
              name="passwordValue"
              value={formValues.passwordValue}
              onChangeHandler={getFormValues}
            />
            <br />
            <Button type="submit" />
          </form>
          <p className={styles.paragraph}>Forgot Password</p>
          <p className={styles.paragraph}>
            Don't have an account? <span className={styles.link}>SignUp</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
