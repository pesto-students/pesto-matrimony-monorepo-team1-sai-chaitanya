import React from 'react';
import PropTypes from 'prop-types';
import styles from './logo.module.scss';

const Logo = ({ size }) => {
  console.log(size);
  return <div className={styles[`${size}`]}>Pesto Matrimony</div>;
};

Logo.propTypes = {
  size: PropTypes.string,
};

Logo.defaultProps = {
  size: 'large',
};

export default Logo;

