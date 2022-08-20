import React from 'react';
import { Menu } from '../../atoms';
import { ProfileSummery } from "../../molecules";
import styles from './sideBar.module.scss';
import { DEFAULT_SELECTED_ITEM_KEY, MENU_ITEMS } from './constants';

function SideBar() {

  const handleMenuItemClick = ({ key }) => {
    //some code here
  };


  return (
    <div className={styles.container}>
    <div className={styles.profileSummary}>
        <ProfileSummery imageChangeLink="#" userDetails="Software Developer, 32" userImageSrc="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" userName="Vinit Sharma" />
      </div>
      <div className={styles.menu}>
        <Menu
          defaultSelectedKeys={[DEFAULT_SELECTED_ITEM_KEY]}
          items={MENU_ITEMS}
          onClick={handleMenuItemClick}
          style={{
            borderRight: "none"
          }}
        />
      </div>
      <div className={styles.settings}></div>
    </div>
  );
}

export default SideBar;
