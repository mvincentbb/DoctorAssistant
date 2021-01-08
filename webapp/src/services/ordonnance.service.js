import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
    headers: {
        'Authorization': token,
    }
};

class OrdonnanceDataService {
    getAll() {
        return http.get("/ordonnances/", options);
    }

    get(id) {
        return http.get(`/ordonnances/${id}/`, options);
    }

    create(data) {
        return http.post("/ordonnances/", data, options);
    }

    update(id, data) {
        return http.put(`/ordonnances/${id}/`, data, options);
    }

    delete(id) {
        return http.delete(`/ordonnances/${id}/`, options);
    }
}

export default new OrdonnanceDataService();