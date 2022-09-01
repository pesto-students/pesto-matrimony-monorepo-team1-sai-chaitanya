import {
  AcceptInterestButton,
  CancelInterestButton,
  RejectInterestButton,
  SendInterestButton,
  SendMessageButton,
  ShortlistButton,
} from '../';
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
      <SendInterestButton onClick={sendInterestHandler} />
      <ShortlistButton onClick={toggleShortlistHandler} />
    </>
  );

  if (matchStatus === 'accepted') {
    buttonsToDisplay = <SendMessageButton onClick={sendMessageHandler} />;
  } else if (matchStatus === 'sent') {
    buttonsToDisplay = <CancelInterestButton onClick={cancelInterestHandler} />;
  } else if (matchStatus === 'received') {
    buttonsToDisplay = (
      <>
        <AcceptInterestButton onClick={acceptInterestHandler} />
        <RejectInterestButton onClick={rejectInterestHandler} />
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
