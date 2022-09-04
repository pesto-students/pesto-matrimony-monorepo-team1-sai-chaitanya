import axios from 'axios';

const Apis = () => {
  return axios.create({
    baseURL: 'http://localhost:8000/api/v1/users',
  });
};

export default Apis;
