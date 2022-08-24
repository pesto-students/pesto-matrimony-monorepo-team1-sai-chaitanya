import { noop as _noop } from 'lodash';
import { Button, DislikeOutlined, EyeOutlined, LikeOutlined } from '../../atoms';
import PropTypes from 'prop-types';

const AcceptDeclineButtons = ({ acceptInterestHandler, interestSenderId, rejectInterestHandler }) => {
  return (
    <>
      <Button
        type="primary"
        shape="round"
        icon={<EyeOutlined />}
        size="middle"
        target="_blank"
        href={`/profile/${interestSenderId}`}
      >
        View Profile
      </Button>
      <Button type="primary" shape="round" icon={<LikeOutlined />} size="middle" onClick={acceptInterestHandler}>
        Accept
      </Button>
      <Button type="primary" shape="round" icon={<DislikeOutlined />} size="middle" onClick={rejectInterestHandler}>
        Reject
      </Button>
    </>
  );
};
AcceptDeclineButtons.propTypes = {
  acceptInterestHandler: PropTypes.func,
  interestSenderId: PropTypes.string,
  rejectInterestHandler: PropTypes.func,
};
AcceptDeclineButtons.defaultProps = {
  acceptInterestHandler: _noop,
  interestSenderId: 'interestSenderId',
  rejectInterestHandler: _noop,
};

export default AcceptDeclineButtons;
