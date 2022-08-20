import React from 'react';
import { Segmented } from '../../atoms';
import { SEGMENT_OPTIONS } from './constants';
import { useHistory } from 'react-router-dom';
import styles from './quickInfoBar.module.scss';

const QuickInfoBar = () => {
  const history = useHistory();

  //redirecting on changing the value
  function handleRedirectOnClick(value) {
    // switch (value) {
    //     case "received" :
    //         return history.pushs("/recieved");
    //     case "sent" :
    //         return history.pushs("/sent");
    //     case "accepted" :
    //         return history.pushs("/accepted");
    //     default :
    //         return history.pushs("/recieved");
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
