import { noop as _noop } from 'lodash';
import { Button, HeartOutlined } from '../../atoms';
import PropTypes from 'prop-types';

const SendInterestButton = ({ onClick }) => {
  return (
    <Button type="primary" shape="round" icon={<HeartOutlined />} size="middle" onClick={onClick}>
      Send Interest
    </Button>
  );
};

SendInterestButton.propTypes = {
  onClick: PropTypes.func,
};
SendInterestButton.defaultProps = {
  onClick: _noop,
};

export default SendInterestButton;
