import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Avatar, List } from '../../atoms';
import { useDispatch, useSelector } from 'react-redux';
import { getInterestRecivedData } from '../../../redux/actions/Actions';
import { useOktaAuth } from '@okta/okta-react';
import styles from './userItemsList.module.scss';

const UserItemsList = ({ className, userdescription, userImageSrc, userProfileLink, userTitle }) => {
  const dispatch = useDispatch();
  const { oktaAuth, authState } = useOktaAuth();

  //getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
      dispatch(getInterestRecivedData(oktaUserId));
  }, []);

  const userProfileInfo = useSelector((state) => state.getInterestRecivedDataReducer.data || {});

  console.log(userProfileInfo);


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
    {
      title: 'Ant Design Title 4',
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
