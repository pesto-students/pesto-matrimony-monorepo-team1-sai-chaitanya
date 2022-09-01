import { noop as _noop } from 'lodash';
import { Button, LikeOutlined } from '../../atoms';
import PropTypes from 'prop-types';

const AcceptInterestButton = ({ onClick }) => {
  return (
    <Button type="primary" shape="round" icon={<LikeOutlined />} size="middle" onClick={onClick}>
      Accept
    </Button>
  );
};

AcceptInterestButton.propTypes = {
  onClick: PropTypes.func,
};
AcceptInterestButton.defaultProps = {
  onClick: _noop,
};

export default AcceptInterestButton;
