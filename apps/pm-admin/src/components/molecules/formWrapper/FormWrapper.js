import './formWrapper.css';
import PropTypes from 'prop-types';
import { Logo } from '../../atoms';
import { Link } from 'react-router-dom';

const FormWrapper = ({
  bottomText,
  children,
  formDescription,
  formTitle,
}) => {
  return (
    <div className="superContainer">
      <div className="rightContainer">
        <div className="loginBox">
          <Logo size="medium" />
          <div className="formTitle">{formTitle}</div>
          <div className="formDescription">{formDescription}</div>
          {children}
        </div>
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
  bottomText: 'already have account then!',
  children: {},
  formTitle: 'SignUp',
};

export default FormWrapper;
