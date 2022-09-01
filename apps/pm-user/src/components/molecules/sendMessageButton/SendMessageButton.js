import { noop as _noop } from 'lodash';
import { Button, SendOutlined } from '../../atoms';
import PropTypes from 'prop-types';

const SendMessageButton = ({ onClick }) => {
  return (
    <Button type="primary" shape="round" icon={<SendOutlined />} size="middle" onClick={onClick}>
      Send Message
    </Button>
  );
};

SendMessageButton.propTypes = {
  onClick: PropTypes.func,
};
SendMessageButton.defaultProps = {
  onClick: _noop,
};

export default SendMessageButton;
