import React from 'react';
import { DEFAULT_SELECTED_ITEM_KEY, MENU_ITEMS } from './constants';
import { Menu } from '../../atoms';
import { ProfileSummary } from '../../molecules';
import { QuickInfoBar } from '../../molecules';
import styles from './sideBar.module.scss';

function SideBar() {
  const handleMenuItemClick = ({ key }) => {
    //some code here
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSummary}>
        <ProfileSummary
          imageChangeLink="#"
          userDetails="Software Developer, 32"
          userImageSrc="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          userName="Vinit Sharma"
        />
      </div>
      <div className={styles.quickInfoBarWraper}>
        <QuickInfoBar />
      </div>
      <div className={styles.menu}>
        <Menu
          defaultSelectedKeys={[DEFAULT_SELECTED_ITEM_KEY]}
          items={MENU_ITEMS}
          onClick={handleMenuItemClick}
          style={{
            borderRight: 'none',
          }}
        />
      </div>
      <div className={styles.settings}></div>
    </div>
  );
}

export default SideBar;
