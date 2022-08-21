import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../atoms';
import styles from './myCard.module.scss';

const MyCard = ({ cardLink, cardTitle, children, className }) => {
  return (
    <Card
      className={styles[`${className}`]}
      title={cardTitle}
      extra={<a href={cardLink}>See all</a>}
      style={{
        width: "100%",
      }}
    >
      {children}
    </Card>
  );
};

MyCard.propTypes = {
  cardLink: PropTypes.string,
  cardTitle: PropTypes.string,
  children: PropTypes.object,
  className: PropTypes.string,
};

MyCard.defaultProps = {
  cardLink: '#',
  cardTitle: 'Masseges',
  children: {},
  className: 'avatarList',
};

export default MyCard;
