import React from 'react';
import { FormWraper, SignUpForm } from '../../components';
import styles from './signUp.module.scss';

function SignUp() {
  return (
    <FormWraper
      bottomText="Already have account then!"
      formTitle="SignUp"
      formDescription="if you dont have account create here!"
      pageToRedirect="login"
      pageToRedirectTitle="LogIn"
      sideImage="signupPage"
    >
      <SignUpForm />
    </FormWraper>
  );
}

export default SignUp;
