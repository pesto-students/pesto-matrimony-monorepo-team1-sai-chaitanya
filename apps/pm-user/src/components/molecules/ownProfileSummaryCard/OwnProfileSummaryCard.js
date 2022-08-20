import { startCase, toLower } from 'lodash';
import PropTypes from 'prop-types';
import styles from './ownProfileSummaryCard.module.scss';

const OwnProfileSummaryCard = ({ imgSrc, isSubscribed, name, profileId }) => {
  return (
    <div className={styles.outerFlexBox}>
      <div>
        <img src={imgSrc} alt={`profile image of ${name}`} />
      </div>
      <div className={styles.innerFlexBox}>
        <div>
          <p>{startCase(toLower(name))}</p>
          <p className={styles.id}>ID: {profileId}</p>
        </div>
        <p>
          <a href={null} className={styles.links}>
            Edit
          </a>
        </p>
      </div>
      <div className={styles.innerFlexBox}>
        <div>
          <p>Account Type</p>
          <p>Free Membership</p>
        </div>
        <p>
          {!isSubscribed ? (
            <a href={null} className={styles.links}>
              'Upgrade'
            </a>
          ) : (
            ''
          )}
        </p>
      </div>
    </div>
  );
};

OwnProfileSummaryCard.propTypes = {
  imageSrc: PropTypes.string,
  isSubscribed: PropTypes.bool,
  name: PropTypes.string,
  profileId: PropTypes.string,
};

OwnProfileSummaryCard.defaultProps = {
  imageSrc: null,
  isSubscribed: false,
  name: 'Umesh Ahirvar',
  profileId: 'ABCD1234',
};

export default OwnProfileSummaryCard;
