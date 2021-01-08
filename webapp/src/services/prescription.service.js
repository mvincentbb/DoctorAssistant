import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
  headers: {
    'Authorization': token,
  }
};

class PrescriptionDataService {
  getAll() {
    return http.get("/prescriptions/", options);
  }

  get(id) {
    return http.get(`/prescriptions/${id}/`, options);
  }

  create(data) {
    return http.post("/prescriptions/", data, options);
  }

  update(id, data) {
    return http.put(`/prescriptions/${id}/`, data, options);
  }

  delete(id) {
    return http.delete(`/prescriptions/${id}/`, options);
  }
}

export default new PrescriptionDataService();