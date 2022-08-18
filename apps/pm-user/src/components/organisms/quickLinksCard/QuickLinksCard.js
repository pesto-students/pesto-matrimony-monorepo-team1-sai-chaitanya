import React from 'react';
import styles from './quickLinksCard.module.scss';
import { MyCard } from '../../molecules';

function QuickLinksCard() {
  return (
    <>
      <MyCard cardTitle="Masseges" className="myCard" />
      <MyCard cardTitle="Matches" className="myCard" />
    </>
  );
}

export default QuickLinksCard;
