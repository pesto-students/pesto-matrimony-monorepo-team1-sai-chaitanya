import { Button, ReadOutlined, SendOutlined } from '../../atoms';

const ViewAndSendButtons = ({ sendNewMessageHandler, viewMessagesHandler }) => {
  return (
    <>
      <Button
        type="primary"
        shape="round"
        icon={<ReadOutlined />}
        size="middle"
        onClick={viewMessagesHandler}
      >
        View Messages
      </Button>
      <Button
        type="primary"
        shape="round"
        icon={<SendOutlined />}
        size="middle"
        onClick={sendNewMessageHandler}
      >
        New Message
      </Button>
    </>
  );
};

export default ViewAndSendButtons;
