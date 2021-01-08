import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");
// alert(process.env);
// console.log("ZZZZZZZZZZZ", process.env);
// const BASE_URL = "https://doctorassistance.herokuapp.com";
const BASE_URL = "http://127.0.0.1:8000";
// const BASE_URL = process.env.API_URL || "http://127.0.0.1:7000";

export {BASE_URL};
export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  }
});
