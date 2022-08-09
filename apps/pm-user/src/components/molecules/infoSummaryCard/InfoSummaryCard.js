import PropTypes from 'prop-types';
import _noop from 'lodash/noop';
import styles from './infoSummaryCard.module.scss';

const InfoSummaryCard = ({ className, count, label, target }) => {
  return (
    <div className={styles[`${className}`]}>
      <p className={styles.right}>{count}</p>
      <div className={styles.center}>
        <div className={styles.img}></div>
        <div className={styles.name}>
          <a href={target}>{label}</a>
        </div>
      </div>
    </div>
  );
};

InfoSummaryCard.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
  label: PropTypes.string,
  target: PropTypes.string,
};

InfoSummaryCard.defaultProps = {
  count: 0,
  className: 'cardRed',
  label: "Give 'label' prop",
  target: undefined,
};

export default InfoSummaryCard;

// See these examples to understand how this works.
{
  /* 
      <InfoSummaryCard label="Unread Messages" className="redCard" count={4} />
      <InfoSummaryCard label="Interests Sent" className="yellowCard" count={5} />
      <InfoSummaryCard
        label="Interests Received"
        className="blueCard"
        count={10}
      />
      <InfoSummaryCard
        label="Interests Accepted"
        className="greenCard"
        count={2}
      />
*/
}
