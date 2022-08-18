import React from 'react';
import { Button, Result } from '../../atoms';
import { useHistory } from 'react-router-dom';
import { HomeOutlined } from '../../atoms/icon';
import PropTypes from 'prop-types';
import styles from './resultSection.module.scss';

const ResultSection = ({ statusCode, title, subTitle }) => {
  const history = useHistory();
  function homeButtonHandler() {
    history.push('/');
  }
  return (
    <div className={styles.resultSection}>
      <Result
        status={statusCode}
        title={title}
        subTitle={subTitle}
        extra={
          <Button
            type="primary"
            onClick={homeButtonHandler}
            icon={<HomeOutlined />}
          >
            Go Home
          </Button>
        }
      />
    </div>
  );
};

ResultSection.propTypes = {
  statusCode: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
};
ResultSection.defaultProps = {
  statusCode: '404',
  title: '404',
  subTitle: 'Sorry, the page you visited does not exist.',
};

export default ResultSection;
