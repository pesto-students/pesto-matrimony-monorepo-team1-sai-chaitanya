import { Input as AntdInput } from 'antd';
const InputPassword = AntdInput.Password;
import PropTypes from 'prop-types';
import styles from './Input.module.scss';

const Input = ({ className, placeholder, prefix, size, type, ...restProps }) => {
  return (
    <AntdInput
      {...restProps}
      className={styles[`${className}`]}
      // className={styles.antdInput}
      placeholder={placeholder}
      type={type}
      prefix={prefix}
      size={size}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  prefix: PropTypes.object,
  size: PropTypes.string,
  type: PropTypes.string,
};

Input.defaultProps = {
  className: 'antdInput',
  placeholder: 'input',
  prefix: '<UserOutlined className={styles.inputIcon} />',
  size: 'large',
  type: 'text',
};

export { Input, InputPassword };
