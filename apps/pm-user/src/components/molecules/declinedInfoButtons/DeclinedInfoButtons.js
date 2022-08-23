import React from 'react';
import { Button, ExclamationCircleOutlined } from '../../atoms';

const DeclinedInfoButtons = ({
  deleteRejectedInterestHandler,
  interestSenderId,
  idOfLoggedInUser,
}) => {
  return (
    <>
      <Button type="text" danger icon={<ExclamationCircleOutlined />}>
        {idOfLoggedInUser === interestSenderId
          ? 'Your Interest was rejected!'
          : 'You rejected this interest'}
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

export default DeclinedInfoButtons;
