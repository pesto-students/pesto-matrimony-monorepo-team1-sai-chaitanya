import { Button, Form, Input, InputPassword, KeyOutlined, MailOutlined } from '../../atoms';
import PropTypes from 'prop-types';
import _noop from 'lodash';
import { useHistory, Link } from 'react-router-dom';
import './loginForm.css';

const LoginForm = ({ onFormSubmit }) => {
  const history = useHistory();

  const onFinish = (values) => {
    console.log('Success:', values);
    onFormSubmit(values.password, values.email);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
          ]}
        >
          <Input
            type="email"
            placeholder="Email"
            prefix={<MailOutlined className="inputIcon"/>}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input
            type="password"
            placeholder="Password"
            prefix={<KeyOutlined rotate="45" className="inputIcon" size="large" />}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            block
            shape="round"
            size="medium"
            className="buttonStyle"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

LoginForm.propTypes = {
  onFormSubmit: PropTypes.func,
};

LoginForm.defaultProps = {
  onFormSubmit: _noop,
};

export default LoginForm;
