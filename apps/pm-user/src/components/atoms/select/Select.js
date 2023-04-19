import { Select as AntdSelect } from 'antd';
import PropTypes from 'prop-types';
import styles from './select.module.scss';

const Select = ({ bordered, className, size, ...restprops }) => {
  return <AntdSelect bordered={bordered} className={styles[`${className}`]} {...restprops} size={size} />;
};

Select.propTypes = {
  bordered: PropTypes.bool,
  className: PropTypes.string,
  restprops: PropTypes.object,
  size: PropTypes.string,
};

Select.defaultProps = {
  bordered: false,
  className: "",
  restprops: {},
  size: 'small',
};

export default Select;
