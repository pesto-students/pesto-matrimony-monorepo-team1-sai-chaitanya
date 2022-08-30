import { Select as AntdSelect } from 'antd';
import PropTypes from 'prop-types';
import styles from './select.module.scss';

const Select = ({ bordered, className, size, ...restProps }) => {
  return <AntdSelect bordered={bordered} className={styles[`${className}`]} {...restProps} size={size} />;
};

Select.propTypes = {
  bordered: PropTypes.bool,
  className: PropTypes.string,
  restProps: PropTypes.object,
  size: PropTypes.string,
};

Select.defaultProps = {
  bordered: false,
  className: 'antdSelect',
  restProps: {},
  size: 'small',
};

export default Select;
