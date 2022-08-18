import React from 'react';
import styles from './quickLinkCard.module.scss';
import { MyCard } from '../../molecules';

function QuickLinkCard() {
  return (
    <>
      <MyCard cardTitle="Masseges" className="myCard" />
      <MyCard cardTitle="Matches" className="myCard" />
    </>
  );
}

export default QuickLinkCard;
