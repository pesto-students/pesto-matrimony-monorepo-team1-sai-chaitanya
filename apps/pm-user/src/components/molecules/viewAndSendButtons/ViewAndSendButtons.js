import { Button, ReadOutlined, SendOutlined } from '../../atoms';

const ViewAndSendButtons = ({ sendNewMessageHandler, viewMessagesHandler }) => {
  return <Button
    type="primary"
    shape="round"
    icon={<SendOutlined />}
    size="middle"
    onClick={sendNewMessageHandler}
  >
    View & Send Messages
  </Button>
};

export default ViewAndSendButtons;
