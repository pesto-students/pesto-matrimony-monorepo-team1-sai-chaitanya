import React from 'react';
import PropTypes from 'prop-types';
import { NavBar } from '../../molecules';
import { SideBar } from '../sideBar';
import QuickLinksCard from '../quickLinksCard';
import styles from './appSkeleton.module.scss';

function AppSkeleton({ children }) {
  return (
    <div className={styles.container}>
      <nav className={styles.navbarWraper}>
        <NavBar />
      </nav>
      <div className={styles.content}>
        <div className={styles.sideBar}>
          <SideBar />
        </div>
        <div className={styles.children}>{children}</div>
        <div className={styles.quickLinksCard}>
          <QuickLinksCard />
        </div>
      </div>
    </div>
  );
}

AppSkeleton.propTypes = {
  children: PropTypes.object,
};

AppSkeleton.defaultProps = {
  children: {},
};

export default AppSkeleton;
