import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import { NavBar } from '../../molecules';
import { SideBar } from '../sideBar';
import QuickLinksCard from '../quickLinksCard';
import styles from './appSkeleton.module.scss';

function AppSkeleton({ children }) {
  const [resClass, setResClass] = useState(true);

  function hideShow(block){
    console.log("hi");
    setResClass(block);
  }
  console.log(resClass);

  return (
    <div className={styles.container}>
      <nav className={styles.navbarWraper}>
        <NavBar resHandler={hideShow} />
      </nav>
      <div className={styles.content}>
        <div className={styles.sideBar}>
          <SideBar />
        </div>
        <div className={styles.children}>{children}</div>
        <div className={styles.quickLinksCard}><QuickLinksCard /></div>
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
