import react, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Avatar, List } from '../../atoms';
import axios from 'axios';
import './userItemsList.css';

const UserItemsList = () => {
  const [userdata, setUserData] = useState([]);

  const  herokuUrl = 'https://pmapi-pesto.herokuapp.com/api/v1/admin/getallusers';
  const url = 'http://localhost:8000/api/v1/admin/getallusers';

  const getAllUsersData = async () => {
    try {
      const response = await axios.get(herokuUrl);
      setUserData(response.data.user);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getAllUsersData();
    }
    fetchData();
  }, []);

  //
  const allUserData = userdata.map((data) => data);
  const maleUsers = userdata.filter((data) => data.gender === 'male');
  const femaleUsers = userdata.filter((data) => data.gender === 'female');

  const totalUsers = userdata.length;

  return (
    <>
      <h2>List of All users</h2>
      <div className="statsContaner">
        <div className="statsWraper">
          <div>Tolat :</div>
          <div>{totalUsers}</div>
        </div>
        <div className="statsWraper">
          <div>Male :</div>
          <div>{maleUsers.length}</div>
        </div>
        <div className="statsWraper">
          <div>Female :</div>
          <div>{femaleUsers.length}</div>
        </div>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={allUserData}
        renderItem={(item) => (
          <List.Item className="listItem">
            <List.Item.Meta
              className="listItemMeta"
              avatar={<Avatar src={item.images[0]} className="avatarInList" />}
              title={<a href="#">{item.name}</a>}
              description={`${item.email},  ${item.oktaUserId}`}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default UserItemsList;
