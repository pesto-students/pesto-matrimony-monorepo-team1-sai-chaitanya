import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '../../atoms';
import styles from './myCard.module.scss';

const MyCard = ({ cardTitle, cardLink, className }) => {
  return (
    <Card
      className={styles[`${className}`]}
      title={cardTitle}
      extra={<a href="#">See all</a>}
      style={{
        width: 400,
      }}
    ></Card>
  );
};

MyCard.propTypes = {
  cardTitle: PropTypes.string,
  cardLink: PropTypes.string,
  className: PropTypes.string,
};

MyCard.defaultProps = {
  cardTitle: 'Masseges',
  cardLink: '#',
  className: 'avatarList',
};

export default MyCard;
