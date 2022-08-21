import React from 'react';
import { Logo } from '../../atoms';
import styles from './navBar.module.scss';

const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <Logo />
    </div>
  );
};

export default NavBar;
