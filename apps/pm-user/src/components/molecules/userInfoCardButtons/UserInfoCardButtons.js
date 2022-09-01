import {
  Button,
  CloseCircleOutlined,
  DislikeOutlined,
  HeartOutlined,
  LikeOutlined,
  ProfileOutlined,
  SendOutlined,
} from '../../atoms';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { noop as _noop } from 'lodash';

// Buttons displayed on UserInfoCard will change
// depending on the page (params) where they are rendered.
const UserInfoCardButtons = ({
  acceptInterestHandler,
  cancelInterestHandler,
  rejectInterestHandler,
  sendInterestHandler,
  sendMessageHandler,
  toggleShortlistHandler,
}) => {
  const { matchStatus } = useParams();

  let buttonsToDisplay = (
    <>
      <Button onClick={sendInterestHandler} type="primary" shape="round" size="middle" icon={<HeartOutlined />}>
        Send Interest
      </Button>
      <Button onClick={toggleShortlistHandler} type="primary" shape="round" size="middle" icon={<ProfileOutlined />}>
        Shortlist
      </Button>
    </>
  );

  if (matchStatus === 'accepted') {
    buttonsToDisplay = (
      <Button type="primary" shape="round" icon={<SendOutlined />} size="middle" onClick={sendMessageHandler}>
        Send Message
      </Button>
    );
  } else if (matchStatus === 'sent') {
    buttonsToDisplay = (
      <Button type="primary" shape="round" icon={<CloseCircleOutlined />} size="middle" onClick={cancelInterestHandler}>
        Cancel Interest
      </Button>
    );
  } else if (matchStatus === 'received') {
    buttonsToDisplay = (
      <>
        <Button type="primary" shape="round" icon={<LikeOutlined />} size="middle" onClick={acceptInterestHandler}>
          Accept
        </Button>
        <Button type="primary" shape="round" icon={<DislikeOutlined />} size="middle" onClick={rejectInterestHandler}>
          Reject
        </Button>
      </>
    );
  }
  return buttonsToDisplay;
};

UserInfoCardButtons.propTypes = {
  acceptInterestHandler: PropTypes.func,
  cancelInterestHandler: PropTypes.func,
  rejectInterestHandler: PropTypes.func,
  sendInterestHandler: PropTypes.func,
  sendMessageHandler: PropTypes.func,
  toggleShortlistHandler: PropTypes.func,
};

UserInfoCardButtons.propTypes = {
  acceptInterestHandler: _noop,
  cancelInterestHandler: _noop,
  rejectInterestHandler: _noop,
  sendInterestHandler: _noop,
  sendMessageHandler: _noop,
  toggleShortlistHandler: _noop,
};

export default UserInfoCardButtons;
