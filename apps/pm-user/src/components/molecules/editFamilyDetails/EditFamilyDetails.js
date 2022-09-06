import { useState, useEffect } from 'react';
import { Button, Form, SaveOutlined, Select, SimpleSelect, TextArea } from '../../atoms';
import { showNotification } from '@pm/pm-ui';
import { useOktaAuth } from '@okta/okta-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from "../../../redux/actions/Actions";
import _ from "lodash";

const MAX_TEXT_LENGTH = 300;
const { Option } = SimpleSelect;

const EditFamilyDetails = () => {

  const { oktaAuth, authState } = useOktaAuth();
  const dispatch = useDispatch();
  const [ userProfileData, setUserProfileData ] = useState({});

  // getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    if(!_.isEmpty(userProfileData)){
      dispatch(updateUserProfile(oktaUserId, userProfileData))
    }
  }, [userProfileData]);

  const responseData = useSelector(state => state.updateUserProfileReducer.data || {});
  console.log(responseData);

  const onFinish = (value) => {

    setUserProfileData(value);

    console.log(value);
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
      <Form.Item label="Brother(s)" name="brothers">
        <Select bordered>
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Married Brother(s)" name="marriedBrothers">
        <Select bordered>
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Sister(s)" name="sisters">
        <Select bordered>
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Married Sister(s)" name="marriedSisters">
        <Select bordered>
          <Option value="0">0</Option>
          <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option>
          <Option value="4">4</Option>
          <Option value="5">5</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Family Status" name="familyStatus">
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
