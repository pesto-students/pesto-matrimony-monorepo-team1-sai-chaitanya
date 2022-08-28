import { AcceptInterestButton, CancelInterestButton, RejectInterestButton, SendInterestButton, SendMessageButton, ShortlistButton } from '../'
import { useParams } from 'react-router-dom';

const UserInfoCardButtons = ({ acceptInterestHandler, cancelInterestHandler, rejectInterestHandler, sendInterestHandler, sendMessageHandler, toggleShortlistHandler }) => {

  const { matchStatus } = useParams();

  let buttonsToDisplay = <> <SendInterestButton onClick={sendInterestHandler} />
    <ShortlistButton onClick={toggleShortlistHandler} />
  </>

  if (matchStatus === "accepted") {
    buttonsToDisplay = <SendMessageButton onClick={sendMessageHandler} />
  } else if (matchStatus === "sent") {
    buttonsToDisplay = <CancelInterestButton onClick={cancelInterestHandler} />
  } else if (matchStatus === "received") {
    buttonsToDisplay = <> <AcceptInterestButton onClick={acceptInterestHandler} />
      <RejectInterestButton onClick={rejectInterestHandler} />
    </>
  }
  return buttonsToDisplay;
}

export default UserInfoCardButtons