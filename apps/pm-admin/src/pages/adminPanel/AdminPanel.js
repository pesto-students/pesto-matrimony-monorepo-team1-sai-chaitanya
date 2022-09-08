import react, { useState, useEffect } from 'react';
import { UserItemsList } from '../../components';

function AdminPanel() {
  const heading = {
    fontSize: '22px',
    color: '#3f3f3f',
    fontWeight: '700',
  };

  return <UserItemsList className="userItemsList" />;
}

export default AdminPanel;
