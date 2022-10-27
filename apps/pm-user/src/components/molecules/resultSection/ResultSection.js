import { Button, HomeOutlined, Result } from '../../atoms';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './resultSection.module.scss';

const ResultSection = ({ statusCode, subTitle, title }) => {
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
          <Button type="primary" onClick={homeButtonHandler} icon={<HomeOutlined />}>
            Go Home
          </Button>
        }
      />
    </div>
  );
};

ResultSection.propTypes = {
  statusCode: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
};
ResultSection.defaultProps = {
  statusCode: '404',
  subTitle: 'Sorry, the page you visited does not exist.',
  title: '404',
};

export default ResultSection;
