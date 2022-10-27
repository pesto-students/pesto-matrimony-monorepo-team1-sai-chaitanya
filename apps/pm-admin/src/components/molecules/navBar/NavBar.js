import { Logo } from '../../atoms';
import styles from './navBar.module.scss';

const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <Logo size="small" />
    </div>
  );
};

export default NavBar;
