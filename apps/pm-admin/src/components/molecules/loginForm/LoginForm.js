import { Button, Form, Input, InputPassword, KeyOutlined, MailOutlined } from '../../atoms';
import PropTypes from 'prop-types';
import _noop from 'lodash';
import { useHistory, Link } from 'react-router-dom';
import { showNotification } from '@pm/pm-ui';
import { useEffect } from 'react';
import './loginForm.css';

const LoginForm = ({ onFormSubmit }) => {
  const history = useHistory();

  console.log('RUNNING LOGINFORM COMPONENT');

  useEffect(() => {
    showNotification(
      'warning',
      'Important!',
      'Please use pre-filled login details. Our backend service auto-hibernates if not used for 15 minutes. So, if the application appears to be non-responsive... Please give it a minute...',
      0
    );
  }, []);

  //jay@yopmail.com id the admin
  const onFinish = (values) => {
    if (values.email === 'jay@yopmail.com') {
      onFormSubmit(values.password, values.email);
    } else {
      showNotification('error', 'Only admin can login');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        name="basic"
        fields={[
          {
            name: ['email'],
            value: 'jay@yopmail.com',
          },
          {
            name: ['password'],
            value: '565BHOPALkatara',
          },
        ]}
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
          <Input type="email" placeholder="Email" prefix={<MailOutlined className="inputIcon" />} size="large" />
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
            style={{
              backgroundColor: 'rgb(91, 99, 230)',
              border: 'none',
              marginTop: '8px',
              fontSize: '18px',
              height: '38px',
              borderRadius: '0.8rem',
            }}
          >
            Login
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
