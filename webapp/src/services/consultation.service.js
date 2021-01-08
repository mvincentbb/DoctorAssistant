import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
  headers: {
    'Authorization': token,
  }
};

class ConsultationDataService {
  getAll() {
    return http.get("/consultations/", options);
  }

  getOrdonnances(id) {
    return http.get(`/consultations/${id}/ordonnances/`, options);
  }

  get(id) {
    return http.get(`/consultations/${id}/`, options);
  }

  create(data) {
    return http.post(`/consultations/`, data, options);
  }

  update(id, data) {
    return http.put(`/consultations/${id}/`, data, options);
  }

  delete(id) {
    return http.delete(`/consultations/${id}/`, options);
  }
}

export default new ConsultationDataService();