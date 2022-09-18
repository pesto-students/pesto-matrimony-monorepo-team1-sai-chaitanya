import PropTypes from 'prop-types';
import { NavBar } from '../../molecules';
import { SideBar } from '../sideBar';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
// import QuickLinksCard from '../quickLinksCard';
import styles from './appSkeleton.module.scss';

function AppSkeleton({ children }) {
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
            <SideBar />
          </div>
        </Sider>
        <div className={styles.children}>{children}</div>
        {/* <div className={styles.quickLinksCard}>
          <QuickLinksCard />
        </div> */}
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
