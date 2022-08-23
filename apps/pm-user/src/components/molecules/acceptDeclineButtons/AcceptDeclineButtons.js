import {
  Button,
  DislikeOutlined,
  EyeOutlined,
  LikeOutlined,
} from '../../atoms';

const AcceptDeclineButtons = ({
  acceptInterestHandler,
  interestSenderId,
  rejectInterestHandler,
}) => {
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
        View Sender's Profile
      </Button>
      <Button
        type="primary"
        shape="round"
        icon={<LikeOutlined />}
        size="middle"
        onClick={acceptInterestHandler}
      >
        Accept
      </Button>
      <Button
        type="primary"
        shape="round"
        icon={<DislikeOutlined />}
        size="middle"
        onClick={rejectInterestHandler}
      >
        Reject
      </Button>
    </>
  );
};

export default AcceptDeclineButtons;
