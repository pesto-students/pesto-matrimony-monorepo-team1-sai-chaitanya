import PropTypes from 'prop-types';
import _noop from 'lodash/noop';
import styles from './button.module.scss';

const Button = ({ type, onClick, label, className }) => {
  return (
    <button type={type} className={styles[`${className}`]} onClick={onClick}>
      {label}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  label: 'Button',
  onClick: _noop,
  className: 'btnRed',
};

export default Button;
