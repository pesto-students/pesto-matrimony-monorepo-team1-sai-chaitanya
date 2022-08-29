import { Button, Form, Input, SearchOutlined, Select } from '../../atoms';
import { useRef } from 'react';
import { showNotification } from '@pm/pm-ui';
import styles from './searchProfiles.module.scss';

const SearchProfiles = () => {
  const minAgeRef = useRef();
  const maxAgeRef = useRef();
  const testRef = useRef();
  const onFinish = (values) => {
    delete values.age;
    console.log('Success:', values);
    console.log('testRef: ', testRef.current);
    showNotification(
      'success',
      'Searching...',
      'Please wait while we search for profiles based on your criteria...',
      10
    );
  };

  const onFinishFailed = (errorInfo) => {
    showNotification('error', 'Error!', 'Please re-check your search criteria and try again.');
    console.log('Failed:', errorInfo);
  };

  function handleChange() {
    console.log('change');
  }
  return (
    <Form
      name="basic"
      labelCol={{
        span: 10,
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
          <Form.Item label="Username" name="username">
            <Input ref={testRef} />
          </Form.Item>
          <Form.Item label="Age" name="minAge">
            <Select
              style={{
                width: 60,
              }}
              ref={minAgeRef}
            >
              <Option value="18">18</Option>
              <Option value="19">19</Option>
              <Option value="20">20</Option>
              <Option value="21">21</Option>
              <Option value="22">22</Option>
              <Option value="23">23</Option>
              <Option value="24">24</Option>
              <Option value="25">25</Option>
              <Option value="26">26</Option>
              <Option value="27">27</Option>
            </Select>
          </Form.Item>
          to
          <Form.Item label="Age" name="maxAge">
            <Select
              style={{
                width: 60,
              }}
              ref={maxAgeRef}
            >
              <Option value="18">18</Option>
              <Option value="19">19</Option>
              <Option value="20">20</Option>
              <Option value="21">21</Option>
              <Option value="22">22</Option>
              <Option value="23">23</Option>
              <Option value="24">24</Option>
              <Option value="25">25</Option>
              <Option value="26">26</Option>
              <Option value="27">27</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Marital Status" name="maritalStatus">
            <Select
              style={{
                width: 160,
              }}
            >
              <Option value="Never Married">Never Married</Option>
              <Option value="Divorced">Divorced</Option>
              <Option value="Awaiting Divorce">Awaiting Divorce</Option>
              <Option value="Widow/Widower">Widow/Widower</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Religion" name="religon">
            <Select
              style={{
                width: 160,
              }}
            >
              <Option value="Christian">Christian</Option>
              <Option value="Hindu">Hindu</Option>
              <Option value="Sikh">Sikh</Option>
              <Option value="Jain">Jain</Option>
            </Select>
          </Form.Item>
        </div>

        <div className={styles.col2}>
          <Form.Item label="Community" name="community">
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
          <Form.Item label="City" name="City">
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
          <Form.Item label="State" name="State">
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
          <Form.Item label="Country" name="Country">
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
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default SearchProfiles;

// const App = () => {

// };

// export default App;
