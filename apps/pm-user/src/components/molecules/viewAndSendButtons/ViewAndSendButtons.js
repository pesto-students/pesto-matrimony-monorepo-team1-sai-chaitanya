import { Button, SendOutlined } from '../../atoms';
import { noop as _noop } from 'lodash';
import PropTypes from 'prop-types';
const ViewAndSendButtons = ({ sendNewMessageHandler }) => {
  return (
    <Button type="primary" shape="round" icon={<SendOutlined />} size="middle" onClick={sendNewMessageHandler}>
      View & Send Messages
    </Button>
  );
};

ViewAndSendButtons.propTypes = {
  sendNewMessageHandler: PropTypes.func,
};
ViewAndSendButtons.defaultProps = {
  sendNewMessageHandler: _noop,
};

export default ViewAndSendButtons;
