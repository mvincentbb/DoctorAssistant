import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
  headers: {
    'Authorization': token,
  }
};

class SpecialiteDataService {
  getAll() {
    return http.get("/specialites/", options);
  }

  get(id) {
    return http.get(`/specialites/${id}/`, options);
  }

  create(data) {
    return http.post("/specialites/", data, options);
  }

  update(id, data) {
    return http.put(`/specialites/${id}/`, data, options);
  }

  delete(id) {
    return http.delete(`/specialites/${id}/`, options);
  }
}

export default new SpecialiteDataService();