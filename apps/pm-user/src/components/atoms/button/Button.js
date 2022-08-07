import React from "react";
import PropTypes from "prop-types";
import "./button.scss";

const Button = ({ type }) => {
  return (
    <button type={type} className="signin_btn">
      Log in
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
};

Button.defaultProps = {
  type: "",
};

export default Button;
