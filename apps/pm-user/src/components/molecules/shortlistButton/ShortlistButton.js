import { noop as _noop } from 'lodash';
import { Button, ProfileOutlined } from '../../atoms';
import PropTypes from 'prop-types';

const ShortlistButton = ({ onClick }) => {
  return (
    <Button type="primary" shape="round" icon={<ProfileOutlined />} size="middle" onClick={onClick}>
      Shortlist
    </Button>
  );
};

ShortlistButton.propTypes = {
  onClick: PropTypes.func,
};
ShortlistButton.defaultProps = {
  onClick: _noop,
};

export default ShortlistButton;
