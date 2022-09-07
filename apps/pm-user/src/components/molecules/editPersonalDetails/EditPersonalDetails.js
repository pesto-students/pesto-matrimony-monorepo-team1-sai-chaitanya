import {
  Button,
  DatePicker,
  Form,
  SaveOutlined,
  Select,
  SimpleSelect,
  Slider,
  TextArea,
  TimePicker,
} from '../../atoms';
import { showNotification } from '@pm/pm-ui';
import { cmToFeet } from '@pm/pm-business';
import { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from "../../../redux/actions/Actions";
import _ from "lodash";
import axios from 'axios';



const COUNTRY_API_URL = `https://www.universal-tutorial.com/api`;
const COUNTRIES_API_TOKEN = 'UZXlBoEnsLp9p54HXkWSBMYYv0-BQ06V0AyH8VVO3VgVYPUZFOklqwegWta3iC742jA';
const COUNTRIES_API_REGISTERED_EMAIL = 'testapi@trash-mail.com';
const MAX_TEXT_LENGTH = 500;
const MINIMUM_ALLOWED_AGE = 21;
const MAXIMUM_ALLOWED_AGE = 50;
const MININUM_HEIGHT_IN_CMS = 122;
const MAXIMUM_HEIGHT_IN_CMS = 214;
const MININUM_WEIGHT_IN_KG = 45;
const MAXIMUM_WEIGHT_IN_KG = 120;
const { Option } = SimpleSelect;





const EditPersonalDetails = () => {
  const [authToken, setAuthToken] = useState(null);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [ userProfileData, setUserProfileData ] = useState({});
  const { oktaAuth, authState } = useOktaAuth();
  const dispatch = useDispatch();

  // getting current user's oktaId
  const oktaUserId = authState.accessToken.claims.uid;

  useEffect(() => {
    axios
      .get(`${COUNTRY_API_URL}/getaccesstoken`, {
        headers: {
          Accept: 'application/json',
          'api-token': COUNTRIES_API_TOKEN,
          'user-email': COUNTRIES_API_REGISTERED_EMAIL,
        },
      })
      .then((res) => {
        // must fetch and use Auth Token to use Countries API
        setAuthToken(res.data.auth_token);
      })
      .catch((err) => {
        showNotification('error', 'Country API Error!', 'Please refresh the page or try again after 30 seconds.');
        console.log(err);
      });
  }, []);

  const handleCountryChange = (value) => {
    console.log(value)
    axios
      .get(`${COUNTRY_API_URL}/states/${value}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
        },
      })
      .then((res) => {
        const states = res.data.map((stateObj) => stateObj.state_name);
        setStatesList(states);
        setCitiesList([]);
      })
      .catch((err) => {
        showNotification(
          'error',
          'Country API Error!',
          'Unable to fetch States... Please pause for 10 seconds and try again.'
        );
        console.log(err);
      });
  };
  const handleStateChange = (value) => {
    axios
      .get(`${COUNTRY_API_URL}/cities/${value}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
        },
      })
      .then((res) => {
        const cities = res.data.map((cityObj) => cityObj.city_name);
        setCitiesList(cities);
      })
      .catch((err) => {
        showNotification(
          'error',
          'Country API Error!',
          'Unable to fetch Cities... Please pause for 10 seconds and try again.'
        );
        console.log(err);
      });
  };

  const [minHeight, setMinHeight] = useState(MININUM_HEIGHT_IN_CMS);

  const handleHeightSliderChange = (values) => {
    setMinHeight(values[0]);
  };
  const [minAge, setMinAge] = useState(MINIMUM_ALLOWED_AGE);

  const handleAgeSliderChange = (values) => {
    setMinAge(values[0]);
  };
  const [minWeight, setMinWeight] = useState(MININUM_WEIGHT_IN_KG);

  const handleWeightSliderChange = (values) => {
    setMinWeight(values[0]);
  };

  const ageBoundaries = {
    [`${minAge}`]: {
      label: `${minAge}`,
      style: {
        color: '#5c5fee',
        fontWeight: 'bold',
      },
    },
  };

  const heightBoundaries = {
    [`${minHeight}`]: {
      label: `${cmToFeet(minHeight)}`,
      style: {
        color: '#5c5fee',
        fontWeight: 'bold',
      },
    },
  };

  const weightBoundaries = {
    [`${minWeight}`]: {
      label: `${minWeight}`,
      style: {
        color: '#5c5fee',
        fontWeight: 'bold',
      },
    },
  };

  useEffect(() => {
    if(!_.isEmpty(userProfileData)){
      dispatch(updateUserProfile(oktaUserId, userProfileData))
    }
  }, [userProfileData]);


  const responseData = useSelector(state => state.updateUserProfileReducer.data || {});
  const userProfileInfo = useSelector((state) => state.getUserProfileResponse.data || {});
  

  const onFinish = (value) => {
    console.log(value);
    setUserProfileData(value);
    value.age = value.age[0];
    value.height = value.height[0];
    value.weight = value.weight[0];
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
      <Form.Item label="About Yourself" name="aboutMe" initialValue={userProfileInfo?.aboutMe}>
        <TextArea
          maxLength={MAX_TEXT_LENGTH}
          placeholder={`Please write a few words about yourself. Maximum ${MAX_TEXT_LENGTH} characters allowed.`}
        />
      </Form.Item>
      <Form.Item label="Age" name="age" initialValue={userProfileInfo?.age}>
        <Slider
          range
          min={MINIMUM_ALLOWED_AGE}
          max={MAXIMUM_ALLOWED_AGE}
          marks={ageBoundaries}
          step={1}
          onChange={handleAgeSliderChange}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item label="Height" name="height" initialValue={userProfileInfo?.height} >
        <Slider
          range
          min={MININUM_HEIGHT_IN_CMS}
          max={MAXIMUM_HEIGHT_IN_CMS}
          marks={heightBoundaries}
          step={1}
          onChange={handleHeightSliderChange}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item label="Weight (in Kg)" name="weight" initialValue={userProfileInfo?.weight}>
        <Slider
          range
          min={MININUM_WEIGHT_IN_KG}
          max={MAXIMUM_WEIGHT_IN_KG}
          marks={weightBoundaries}
          step={1}
          onChange={handleWeightSliderChange}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>
      <Form.Item label="Physique" name="physique" initialValue={userProfileInfo?.physique}>
        <Select bordered>
          <Option value="Athletic">Athletic</Option>
          <Option value="Average">Average</Option>
          <Option value="Slim">Slim</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Mother Tongue" name="motherTongue" initialValue={userProfileInfo?.motherTongue}>
        <Select bordered>
          <Option value="Hindi">Hindi</Option>
          <Option value="Bengali">Bengali</Option>
          <Option value="Marathi">Marathi</Option>
          <Option value="Telugu">Telugu</Option>
          <Option value="Tamil">Tamil</Option>
          <Option value="Gujarati">Gujarati</Option>
          <Option value="Urdu">Urdu</Option>
          <Option value="Kannada">Kannada</Option>
          <Option value="Odia">Odia</Option>
          <Option value="Malayalam">Malayalam</Option>
          <Option value="Assamese">Assamese</Option>
          <Option value="Bodo">Bodo</Option>
          <Option value="Dogri">Dogri</Option>
          <Option value="Kashmiri">Kashmiri</Option>
          <Option value="Konkani">Konkani</Option>
          <Option value="Maithili">Maithili</Option>
          <Option value="Meiti">Meiti</Option>
          <Option value="Nepali">Nepali</Option>
          <Option value="Punjabi">Punjabi</Option>
          <Option value="Sanskrit">Sanskrit</Option>
          <Option value="Santali">Santali</Option>
          <Option value="Others">Others</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Marriage Status" name="marriageStatus" initialValue={userProfileInfo?.marriageStatus}>
        <Select bordered>
          <Option value="Never Married">Never Married</Option>
          <Option value="Widowed">Widowed</Option>
          <Option value="Divorced">Divorced</Option>
          <Option value="Awaiting Divorce">Awaiting Divorce</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Citizenship" name="citizenship" initialValue={userProfileInfo?.citizenship} >
        <Select bordered>
          <Option value="India">India</Option>
          <Option value="United States">USA</Option>
          <Option value="United Kingdom">UK</Option>
          <Option value="United Arab Emirates">UAE</Option>
          <Option value="Malaysia">Malaysia</Option>
          <Option value="Australia">Australia</Option>
          <Option value="Saudi Arabia">Saudi Arabia</Option>
          <Option value="Canada">Canada</Option>
          <Option value="Singapore">Singapore</Option>
          <Option value="Kuwait">Kuwait</Option>
          <Option value="Afghanistan">Afghanistan</Option>
          <Option value="Albania">Albania</Option>
          <Option value="Algeria">Algeria</Option>
          <Option value="Andorra">Andorra</Option>
          <Option value="Angola">Angola</Option>
          <Option value="Antigua And Barbuda">Antigua</Option>
          <Option value="Argentina">Argentina</Option>
          <Option value="Armenia">Armenia</Option>
          <Option value="Austria">Austria</Option>
          <Option value="Azerbaijan">Azerbaijan</Option>
          <Option value="Bahamas">Bahamas</Option>
          <Option value="Bahrain">Bahrain</Option>
          <Option value="Bangladesh">Bangladesh</Option>
          <Option value="Barbados">Barbados</Option>
          <Option value="Belarus">Belarus</Option>
          <Option value="Belgium">Belgium</Option>
          <Option value="Belize">Belize</Option>
          <Option value="Benin">Benin</Option>
          <Option value="Bhutan">Bhutan</Option>
          <Option value="Bolivia">Bolivia</Option>
          <Option value="Botswana">Botswana</Option>
          <Option value="Brazil">Brazil</Option>
          <Option value="Brunei">Brunei</Option>
          <Option value="Bulgaria">Bulgaria</Option>
          <Option value="Burkina Faso">Burkina</Option>
          <Option value="Burundi">Burundi</Option>
          <Option value="Cambodia">Cambodia</Option>
          <Option value="Cameroon">Cameroon</Option>
          <Option value="Cape Verde">Cape Verde</Option>
          <Option value="Chad">Chad</Option>
          <Option value="Chile">Chile</Option>
          <Option value="China">China</Option>
          <Option value="Colombia">Colombia</Option>
          <Option value="Comoros">Comoros</Option>
          <Option value="Congo">Congo</Option>
          <Option value="Costa Rica">Costa Rica</Option>
          <Option value="Croatia">Croatia</Option>
          <Option value="Cuba">Cuba</Option>
          <Option value="Cyprus">Cyprus</Option>
          <Option value="Denmark">Denmark</Option>
          <Option value="Djibouti">Djibouti</Option>
          <Option value="Dominica">Dominica</Option>
          <Option value="East Timor">East Timor</Option>
          <Option value="Ecuador">Ecuador</Option>
          <Option value="Egypt">Egypt</Option>
          <Option value="El Salvador">El Salvador</Option>
          <Option value="Eritrea">Eritrea</Option>
          <Option value="Estonia">Estonia</Option>
          <Option value="Ethiopia">Ethiopia</Option>
          <Option value="Fiji">Fiji</Option>
          <Option value="Finland">Finland</Option>
          <Option value="France">France</Option>
          <Option value="Gabon">Gabon</Option>
          <Option value="Gambia">Gambia</Option>
          <Option value="Georgia">Georgia</Option>
          <Option value="Germany">Germany</Option>
          <Option value="Ghana">Ghana</Option>
          <Option value="Greece">Greece</Option>
          <Option value="Grenada">Grenada</Option>
          <Option value="Guatemala">Guatemala</Option>
          <Option value="Guinea">Guinea</Option>
          <Option value="Guyana">Guyana</Option>
          <Option value="Haiti">Haiti</Option>
          <Option value="Honduras">Honduras</Option>
          <Option value="Hungary">Hungary</Option>
          <Option value="Iceland">Iceland</Option>
          <Option value="Indonesia">Indonesia</Option>
          <Option value="Iran">Iran</Option>
          <Option value="Iraq">Iraq</Option>
          <Option value="Ireland">Ireland</Option>
          <Option value="Israel">Israel</Option>
          <Option value="Italy">Italy</Option>
          <Option value="Ivory Coast">Ivory Coast</Option>
          <Option value="Jamaica">Jamaica</Option>
          <Option value="Japan">Japan</Option>
          <Option value="Jordan">Jordan</Option>
          <Option value="Kazakhstan">Kazakhstan</Option>
          <Option value="Kenya">Kenya</Option>
          <Option value="Kiribati">Kiribati</Option>
          <Option value="Korea North">Korea North</Option>
          <Option value="Korea South">Korea South</Option>
          <Option value="Kosovo">Kosovo</Option>
          <Option value="Kyrgyzstan">Kyrgyzstan</Option>
          <Option value="Laos">Laos</Option>
          <Option value="Latvia">Latvia</Option>
          <Option value="Lebanon">Lebanon</Option>
          <Option value="Lesotho">Lesotho</Option>
          <Option value="Liberia">Liberia</Option>
          <Option value="Libya">Libya</Option>
          <Option value="Liechtenstein">Liechtenstein</Option>
          <Option value="Lithuania">Lithuania</Option>
          <Option value="Luxembourg">Luxembourg</Option>
          <Option value="Macedonia">Macedonia</Option>
          <Option value="Madagascar">Madagascar</Option>
          <Option value="Malawi">Malawi</Option>
          <Option value="Maldives">Maldives</Option>
          <Option value="Mali">Mali</Option>
          <Option value="Malta">Malta</Option>
          <Option value="Mauritania">Mauritania</Option>
          <Option value="Mauritius">Mauritius</Option>
          <Option value="Mexico">Mexico</Option>
          <Option value="Micronesia">Micronesia</Option>
          <Option value="Moldova">Moldova</Option>
          <Option value="Monaco">Monaco</Option>
          <Option value="Mongolia">Mongolia</Option>
          <Option value="Montenegro">Montenegro</Option>
          <Option value="Morocco">Morocco</Option>
          <Option value="Mozambique">Mozambique</Option>
          <Option value="Myanmar">Myanmar</Option>
          <Option value="Namibia">Namibia</Option>
          <Option value="Nauru">Nauru</Option>
          <Option value="Nepal">Nepal</Option>
          <Option value="Netherlands">Netherlands</Option>
          <Option value="New Zealand">New Zealand</Option>
          <Option value="Nicaragua">Nicaragua</Option>
          <Option value="Niger">Niger</Option>
          <Option value="Nigeria">Nigeria</Option>
          <Option value="Norway">Norway</Option>
          <Option value="Oman">Oman</Option>
          <Option value="Pakistan">Pakistan</Option>
          <Option value="Palau">Palau</Option>
          <Option value="Panama">Panama</Option>
          <Option value="Paraguay">Paraguay</Option>
          <Option value="Peru">Peru</Option>
          <Option value="Philippines">Philippines</Option>
          <Option value="Poland">Poland</Option>
          <Option value="Portugal">Portugal</Option>
          <Option value="Qatar">Qatar</Option>
          <Option value="Romania">Romania</Option>
          <Option value="Russian">Russian</Option>
          <Option value="Rwanda">Rwanda</Option>
          <Option value="St Lucia">St Lucia</Option>
          <Option value="Samoa">Samoa</Option>
          <Option value="San Marino">San Marino</Option>
          <Option value="Senegal">Senegal</Option>
          <Option value="Serbia">Serbia</Option>
          <Option value="Seychelles">Seychelles</Option>
          <Option value="Sierra Leone">Sierra Leone</Option>
          <Option value="Slovakia">Slovakia</Option>
          <Option value="Slovenia">Slovenia</Option>
          <Option value="Solomon Islands">Solomon Islands</Option>
          <Option value="Somalia">Somalia</Option>
          <Option value="South Africa">South Africa</Option>
          <Option value="South Sudan">South Sudan</Option>
          <Option value="Spain">Spain</Option>
          <Option value="Sri Lanka">Sri Lanka</Option>
          <Option value="Sudan">Sudan</Option>
          <Option value="Suriname">Suriname</Option>
          <Option value="Swaziland">Swaziland</Option>
          <Option value="Sweden">Sweden</Option>
          <Option value="Switzerland">Switzerland</Option>
          <Option value="Syria">Syria</Option>
          <Option value="Taiwan">Taiwan</Option>
          <Option value="Tajikistan">Tajikistan</Option>
          <Option value="Tanzania">Tanzania</Option>
          <Option value="Thailand">Thailand</Option>
          <Option value="Togo">Togo</Option>
          <Option value="Tonga">Tonga</Option>
          <Option value="Tunisia">Tunisia</Option>
          <Option value="Turkey">Turkey</Option>
          <Option value="Turkmenistan">Turkmenistan</Option>
          <Option value="Tuvalu">Tuvalu</Option>
          <Option value="Uganda">Uganda</Option>
          <Option value="Ukraine">Ukraine</Option>
          <Option value="Uruguay">Uruguay</Option>
          <Option value="Uzbekistan">Uzbekistan</Option>
          <Option value="Vanuatu">Vanuatu</Option>
          <Option value="Vatican City">Vatican City</Option>
          <Option value="Venezuela">Venezuela</Option>
          <Option value="Vietnam">Vietnam</Option>
          <Option value="Yemen">Yemen</Option>
          <Option value="Zambia">Zambia</Option>
          <Option value="Zimbabwe">Zimbabwe</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Current Country" name="country" initialValue={userProfileInfo?.country}>
        <Select bordered onChange={handleCountryChange}>
          <Option value="India">India</Option>
          <Option value="United States">USA</Option>
          <Option value="United Kingdom">UK</Option>
          <Option value="United Arab Emirates">UAE</Option>
          <Option value="Malaysia">Malaysia</Option>
          <Option value="Australia">Australia</Option>
          <Option value="Saudi Arabia">Saudi Arabia</Option>
          <Option value="Canada">Canada</Option>
          <Option value="Singapore">Singapore</Option>
          <Option value="Kuwait">Kuwait</Option>
          <Option value="Afghanistan">Afghanistan</Option>
          <Option value="Albania">Albania</Option>
          <Option value="Algeria">Algeria</Option>
          <Option value="Andorra">Andorra</Option>
          <Option value="Angola">Angola</Option>
          <Option value="Antigua And Barbuda">Antigua</Option>
          <Option value="Argentina">Argentina</Option>
          <Option value="Armenia">Armenia</Option>
          <Option value="Austria">Austria</Option>
          <Option value="Azerbaijan">Azerbaijan</Option>
          <Option value="Bahamas">Bahamas</Option>
          <Option value="Bahrain">Bahrain</Option>
          <Option value="Bangladesh">Bangladesh</Option>
          <Option value="Barbados">Barbados</Option>
          <Option value="Belarus">Belarus</Option>
          <Option value="Belgium">Belgium</Option>
          <Option value="Belize">Belize</Option>
          <Option value="Benin">Benin</Option>
          <Option value="Bhutan">Bhutan</Option>
          <Option value="Bolivia">Bolivia</Option>
          <Option value="Botswana">Botswana</Option>
          <Option value="Brazil">Brazil</Option>
          <Option value="Brunei">Brunei</Option>
          <Option value="Bulgaria">Bulgaria</Option>
          <Option value="Burkina Faso">Burkina</Option>
          <Option value="Burundi">Burundi</Option>
          <Option value="Cambodia">Cambodia</Option>
          <Option value="Cameroon">Cameroon</Option>
          <Option value="Cape Verde">Cape Verde</Option>
          <Option value="Chad">Chad</Option>
          <Option value="Chile">Chile</Option>
          <Option value="China">China</Option>
          <Option value="Colombia">Colombia</Option>
          <Option value="Comoros">Comoros</Option>
          <Option value="Congo">Congo</Option>
          <Option value="Costa Rica">Costa Rica</Option>
          <Option value="Croatia">Croatia</Option>
          <Option value="Cuba">Cuba</Option>
          <Option value="Cyprus">Cyprus</Option>
          <Option value="Denmark">Denmark</Option>
          <Option value="Djibouti">Djibouti</Option>
          <Option value="Dominica">Dominica</Option>
          <Option value="East Timor">East Timor</Option>
          <Option value="Ecuador">Ecuador</Option>
          <Option value="Egypt">Egypt</Option>
          <Option value="El Salvador">El Salvador</Option>
          <Option value="Eritrea">Eritrea</Option>
          <Option value="Estonia">Estonia</Option>
          <Option value="Ethiopia">Ethiopia</Option>
          <Option value="Fiji">Fiji</Option>
          <Option value="Finland">Finland</Option>
          <Option value="France">France</Option>
          <Option value="Gabon">Gabon</Option>
          <Option value="Gambia">Gambia</Option>
          <Option value="Georgia">Georgia</Option>
          <Option value="Germany">Germany</Option>
          <Option value="Ghana">Ghana</Option>
          <Option value="Greece">Greece</Option>
          <Option value="Grenada">Grenada</Option>
          <Option value="Guatemala">Guatemala</Option>
          <Option value="Guinea">Guinea</Option>
          <Option value="Guyana">Guyana</Option>
          <Option value="Haiti">Haiti</Option>
          <Option value="Honduras">Honduras</Option>
          <Option value="Hungary">Hungary</Option>
          <Option value="Iceland">Iceland</Option>
          <Option value="Indonesia">Indonesia</Option>
          <Option value="Iran">Iran</Option>
          <Option value="Iraq">Iraq</Option>
          <Option value="Ireland">Ireland</Option>
          <Option value="Israel">Israel</Option>
          <Option value="Italy">Italy</Option>
          <Option value="Ivory Coast">Ivory Coast</Option>
          <Option value="Jamaica">Jamaica</Option>
          <Option value="Japan">Japan</Option>
          <Option value="Jordan">Jordan</Option>
          <Option value="Kazakhstan">Kazakhstan</Option>
          <Option value="Kenya">Kenya</Option>
          <Option value="Kiribati">Kiribati</Option>
          <Option value="Korea North">Korea North</Option>
          <Option value="Korea South">Korea South</Option>
          <Option value="Kosovo">Kosovo</Option>
          <Option value="Kyrgyzstan">Kyrgyzstan</Option>
          <Option value="Laos">Laos</Option>
          <Option value="Latvia">Latvia</Option>
          <Option value="Lebanon">Lebanon</Option>
          <Option value="Lesotho">Lesotho</Option>
          <Option value="Liberia">Liberia</Option>
          <Option value="Libya">Libya</Option>
          <Option value="Liechtenstein">Liechtenstein</Option>
          <Option value="Lithuania">Lithuania</Option>
          <Option value="Luxembourg">Luxembourg</Option>
          <Option value="Macedonia">Macedonia</Option>
          <Option value="Madagascar">Madagascar</Option>
          <Option value="Malawi">Malawi</Option>
          <Option value="Maldives">Maldives</Option>
          <Option value="Mali">Mali</Option>
          <Option value="Malta">Malta</Option>
          <Option value="Mauritania">Mauritania</Option>
          <Option value="Mauritius">Mauritius</Option>
          <Option value="Mexico">Mexico</Option>
          <Option value="Micronesia">Micronesia</Option>
          <Option value="Moldova">Moldova</Option>
          <Option value="Monaco">Monaco</Option>
          <Option value="Mongolia">Mongolia</Option>
          <Option value="Montenegro">Montenegro</Option>
          <Option value="Morocco">Morocco</Option>
          <Option value="Mozambique">Mozambique</Option>
          <Option value="Myanmar">Myanmar</Option>
          <Option value="Namibia">Namibia</Option>
          <Option value="Nauru">Nauru</Option>
          <Option value="Nepal">Nepal</Option>
          <Option value="Netherlands">Netherlands</Option>
          <Option value="New Zealand">New Zealand</Option>
          <Option value="Nicaragua">Nicaragua</Option>
          <Option value="Niger">Niger</Option>
          <Option value="Nigeria">Nigeria</Option>
          <Option value="Norway">Norway</Option>
          <Option value="Oman">Oman</Option>
          <Option value="Pakistan">Pakistan</Option>
          <Option value="Palau">Palau</Option>
          <Option value="Panama">Panama</Option>
          <Option value="Paraguay">Paraguay</Option>
          <Option value="Peru">Peru</Option>
          <Option value="Philippines">Philippines</Option>
          <Option value="Poland">Poland</Option>
          <Option value="Portugal">Portugal</Option>
          <Option value="Qatar">Qatar</Option>
          <Option value="Romania">Romania</Option>
          <Option value="Russian">Russian</Option>
          <Option value="Rwanda">Rwanda</Option>
          <Option value="St Lucia">St Lucia</Option>
          <Option value="Samoa">Samoa</Option>
          <Option value="San Marino">San Marino</Option>
          <Option value="Senegal">Senegal</Option>
          <Option value="Serbia">Serbia</Option>
          <Option value="Seychelles">Seychelles</Option>
          <Option value="Sierra Leone">Sierra Leone</Option>
          <Option value="Slovakia">Slovakia</Option>
          <Option value="Slovenia">Slovenia</Option>
          <Option value="Solomon Islands">Solomon Islands</Option>
          <Option value="Somalia">Somalia</Option>
          <Option value="South Africa">South Africa</Option>
          <Option value="South Sudan">South Sudan</Option>
          <Option value="Spain">Spain</Option>
          <Option value="Sri Lanka">Sri Lanka</Option>
          <Option value="Sudan">Sudan</Option>
          <Option value="Suriname">Suriname</Option>
          <Option value="Swaziland">Swaziland</Option>
          <Option value="Sweden">Sweden</Option>
          <Option value="Switzerland">Switzerland</Option>
          <Option value="Syria">Syria</Option>
          <Option value="Taiwan">Taiwan</Option>
          <Option value="Tajikistan">Tajikistan</Option>
          <Option value="Tanzania">Tanzania</Option>
          <Option value="Thailand">Thailand</Option>
          <Option value="Togo">Togo</Option>
          <Option value="Tonga">Tonga</Option>
          <Option value="Tunisia">Tunisia</Option>
          <Option value="Turkey">Turkey</Option>
          <Option value="Turkmenistan">Turkmenistan</Option>
          <Option value="Tuvalu">Tuvalu</Option>
          <Option value="Uganda">Uganda</Option>
          <Option value="Ukraine">Ukraine</Option>
          <Option value="Uruguay">Uruguay</Option>
          <Option value="Uzbekistan">Uzbekistan</Option>
          <Option value="Vanuatu">Vanuatu</Option>
          <Option value="Vatican City">Vatican City</Option>
          <Option value="Venezuela">Venezuela</Option>
          <Option value="Vietnam">Vietnam</Option>
          <Option value="Yemen">Yemen</Option>
          <Option value="Zambia">Zambia</Option>
          <Option value="Zimbabwe">Zimbabwe</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Current State" name="state" initialValue={userProfileInfo?.state}>
        <Select bordered onChange={handleStateChange}>
          {statesList?.map((state) => (
            <Option value={state} key={Math.random()}>
              {state}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Current Location" name="location" initialValue={userProfileInfo?.location}>
        <Select bordered value="">
          {citiesList?.map((city) => (
            <Option value={city} key={Math.random()}>
              {city}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Eating Habits" name="eatingHabits" initialValue={userProfileInfo?.eatingHabits}>
        <Select bordered>
          <Option value="Vegetarian">Vegetarian</Option>
          <Option value="Eggetarian">Eggetarian</Option>
          <Option value="Non-Vegetarian">Non-Vegetarian</Option>
          <Option value="Jain">Jain</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Smoking Habits" name="smokingHabits" initialValue={userProfileInfo?.smokingHabits}>
        <Select bordered>
          <Option value="Smoker">Smoker</Option>
          <Option value="Non-Smoker">Non-Smoker</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Drinking Habits" name="drinkingHabits" initialValue={userProfileInfo?.drinkingHabits}>
        <Select bordered>
          <Option value="Drinker">Drinker</Option>
          <Option value="Social Drinker">Social Drinker</Option>
          <Option value="Teetotallers">Teetotaller</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Hobbies" name="hobbies" initialValue={userProfileInfo?.hobbies}>
        <Select bordered mode="multiple" size="medium">
          <Option value="Cooking">Cooking</Option>
          <Option value="Dancing">Dancing</Option>
          <Option value="Gardening">Gardening</Option>
          <Option value="Painting">Painting</Option>
          <Option value="Photography">Photography</Option>
          <Option value="Reading">Reading</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Spoken Languages" name="spokenLanguages" initialValue={userProfileInfo?.spokenLanguages}>
        <Select bordered mode="multiple" size="medium">
          <Option value="Hindi">Hindi</Option>
          <Option value="Bengali">Bengali</Option>
          <Option value="Marathi">Marathi</Option>
          <Option value="Telugu">Telugu</Option>
          <Option value="Tamil">Tamil</Option>
          <Option value="Gujarati">Gujarati</Option>
          <Option value="Urdu">Urdu</Option>
          <Option value="Kannada">Kannada</Option>
          <Option value="Odia">Odia</Option>
          <Option value="Malayalam">Malayalam</Option>
          <Option value="Assamese">Assamese</Option>
          <Option value="Bodo">Bodo</Option>
          <Option value="Dogri">Dogri</Option>
          <Option value="Kashmiri">Kashmiri</Option>
          <Option value="Konkani">Konkani</Option>
          <Option value="Maithili">Maithili</Option>
          <Option value="Meiti">Meiti</Option>
          <Option value="Nepali">Nepali</Option>
          <Option value="Punjabi">Punjabi</Option>
          <Option value="Sanskrit">Sanskrit</Option>
          <Option value="Santali">Santali</Option>
          <Option value="Others">Others</Option>
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" shape="round" size="middle" icon={<SaveOutlined />} >
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditPersonalDetails;
