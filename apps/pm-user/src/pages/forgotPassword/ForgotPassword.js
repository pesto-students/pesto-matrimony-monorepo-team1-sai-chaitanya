import React from 'react';
import { Form } from '../../components';
import axios from 'axios';
import styles from './forgotPassword.module.scss';

function ForgotPassword() {
  // vinit:{
  //   id: "00u6ch8hf8la2KWR55d7",
  //   mail: vinitsharma71@gmail.com
  // }

  const api_token = '00TW3soK2Eq883PaRVu5rjqRniqE6iaueZOivSe91P';

  const callLink = async () => {
    try {
      // const res = await axios.get('http://localhost:3333/api/v1/forgotpassword');
      const res = await axios.get('https://pm-api-yr8y.onrender.com/api/v1/forgotpassword');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return <button onClick={callLink}>submit</button>;
}

export default ForgotPassword;
