import React from 'react';
import { Button, Logo } from '../../atoms';
import styles from './header.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <Logo />
      <div>
        <Button label="Sign Up" />
      </div>
    </div>
  );
};

export default Header;
