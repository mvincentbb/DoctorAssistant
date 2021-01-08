import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
  headers: {
    'Authorization': token,
  }
};

class DemandeConsultationsDataService {
  getAll() {
    return http.get("/demandeConsultations/", options);
  }

  getNews() {
    return http.get("/demandeConsultations/news/", options);
  }

  getAllWithNames() {
    return http.get("demandeConsultationsWithNames/", options);
  }
  get(id) {
    return http.get(`/demandeConsultations/${id}/`, options);
  }

  create(data) {
    return http.post("/demandeConsultations/", data, options);
  }

  update(id, data) {
    return http.put(`/demandeConsultations/${id}/`, data, options);
  }

  delete(id) {
    return http.delete(`/demandeConsultations/${id}/`, options);
  }
}

export default new DemandeConsultationsDataService();