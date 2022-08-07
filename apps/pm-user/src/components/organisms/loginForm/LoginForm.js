import React, { useState } from 'react';
import './loginForm.scss';
import { Button, MyInput } from '../../../components';
import { loginImage } from '../../../assets';

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
    <div className="super_container">
      <div className="left_container">
        <img src={loginImage} alt="couple" />
      </div>
      <div className="right_container">
        <div className="login_box">
          <div className="login_logo">Pesto Matrimony</div>
          <div className="signin_text">Sign in</div>
          <form onSubmit={submitForm}>
            <MyInput
              type="email"
              placeholder="Email Address"
              name="emailValue"
              value={formValues.emailValue}
              onChangeHandler={getFormValues}
            />
            <br />
            <MyInput
              type="password"
              placeholder="password"
              name="passwordValue"
              value={formValues.passwordValue}
              onChangeHandler={getFormValues}
            />
            <br />
            <Button type="submit" />
          </form>
          <p>Forgot Password</p>
          <p>
            Don't have an account? <span className="signup_link">SignUp</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
