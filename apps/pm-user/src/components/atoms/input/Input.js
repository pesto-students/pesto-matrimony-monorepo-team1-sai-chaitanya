import PropTypes from 'prop-types';
import _noop from 'lodash/noop';
import styles from './Input.module.scss';

const Input = ({ name, onChangeHandler, placeholder, type, value }) => {
  return (
    <input
      className={styles.Input}
      type={type}
      placeholder={placeholder}
      onChange={onChangeHandler}
      name={name}
      value={value}
    />
  );
};

Input.propTypes = {
  name: PropTypes.string,
  onChangeHandler: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

Input.defaultProps = {
  name: 'name',
  onChangeHandler: _noop,
  placeholder: 'placeholder',
  type: 'text',
  value: '',
};

export default Input;
