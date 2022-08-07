import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.scss';

const Button = ({ type }) => {
  return (
    <button type={type} className={styles.signin_btn}>
      Log in
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
};

Button.defaultProps = {
  type: '',
};

export default Button;
