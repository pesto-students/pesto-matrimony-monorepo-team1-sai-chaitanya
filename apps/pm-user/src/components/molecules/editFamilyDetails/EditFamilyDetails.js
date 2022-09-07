import { Button, Form, SaveOutlined, Select, SimpleSelect, TextArea } from '../../atoms';
import { showNotification } from '@pm/pm-ui';

const MAX_TEXT_LENGTH = 300;
const { Option } = SimpleSelect;

const EditFamilyDetails = () => {
  const onFinish = (value) => {
    Object.keys(value).forEach((key) => {
      if (value[key] === undefined || value[key] === null) {
        delete value[key];
      }
    });

    console.log(JSON.stringify(value));

    // save this value in DB and display success/failure notification!!
    showNotification('success', 'Save Successful!', 'Your information has been saved successfully.');
  };
  const onFinishFailed = () => {
    showNotification('error', 'Error Saving Values...', 'Please Try again later.');
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="About Family" name="aboutFamily">
        <TextArea
          maxLength={MAX_TEXT_LENGTH}
          placeholder="Please write a few words about your family. Maximum 300 characters allowed."
        />
      </Form.Item>
      <Form.Item label="Brother(s)" name="brothers" initialValue={null}>
        <Select bordered>
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Married Brother(s)" name="marriedBrothers" initialValue={null}>
        <Select bordered>
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Sister(s)" name="sisters" initialValue={null}>
        <Select bordered>
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Married Sister(s)" name="marriedSisters" initialValue={null}>
        <Select bordered>
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Family Status" name="familyStatus" initialValue={null}>
        <Select bordered>
          <Option value="Affluent">Affluent</Option>
          <Option value="Upper Middle Class">Upper Middle Class</Option>
          <Option value="Middle Class">Middle Class</Option>
          <Option value="Lower Middle Class">Lower Middle Class</Option>
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" shape="round" size="middle" icon={<SaveOutlined />}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditFamilyDetails;
