import React from 'react'
import { noop as _noop } from 'lodash'
import { Button, DislikeOutlined } from '../../atoms'
import PropTypes from 'prop-types'

const RejectInterestButton = ({ onClick }) => {
  return (
    <Button
      type="primary"
      shape="round"
      icon={<DislikeOutlined />}
      size="middle"
      onClick={onClick}
    >
      Reject
    </Button>
  )
}

RejectInterestButton.propTypes = {
  onClick: PropTypes.func
}
RejectInterestButton.defaultProps = {
  onClick: _noop
}

export default RejectInterestButton