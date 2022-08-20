import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, List } from '../../atoms';
import styles from './userItemsList.module.scss';

const UserItemsList = ({
  className,
  userdescription,
  userImageSrc,
  userProfileLink,
  userTitle,
}) => {
  //demo data
  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];

  return (
    <List
      className={styles[`${className}`]}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={userImageSrc} />}
            title={<a href={userProfileLink}>{item.title}</a>}
            description={userdescription}
          />
        </List.Item>
      )}
    />
  );
};

UserItemsList.propTypes = {
  className: PropTypes.string,
  userdescription: PropTypes.string,
  userImageSrc: PropTypes.string,
  userProfileLink: PropTypes.string,
  userTitle: PropTypes.string,
};

UserItemsList.defaultProps = {
  className: 'avatarList',
  userdescription: 'User description comes here',
  userImageSrc: 'https://joeschmoe.io/api/v1/random',
  userProfileLink: '#',
  userTitle: 'User Name',
};

export default UserItemsList;
