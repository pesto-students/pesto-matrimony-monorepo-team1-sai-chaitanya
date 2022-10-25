import { Button, Form, Input, InputPassword, KeyOutlined, MailOutlined, Select, UserOutlined } from '../../atoms';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from './signUpForm.module.scss';
import { showNotification } from '@pm/pm-ui';

const SignUpForm = () => {
  const history = useHistory();

  setTimeout(() => {
    showNotification(
      'warning',
      'Important!',
      'Our backend service auto-hibernates if not used for 15 minutes. So, if the application appears to be non-responsive, please give it a minute...',
      0
    );
  }, 1000);

  const localUrl = 'http://localhost:8000/api/v1/users/oktasignup';
  const herokuUrl = 'https://pmapi-pesto.herokuapp.com/api/v1/users/oktasignup';
  const baseUrl = 'https://pm-api-yr8y.onrender.com';

  async function signUpUser(firstName, lastName, email, gender, password) {
    try {
      const response = await axios.post(baseUrl, {
        profile: {
          firstName,
          lastName,
          email,
          login: email,
          gender: gender,
        },
        credentials: {
          password: {
            value: password,
          },
        },
      });
      if (response) {
        showNotification('success', 'Congratulations your account is created');
        history.push('/login');
      }
    } catch (err) {
      const errField = err.response.data.field;

      if (errField === 'password') {
        showNotification('error', 'Please create strong password');
      } else if (errField === 'login') {
        showNotification('error', 'This user already exist in the Pesto Matrimony');
      }
    }
  }

  const onFinish = (values) => {
    if (values.confirmPassword === values.password) {
      signUpUser(values.firstName, values.lastName, values.email, values.gender, values.password);
    } else {
      showNotification('error', 'password and confirmPassword should be same');
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
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
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Please input your First Name!',
            },
          ]}
        >
          <Input
            className="antdInput"
            type="text"
            placeholder="First Name"
            prefix={<UserOutlined className={styles.inputIcon} />}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          rules={[
            {
              required: true,
              message: 'Please input your Last Name!',
            },
          ]}
        >
          <Input
            className="antdInput"
            type="text"
            placeholder="Last Name"
            prefix={<UserOutlined className={styles.inputIcon} />}
            size="large"
          />
        </Form.Item>

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
            className="antdInput"
            type="email"
            placeholder="Email"
            prefix={<MailOutlined className={styles.inputIcon} />}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="Select Gender" bordered={false} size="small" className="antdSelect">
            <Option value="female">Female</Option>
            <Option value="male">Male</Option>
          </Select>
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
            className="antdInput"
            placeholder="Password"
            prefix={<KeyOutlined rotate="45" className={styles.inputIcon} size="large" />}
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: 'Please input your confirm password!',
            },
          ]}
        >
          <Input
            type="password"
            className="antdInput"
            placeholder="Confirm Password"
            prefix={<KeyOutlined rotate="45" className={styles.inputIcon} size="large" />}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
        >
          <Button type="primary" htmlType="submit" block shape="round" size="medium" className={styles.signUpButton}>
            SignUp
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignUpForm;
