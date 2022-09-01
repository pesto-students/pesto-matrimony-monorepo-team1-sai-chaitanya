import { Button, Form, Input, InputPassword, KeyOutlined, MailOutlined, Select, UserOutlined } from '../../atoms';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from './signUpForm.module.scss';

const SignUpForm = () => {
  const history = useHistory();

  async function signUpUser(firstName, lastName, email, gender, password) {
    try {
      const response = await axios.post('http://localhost:3333/api/v1/newuser', {
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
      console.log(response);
      history.push('/recommendations');
    } catch (err) {
      console.log('error:', err);
    }
  }

  const onFinish = (values) => {
    if (values.confirmPassword === values.password) {
      console.log('Success:', values);
      signUpUser(values.firstName, values.lastName, values.email, values.gender, values.password);
    } else {
      alert('password and confirmPassword should be same');
    }
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
          <Button
            type="primary"
            htmlType="submit"
            block
            shape="round"
            size="medium"
            style={{
              backgroundColor: '#5b63e6',
              border: 'none',
              marginTop: '8px',
            }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignUpForm;
