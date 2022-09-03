import { Button, Form, SaveOutlined, Select, SimpleSelect, Slider } from '../../atoms';
import { showNotification } from '@pm/pm-ui';
import { useState } from 'react';

const MINIMUM_INCOME = 0;
const MAXIMUM_INCOME = 100;
const { Option, OptGroup } = SimpleSelect;

const EditEducationAndCareerDetails = () => {

  const [income, setIncome] = useState(0);

  const handleIncomeSliderChange = (values) => {
    setIncome(values[0]);
  };

  const incomeMark = {
    [`${income}`]: {
      label: `${income}`,
      style: {
        color: '#5c5fee',
        fontWeight: 'bold',
      },
    },
  };
  const onFinish = (value) => {
    console.log(value);
    // save this value in DB and display success/failure notification!!
    showNotification('success', 'Save Successful!', 'Your information has been saved successfully.');
  };
  const onFinishFailed = () => {
    showNotification('error', 'Error Saving Values...', 'Please Try again later.');
  };

  const value = 'fetched from DB via props';
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
      <Form.Item label="Qualification" name="qualification">
        <Select bordered>
          <Option value="Doctorate">Doctorate</Option>
          <Option value="Master's Degree">Master's Degree</Option>
          <Option value="Bachelors Degree">Bachelors Degree</Option>
          <Option value="Diploma">Diploma</Option>
          <Option value="High School">High School</Option>
          <Option value="Less than High School">Less than High School</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Occupation" name="occupation">
        <Select bordered>
          <OptGroup label="Accounting, Banking & Finance">
            <Option value="Banking Professional">Banking Professional</Option>
            <Option value="Chartered Accountant">Chartered Accountant</Option>
            <Option value="Company Secretary">Company Secretary</Option>
            <Option value="Finance Professional">Finance Professional</Option>
            <Option value="Investment Professional">Investment Professional</Option>
            <Option value="Accounting Professional (Others)">Accounting Professional (Others)</Option>
          </OptGroup>
          <OptGroup label="Administrator & HR">
            <Option value="Admin Professional">Admin Professional</Option>
            <Option value="Human Resources Professional">Human Resources Professional</Option>
          </OptGroup>
          <OptGroup label="Advertising, Media & Entertainment">
            <Option value="Actor">Actor</Option>
            <Option value="Advertising Professional">Advertising Professional</Option>
            <Option value="Entertainment Professional">Entertainment Professional</Option>
            <Option value="Event Manager">Event Manager</Option>
            <Option value="Journalist">Journalist</Option>
            <Option value="Media Professional">Media Professional</Option>
            <Option value="Public Relations Professional">Public Relations Professional</Option>
          </OptGroup>
          <OptGroup label="Agriculture">
            <Option value="Farming">Farming</Option>
            <Option value="Horticulturist">Horticulturist</Option>
            <Option value="Agricultural Professional (Others)">Agricultural Professional (Others)</Option>
          </OptGroup>
          <OptGroup label="Airline & Aviation">
            <Option value="Air Hostess / Flight Attendant">Air Hostess / Flight Attendant</Option>
            <Option value="Pilot / Co-Pilot">Pilot / Co-Pilot</Option>
            <Option value="Other Airline Professional">Other Airline Professional</Option>
          </OptGroup>
          <OptGroup label="Architecture & Design">
            <Option value="Architect">Architect</Option>
            <Option value="Interior Designer">Interior Designer</Option>
            <Option value="Landscape Architecture">Landscape Architecture</Option>
          </OptGroup>
          <OptGroup label="Artists, Animators & Web Designers">
            <Option value="Animator">Animator</Option>
            <Option value="Commercial Artist">Commercial Artist</Option>
            <Option value="Web / UX Designers">Web / UX Designers</Option>
            <Option value="Artist (Others)">Artist (Others)</Option>
          </OptGroup>
          <OptGroup label="Beauty, Fashion & Jewellery Designers">
            <Option value="Beautician">Beautician</Option>
            <Option value="Fasion Designer">Fasion Designer</Option>
            <Option value="Hairstylist">Hairstylist</Option>
            <Option value="Jewellery Designer">Jewellery Designer</Option>
            <Option value="Designer (Others)">Designer (Others)</Option>
          </OptGroup>
          <OptGroup label="BPO, KPO & Customer Support">
            <Option value="Customer Support / BPO / KPO Professional">Customer Support / BPO / KPO Professional</Option>
          </OptGroup>
          <OptGroup label="Civil Services / Law Enforcement">
            <Option value="IAS / IRS / IES / IFS">IAS / IRS / IES / IFS</Option>
            <Option value="Indian Police Services (IPS)">Indian Police Services (IPS)</Option>
            <Option value="Law Enforcement Employee (Others)">Law Enforcement Employee (Others)</Option>
          </OptGroup>
          <OptGroup label="Defense">
            <Option value="Airforce">Airforce</Option>
            <Option value="Army">Army</Option>
            <Option value="Navy">Navy</Option>
            <Option value="Defense & Services (Others)">Defense & Services (Others)</Option>
          </OptGroup>
          <OptGroup label="Education & Training">
            <Option value="Lecturer">Lecturer</Option>
            <Option value="Professor">Professor</Option>
            <Option value="Research Assistant">Research Assistant</Option>
            <Option value="Research Scholar">Research Scholar</Option>
            <Option value="Teacher">Teacher</Option>
            <Option value="Training Professional (Others)">Training Professional (Others)</Option>
          </OptGroup>
          <OptGroup label="Engineering">
            <Option value="Civil Engineer">Civil Engineer</Option>
            <Option value="Electronics / Telecom Engineer">Electronics / Telecom Engineer</Option>
            <Option value="Mechanical / Production Engineer">Mechanical / Production Engineer</Option>
            <Option value="Non IT Engineer (Others)">Non IT Engineer (Others)</Option>
          </OptGroup>
          <OptGroup label="Hotel & Hospitality">
            <Option value="Chef / Sommelier / Food Critic">Chef / Sommelier / Food Critic</Option>
            <Option value="Catering Professional">Catering Professional</Option>
            <Option value="Hotel & Hospitality Professional">Hotel & Hospitality Professional</Option>
          </OptGroup>
          <OptGroup label="IT & Software Engineering">
            <Option value="Software Developer / Programer">Software Developer / Programer</Option>
            <Option value="Software Consultant">Software Consultant</Option>
            <Option value="Hardware & Networking Professional">Hardware & Networking Professional</Option>
            <Option value="Software Professional (Others)">Software Professional (Others)</Option>
          </OptGroup>
          <OptGroup label="Legal">
            <Option value="Lawyer">Lawyer</Option>
            <Option value="Legal Assistant">Legal Assistant</Option>
            <Option value="Legal Professional (Others)">Legal Professional (Others)</Option>
          </OptGroup>
          <OptGroup label="Medical & Healthcare">
            <Option value="Dentist">Dentist</Option>
            <Option value="Doctor">Doctor</Option>
            <Option value="Medical Transcriptionist">Medical Transcriptionist</Option>
            <Option value="Nurse">Nurse</Option>
            <Option value="Pharmacist">Pharmacist</Option>
            <Option value="Physician Assistant">Physician Assistant</Option>
            <Option value="Physiotherapist / Occupational Therapist">Physiotherapist / Occupational Therapist</Option>
            <Option value="Psychologist">Psychologist</Option>
            <Option value="Surgeon">Surgeon</Option>
            <Option value="Veterinary Doctor">Veterinary Doctor</Option>
            <Option value="Therapist (Others)">Therapist (Others)</Option>
            <Option value="Medical / Healthcare Professional (Others)">
              Medical / Healthcare Professional (Others)
            </Option>
          </OptGroup>
          <OptGroup label="Merchant Navy">
            <Option value="Merchant Naval Officer">Merchant Naval Officer</Option>
            <Option value="Mariner">Mariner</Option>
          </OptGroup>
          <OptGroup label="Sales & Marketing">
            <Option value="Marketing Professional">Marketing Professional</Option>
            <Option value="Sales Professional">Sales Professional</Option>
          </OptGroup>
          <OptGroup label="Science">
            <Option value="Biologist / Botanist">Biologist / Botanist</Option>
            <Option value="Physicist">Physicist</Option>
            <Option value="Science Professional (Others)">Science Professional (Others)</Option>
          </OptGroup>
          <OptGroup label="Corporate Professionals">
            <Option value="CxO / Chairman / Director / President">CxO / Chairman / Director / President</Option>
            <Option value="VP / AVP / GM / AGM / DGM">VP / AVP / GM / AGM / DGM</Option>
            <Option value="Sr. Manager / Manager">Sr. Manager / Manager</Option>
            <Option value="Consultant / Supervisor / Team Leads">Consultant / Supervisor / Team Leads</Option>
            <Option value="Team Member / Staff">Team Member / Staff</Option>
          </OptGroup>
          <OptGroup label="Others">
            <Option value="Agent / Broker / Trader / Contractor">Agent / Broker / Trader / Contractor</Option>
            <Option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</Option>
            <Option value="Politician">Politician</Option>
            <Option value="Social Worker / Volunteer / NGO">Social Worker / Volunteer / NGO</Option>
            <Option value="Sportsman / Sportswoman">Sportsman / Sportswoman</Option>
            <Option value="Travel & Transport Professional">Travel & Transport Professional</Option>
            <Option value="Writer">Writer</Option>
          </OptGroup>
          <OptGroup label="Non Working">
            <Option value="Student">Student</Option>
            <Option value="Retired">Retired</Option>
            <Option value="Not Working">Not Working</Option>
          </OptGroup>
        </Select>
      </Form.Item>
      <Form.Item label="Employed in" name="employer" initialValue={null}>
        <Select bordered>
          <Option value="Private Company">Private Company</Option>
          <Option value="Government / Public Sector">Government / Public Sector</Option>
          <Option value="Defense / Civil Services">Defense / Civil Services</Option>
          <Option value="Business / Self Employed">Business / Self Employed</Option>
          <Option value="Not Working">Not Working</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Income (Lakhs/Yr)" name="income" initialValue={[null]}>
        <Slider
          range
          min={MINIMUM_INCOME}
          max={MAXIMUM_INCOME}
          marks={incomeMark}
          step={1}
          onChange={handleIncomeSliderChange}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" shape="round" size="middle" icon={<SaveOutlined />}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditEducationAndCareerDetails;
