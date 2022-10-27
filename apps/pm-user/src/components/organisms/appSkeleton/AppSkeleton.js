import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavBar } from '../../molecules';
import { SideBar } from '../sideBar';
import QuickLinksCard from '../quickLinksCard';
import { Layout, Menu } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import styles from './appSkeleton.module.scss';

function AppSkeleton({ children }) {
  const [resClass, setResClass] = useState(true);

  function hideShow(block) {
    console.log('hi');
    setResClass(block);
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbarWraper}>
        <NavBar />
      </nav>
      <div className={styles.content}>
        <Sider
          breakpoint="sm"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            // console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
          }}
        >
          <div className={styles.sideBar}>
            <SideBar className={styles.sideBarInAppSkelaton} />
          </div>
        </Sider>

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
