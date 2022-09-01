import { Button, SendOutlined } from '../../atoms';
import { noop as _noop } from 'lodash';
import PropTypes from 'prop-types';
const ViewAndSendButton = ({ onClick }) => {
  console.log('inside viewandsendbutton');
  return (
    <Button type="primary" shape="round" icon={<SendOutlined />} size="middle" onClick={onClick}>
      View & Send Messages
    </Button>
  );
};

ViewAndSendButton.propTypes = {
  onClick: PropTypes.func,
};
ViewAndSendButton.defaultProps = {
  onClick: _noop,
};

export default ViewAndSendButton;
