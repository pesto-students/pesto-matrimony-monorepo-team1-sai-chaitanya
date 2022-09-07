import { Logo } from '../../../../../../libs/pm-ui/src/lib/components';
import styles from './navBar.module.scss';

const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <Logo size="small" />
    </div>
  );
};

export default NavBar;
