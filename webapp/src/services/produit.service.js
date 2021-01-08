import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
  headers: {
    'Authorization': token,
  }
};

class ProduitDataService {
  getAll() {
    return http.get("/produits/", options);
  }

  get(id) {
    return http.get(`/produits/${id}/`, options);
  }

  create(data) {
    return http.post("/produits/", data, options);
  }

  update(id, data) {
    return http.put(`/produits/${id}/`, data, options);
  }

  delete(id) {
    return http.delete(`/produits/${id}/`, options);
  }
}

export default new ProduitDataService();