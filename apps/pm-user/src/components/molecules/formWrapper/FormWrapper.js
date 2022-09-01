import styles from './formWrapper.module.scss';
import PropTypes from 'prop-types';
import { Logo } from '../../atoms';
import { Link } from 'react-router-dom';

const FormWrapper = ({
  bottomText,
  children,
  formDescription,
  formTitle,
  pageToRedirect,
  pageToRedirectTitle,
  sideImage,
}) => {
  return (
    <div className={styles.superContainer}>
      <div className={styles.leftContainer}>
        <img src={require(`../../../assets/images/${sideImage}.jpg`)} />
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.loginBox}>
          {/* <div className={styles.logInLogo}>Pesto Matrimony</div> */}
          <Logo size="medium" />
          <div className={styles.formTitle}>{formTitle}</div>
          <div className={styles.formDescription}>{formDescription}</div>
          {children}
          <p className={styles.formBottomText}>
            {bottomText}
            <Link to={`/${pageToRedirect}`}>
              <span className={styles.redirectLink}>{pageToRedirectTitle}</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

FormWrapper.propTypes = {
  bottomText: PropTypes.string,
  children: PropTypes.object,
  formTitle: PropTypes.string,
  pageToRedirect: PropTypes.string,
  pageToRedirectTitle: PropTypes.string,
  sideImage: PropTypes.string,
};

FormWrapper.defaultProps = {
  bottomText: 'already have account then!',
  children: {},
  formTitle: 'SignUp',
  pageToRedirect: 'login',
  pageToRedirectTitle: 'Login',
  sideImage: 'signupPage',
};

export default FormWrapper;
