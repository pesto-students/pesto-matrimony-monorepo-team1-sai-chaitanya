import PropTypes from 'prop-types';
import _noop from 'lodash/noop';
import './myinput.scss';

const MyInput = ({ name, onChangeHandler, placeholder, type, value }) => {
  return (
    <input
      className="InputField"
      type={type}
      placeholder={placeholder}
      onChange={onChangeHandler}
      name={name}
      value={value}
    />
  );
};

MyInput.propTypes = {
  name: PropTypes.string,
  onChangeHandler: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

MyInput.defaultProps = {
  name: '',
  onChangeHandler: _noop,
  placeholder: '',
  type: '',
  value: '',
};

export default MyInput;
