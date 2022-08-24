import { noop as _noop } from 'lodash';
import { Button, DeleteOutlined, ExclamationCircleOutlined } from '../../atoms';
import PropTypes from 'prop-types';
const DeclinedInfoButtons = ({ deleteRejectedInterestHandler, idOfLoggedInUser, interestSenderId }) => {
  return (
    <>
      <Button type="text" danger icon={<ExclamationCircleOutlined />}>
        {idOfLoggedInUser === interestSenderId ? 'Your Interest was rejected!' : 'You rejected this interest'}
      </Button>
      <Button
        danger
        type="text"
        shape="round"
        icon={<DeleteOutlined />}
        size="middle"
        onClick={deleteRejectedInterestHandler}
      >
        Delete
      </Button>
    </>
  );
};

DeclinedInfoButtons.propTypes = {
  deleteRejectedInterestHandler: PropTypes.func,
  idOfLoggedInUser: PropTypes.string,
  interestSenderId: PropTypes.string,
};
DeclinedInfoButtons.defaultProps = {
  deleteRejectedInterestHandler: _noop,
  idOfLoggedInUser: 'idOfLoggedInUser',
  interestSenderId: 'interestSenderId',
};

export default DeclinedInfoButtons;
