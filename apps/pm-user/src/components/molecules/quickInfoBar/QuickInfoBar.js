import React from 'react';
import { Segmented } from '../../atoms';
import { SEGMENT_OPTIONS } from './constants';
import styles from './quickInfoBar.module.scss';

const QuickInfoBar = ({ onClick }) => {
  return (
    <div className={styles.quickInfoBar}>
      <Segmented
        block
        defaultValue="received"
        onChange={onClick}
        options={SEGMENT_OPTIONS}
      />
    </div>
  );
};

export default QuickInfoBar;
