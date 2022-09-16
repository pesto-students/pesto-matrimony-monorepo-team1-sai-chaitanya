import { Logo, MenuUnfoldOutlined } from '../../atoms';
import styles from './navBar.module.scss';

const NavBar = ({resHandler}) => {

  function hideMe(){
    const value = resHandler("block")
  }

  return (
    <div className={styles.navBar}>
      <Logo size="small" />
      <MenuUnfoldOutlined className={styles.hamBurgerForMobileScreen} onClick={() => hideMe()} />
    </div>
  );
};

export default NavBar;
