import { Button, Checkbox, Form, Input, Select } from 'antd';
import React from 'react';
import { showNotification } from '@pm/pm-ui';
import styles from './searchProfiles.module.scss'

const SearchProfiles = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
    showNotification("success", "Searching...", "Please wait while we search for profiles based on your criteria...", 10)
  };

  const onFinishFailed = (errorInfo) => {
    showNotification("error", "Error!", "Please re-check your search criteria and try again.")
    console.log('Failed:', errorInfo);
  };

  function handleChange() {
    console.log("change")
  }
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 8,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <div className={styles.searchProfiles}>

        <div className={styles.col1}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            name="religon"
            valuePropName="religionname"
            wrapperCol={{
              offset: 8,
              span: 10,
            }}
          >
            <Select>
              <Option value="Christian">Christian</Option>
              <Option value="Hindu">Hindu</Option>
              <Option value="Sikh">Sikh</Option>
              <Option value="Jain">Jain</Option>
            </Select>
          </Form.Item>
        </div>

        <div className={styles.col2}>
          <Form.Item
            label="Community"
            name="community"
            rules={[
              {
                required: true,
                message: 'Please select a community!',
              },
            ]}
          >
            <Select
              style={{
                width: 160,
              }}
              onChange={handleChange}
            >
              <Option value="Community 1">Community 1</Option>
              <Option value="Community 2">Community 2</Option>
              <Option value="Community 3">Community 3</Option>
              <Option value="Community 4">Community 4</Option>
              <Option value="Community 5">Community 5</Option>
              <Option value="Community 6">Community 6</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="City"
            name="City"
            rules={[
              {
                required: true,
                message: 'Please select a city!',
              },
            ]}
          >
            <Select
              style={{
                width: 160,
              }}
              onChange={handleChange}
            >
              <Option value="City 1">City 1</Option>
              <Option value="City 2">City 2</Option>
              <Option value="City 3">City 3</Option>
              <Option value="City 4">City 4</Option>
              <Option value="City 5">City 5</Option>
              <Option value="City 6">City 6</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="State"
            name="State"
            rules={[
              {
                required: true,
                message: 'Please select a state!',
              },
            ]}
          >
            <Select
              style={{
                width: 160,
              }}
              onChange={handleChange}
            >
              <Option value="State 1">State 1</Option>
              <Option value="State 2">State 2</Option>
              <Option value="State 3">State 3</Option>
              <Option value="State 4">State 4</Option>
              <Option value="State 5">State 5</Option>
              <Option value="State 6">State 6</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Country"
            name="Country"
            rules={[
              {
                required: true,
                message: 'Please select a country!',
              },
            ]}
          >
            <Select
              style={{
                width: 160,
              }}
              onChange={handleChange}
            >
              <Option value="Country 1">Country 1</Option>
              <Option value="Country 2">Country 2</Option>
              <Option value="Country 3">Country 3</Option>
              <Option value="Country 4">Country 4</Option>
              <Option value="Country 5">Country 5</Option>
              <Option value="Country 6">Country 6</Option>
            </Select>
          </Form.Item>


        </div>

      </div>
      <div className={styles.submitBtn}>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </div>

    </Form>

  );
}

export default SearchProfiles


// const App = () => {



// };

// export default App;