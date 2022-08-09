import PropTypes from 'prop-types';
import _noop from 'lodash/noop';
import styles from './Input.module.scss';

const Input = ({ name, onChange, placeholder, type, value }) => {
  return (
    <input
      className={styles.input}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      name={name}
      value={value}
    />
  );
};

Input.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

Input.defaultProps = {
  name: 'name',
  onChange: _noop,
  placeholder: 'placeholder',
  type: 'text',
  value: '',
};

export default Input;
