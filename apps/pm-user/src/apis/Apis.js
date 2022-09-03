import axios from "axios";

const Apis = () => {
    return axios.create({
        baseURL: "https://http://localhost:3333/api/v1"
    });
}

export default Apis;