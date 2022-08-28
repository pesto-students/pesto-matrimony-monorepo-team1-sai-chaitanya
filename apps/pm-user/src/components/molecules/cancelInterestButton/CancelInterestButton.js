import React from 'react'
import { noop as _noop } from 'lodash'
import { Button, CloseCircleOutlined } from '../../atoms'
import PropTypes from 'prop-types'

const CancelInterestButton = ({ onClick }) => {
  return (
    <Button
      type="primary"
      shape="round"
      icon={<CloseCircleOutlined />}
      size="middle"
      onClick={onClick}
    >
      Cancel Interest
    </Button>
  )
}

CancelInterestButton.propTypes = {
  onClick: PropTypes.func
}
CancelInterestButton.defaultProps = {
  onClick: _noop
}

export default CancelInterestButton