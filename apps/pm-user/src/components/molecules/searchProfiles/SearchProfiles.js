import { Button, Form, Input, SearchOutlined, Select, Slider } from '../../atoms';
import { showNotification } from '@pm/pm-ui';
import { cmToFeet } from '@pm/pm-business';
import styles from './searchProfiles.module.scss';
import { useState } from 'react';

const SearchProfiles = () => {
  const [minHeight, setMinHeight] = useState(154);
  const [maxHeight, setMaxHeight] = useState(182);

  const handleHeightSliderChange = (values) => {
    setMinHeight(values[0]);
    setMaxHeight(values[1]);
  };
  const [minAge, setMinAge] = useState(25);
  const [maxAge, setMaxAge] = useState(29);

  const handleAgeSliderChange = (values) => {
    setMinAge(values[0]);
    setMaxAge(values[1]);
  };

  const heightBoundaries = {
    [`${minHeight}`]: {
      label: `${cmToFeet(minHeight)}`,
      style: {
        color: '#5c5fee',
        fontWeight: 'bold',
      },
    },
    [`${maxHeight}`]: {
      label: `${cmToFeet(maxHeight)}`,
      style: {
        color: '#5c5fee',
        fontWeight: 'bold',
      },
    },
  };
  const ageBoundaries = {
    [`${minAge}`]: {
      label: `${minAge}`,
      style: {
        color: '#5c5fee',
        fontWeight: 'bold',
      },
    },
    [`${maxAge}`]: {
      label: `${maxAge}`,
      style: {
        color: '#5c5fee',
        fontWeight: 'bold',
      },
    },
  };

  const onFinish = (values) => {
    console.log('Success:', values);
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
          <Form.Item label="Height" name="heightRange">
            <Slider
              defaultValue={[154, 182]}
              range={{ draggableTrack: true }}
              min={122}
              max={214}
              marks={heightBoundaries}
              step={1}
              onChange={handleHeightSliderChange}
              style={{
                width: 150,
              }}
            />
          </Form.Item>
          <Form.Item label="Age" name="ageRange">
            <Slider
              defaultValue={[25, 29]}
              range={{ draggableTrack: true }}
              min={18}
              max={50}
              marks={ageBoundaries}
              onChange={handleAgeSliderChange}
              style={{
                width: 150,
              }}
            />
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
