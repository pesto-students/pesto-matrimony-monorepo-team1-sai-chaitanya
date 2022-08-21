import React from 'react';
import { Segmented } from '../../atoms';
import { SEGMENT_OPTIONS } from './constants';
import { useHistory } from 'react-router-dom';
import styles from './quickInfoBar.module.scss';

const QuickInfoBar = () => {
  const history = useHistory();

  //redirecting on changing the value
  function handleRedirectOnClick(e) {
    // const value = e.target.value;
    // switch (value) {
    //     case "received" :
    //          history.push("/recieved");
    //     case "sent" :
    //          history.push("/sent");
    //     case "accepted" :
    //          history.push("/accepted");
    //     default :
    //          history.push("/recieved");
    // }
  }

  return (
    <div className={styles.quickInfoBar}>
    <Segmented
      block={true}
      defaultValue="received"
      onChange={handleRedirectOnClick}
      options={SEGMENT_OPTIONS}
    />
    </div>
  );
};

export default QuickInfoBar;
