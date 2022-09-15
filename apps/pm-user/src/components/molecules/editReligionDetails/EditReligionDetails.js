import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from "../../../redux/actions/Actions";
import _ from "lodash";
import { Button, DatePicker, Form, SaveOutlined, Select, SimpleInput, SimpleSelect, TimePicker } from '../../atoms';
import { showNotification } from '@pm/pm-ui';

const MAX_LENGTH_OF_PLACE_OF_BIRTH = 20;
const { Option } = SimpleSelect;

const EditReligionDetails = () => {

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

  // console.log(userProfileData);

  const responseData = useSelector(state => state.updateUserProfileReducer.data || {});
  const userProfileInfo = useSelector((state) => state.getUserProfileResponse.data || {});


  const onFinish = (value) => {

    setUserProfileData(value);

    console.log(value);
    if (value.placeOfBirth !== null) {
      value.placeOfBirth = value.placeOfBirth.trim();
    }
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
      <Form.Item label="Religion" name="religion" initialValue={userProfileInfo?.religion}>
        <Select bordered className="">
          <Option value="Hindu">Hindu</Option>
          <Option value="Muslim">Muslim</Option>
          <Option value="Christian">Christian</Option>
          <Option value="Sikh">Sikh</Option>
          <Option value="Jain">Jain</Option>
          <Option value="Parsi">Parsi</Option>
          <Option value="Buddhist">Buddhist</Option>
          <Option value="Jewish">Jewish</Option>
          <Option value="Others">Others</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Zodiac sign" name="zodiacSign" initialValue={userProfileInfo?.zodiacSign}>
        <Select bordered className="">
          <Option value="Aries">Aries</Option>
          <Option value="Taurus">Taurus</Option>
          <Option value="Gemini">Gemini</Option>
          <Option value="Cancer">Cancer</Option>
          <Option value="Leo">Leo</Option>
          <Option value="Virgo">Virgo</Option>
          <Option value="Libra">Libra</Option>
          <Option value="Scorpio">Scorpio</Option>
          <Option value="Sagittarius">Sagittarius</Option>
          <Option value="Capricorn">Capricorn</Option>
          <Option value="Acquarius">Acquarius</Option>
          <Option value="Pisces">Pisces</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Gothram" name="gothram" initialValue={userProfileInfo?.gothram}>
        <Select bordered className="">
          <Option value="Not Applicable">Not Applicable</Option>
          <Option value="Agastya">Agastya</Option>
          <Option value="Agni">Agni</Option>
          <Option value="Airan">Airan</Option>
          <Option value="Alambayana/Alimmanh/Alamyanh">Alambayana/Alimmanh/Alamyanh</Option>
          <Option value="Angiras">Angiras</Option>
          <Option value="Aparna">Aparna</Option>
          <Option value="Arya">Arya</Option>
          <Option value="Atri">Atri</Option>
          <Option value="Bachchas">Bachchas</Option>
          <Option value="Baghel">Baghel</Option>
          <Option value="Banni">Banni</Option>
          <Option value="Bansal">Bansal</Option>
          <Option value="Batish/Vats, Sri Vatsya, Srivatsa, Vatsyana">
            Batish/Vats, Sri Vatsya, Srivatsa, Vatsyana
          </Option>
          <Option value="Bhandal">Bhandal</Option>
          <Option value="Bhanpuriya">Bhanpuriya</Option>
          <Option value="Bhardwaja">Bhardwaja</Option>
          <Option value="Bhargava">Bhargava</Option>
          <Option value="Bhesean">Bhesean</Option>
          <Option value="Billas/Bilvas">Billas/Bilvas</Option>
          <Option value="Bindal">Bindal</Option>
          <Option value="Chahar">Chahar</Option>
          <Option value="Chandramaharshi">Chandramaharshi</Option>
          <Option value="Chandratreya">Chandratreya</Option>
          <Option value="Chathundi Maharshi">Chathundi Maharshi</Option>
          <Option value="Cheekhooree">Cheekhooree</Option>
          <Option value="Chookhare">Chookhare</Option>
          <Option value="Dahiya">Dahiya</Option>
          <Option value="Dalabhya">Dalabhya</Option>
          <Option value="Deval">Deval</Option>
          <Option value="Dhanda">Dhanda</Option>
          <Option value="Dharan">Dharan</Option>
          <Option value="Dhayan">Dhayan</Option>
          <Option value="Galav">Galav</Option>
          <Option value="Garg">Garg</Option>
          <Option value="Garga">Garga</Option>
          <Option value="Gautam">Gautam</Option>
          <Option value="Gohel">Gohel</Option>
          <Option value="Goyal">Goyal</Option>
          <Option value="Goyan">Goyan</Option>
          <Option value="Harita">Harita</Option>
          <Option value="Hrishab">Hrishab</Option>
          <Option value="Jadaun">Jadaun</Option>
          <Option value="Jenwal/Jetrawal">Jenwal/Jetrawal</Option>
          <Option value="Jindal">Jindal</Option>
          <Option value="Kalavayana">Kalavayana</Option>
          <Option value="Kancharla">Kancharla</Option>
          <Option value="Kansal">Kansal</Option>
          <Option value="Kapil">Kapil</Option>
          <Option value="kashi">kashi</Option>
          <Option value="Kashyapa">Kashyapa</Option>
          <Option value="Katyayan">Katyayan</Option>
          <Option value="Kaundinya">Kaundinya</Option>
          <Option value="Kaushal">Kaushal</Option>
          <Option value="Kaushik">Kaushik</Option>
          <Option value="Khangura">Khangura</Option>
          <Option value="Kothapalla">Kothapalla</Option>
          <Option value="Kuchhal">Kuchhal</Option>
          <Option value="Kungu">Kungu</Option>
          <Option value="Lota/Dhiman">Lota/Dhiman</Option>
          <Option value="Mangal">Mangal</Option>
          <Option value="Mittal">Mittal</Option>
          <Option value="Mohil/Mahiwal">Mohil/Mahiwal</Option>
          <Option value="Moudgill/Moudgalya/Madhukulya/Madhukul">Moudgill/Moudgalya/Madhukulya/Madhukul</Option>
          <Option value="Mudgal">Mudgal</Option>
          <Option value="Munshi">Munshi</Option>
          <Option value="Nagal">Nagal</Option>
          <Option value="Nagasya">Nagasya</Option>
          <Option value="Nanda">Nanda</Option>
          <Option value="Panchal">Panchal</Option>
          <Option value="Parashar">Parashar</Option>
          <Option value="Pingalasa">Pingalasa</Option>
          <Option value="Rathod">Rathod</Option>
          <Option value="Rawal">Rawal</Option>
          <Option value="Ritwal/Reetwal">Ritwal/Reetwal</Option>
          <Option value="Sankrit">Sankrit</Option>
          <Option value="Savarna">Savarna</Option>
          <Option value="Shaktri">Shaktri</Option>
          <Option value="Shandilya">Shandilya</Option>
          <Option value="Sheoran">Sheoran</Option>
          <Option value="Shiva">Shiva</Option>
          <Option value="Singhal/Singla">Singhal/Singla</Option>
          <Option value="Sogarwal">Sogarwal</Option>
          <Option value="Srivatsa">Srivatsa</Option>
          <Option value="Swaminatreya">Swaminatreya</Option>
          <Option value="Tayal">Tayal</Option>
          <Option value="Tingal">Tingal</Option>
          <Option value="Toppo">Toppo</Option>
          <Option value="Tulyamahamuni">Tulyamahamuni</Option>
          <Option value="Upmanyu">Upmanyu</Option>
          <Option value="Upreti">Upreti</Option>
          <Option value="Vaadhula">Vaadhula</Option>
          <Option value="Vaid">Vaid</Option>
          <Option value="Vasishtha">Vasishtha</Option>
          <Option value="Vishvakarman">Vishvakarman</Option>
          <Option value="Vishwamitra">Vishwamitra</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Place of birth" name="placeOfBirth" initialValue={userProfileInfo?.placeOfBirth}>
        <SimpleInput placeholder="Please type your birth place." maxLength={MAX_LENGTH_OF_PLACE_OF_BIRTH} showCount />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" shape="round" size="middle" icon={<SaveOutlined />}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditReligionDetails;
