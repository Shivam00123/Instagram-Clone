import axios from "axios";

const instances = axios.create({
  baseURL: "http://localhost:8000",
});
export default instances;
