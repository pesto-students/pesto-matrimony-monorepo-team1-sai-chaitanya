import PropTypes from 'prop-types';
import _noop from 'lodash/noop';
import styles from './button.module.scss';

const Button = ({ type, onClick, label, className, children }) => {
  return (
    <button type={type} className={styles[`${className}`]} onClick={onClick}>
      {label || children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  children: null,
  className: 'btn',
  type: 'button',
  label: null,
  onClick: _noop,
};

export default Button;
