import './formWrapper.css';
import PropTypes from 'prop-types';
import { Logo } from '../../atoms';

const FormWrapper = ({ bottomText, children, formTitle }) => {
  return (
    <div className="superContainer">
      <div className="loginBox">
        <Logo size="medium" />
        <div className="formTitle">{formTitle}</div>
        {children}
      </div>
      <p className="formBottomText">{bottomText}</p>
    </div>
  );
};

FormWrapper.propTypes = {
  bottomText: PropTypes.string,
  children: PropTypes.object,
  formTitle: PropTypes.string,
};

FormWrapper.defaultProps = {
  bottomText: 'If you have problem in login or forget password, please contact to developer!',
  children: {},
  formTitle: 'Admin Login',
};

export default FormWrapper;
