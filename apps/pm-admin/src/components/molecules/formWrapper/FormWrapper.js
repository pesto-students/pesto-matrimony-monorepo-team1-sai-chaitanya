import styles from './formWrapper.module.scss';
import PropTypes from 'prop-types';
import { Logo } from '../../../../../../libs/pm-ui/src/lib/components';

const FormWrapper = ({
  bottomText,
  children,
  formDescription,
  formTitle,
}) => {
  return (
    <div className={styles.superContainer}>
        <div className={styles.loginBox}>
          <Logo size="medium" />
          <div className={styles.formTitle}>{formTitle}</div>
          <div className={styles.formDescription}>{formDescription}</div>
          {children}
          <p className={styles.formBottomText}>
            {bottomText}
          </p>
        </div>
    </div>
  );
};

FormWrapper.propTypes = {
  bottomText: PropTypes.string,
  children: PropTypes.object,
  formTitle: PropTypes.string,  
};

FormWrapper.defaultProps = {
  bottomText: 'If have problem in login contact developer!',
  children: {},
  formTitle: 'Admin Login',
};

export default FormWrapper;
