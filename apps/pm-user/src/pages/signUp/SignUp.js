import { FormWrapper, SignUpForm } from '../../components';
import styles from './signUp.module.scss';

function SignUp() {
  return (
    <FormWrapper
      bottomText="Already have an account? "
      formTitle="SignUp"
      formDescription="if you dont have account create here!"
      pageToRedirect="login"
      pageToRedirectTitle="LogIn"
      sideImage="signupPage"
    >
      <SignUpForm />
    </FormWrapper>
  );
}

export default SignUp;
