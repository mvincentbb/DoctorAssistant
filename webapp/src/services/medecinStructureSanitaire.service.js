import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
  headers: {
    'Authorization': token,
  }
};

class MedecinStructureSanitaireDataService {
  getAll() {
    return http.get("/medecinStructureSanitaires/", options);
  }

  get(id) {
    return http.get(`/medecinStructureSanitaires/${id}/`, options);
  }

  create(data) {
    return http.post("/medecinStructureSanitaires/", data, options);
  }

  update(id, data) {
    return http.put(`/medecinStructureSanitaires/${id}/`, data, options);
  }

  delete(id) {
    return http.delete(`/medecinStructureSanitaires/${id}/`, options);
  }

  delete(doctor_id, ss_id) {
    return http.delete(`/medecinStructureSanitaires/${doctor_id}/${ss_id}/`, options);
  }

  delete(doctor_id, ss_id, retour) {
    return http.delete(`/medecinStructureSanitaires/${doctor_id}/${ss_id}/?return=${retour}`, options);
  }
}

export default new MedecinStructureSanitaireDataService();