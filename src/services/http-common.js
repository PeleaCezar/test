import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:37367/api",
  headers: {
    "Content-type": "application/json"
  }
});