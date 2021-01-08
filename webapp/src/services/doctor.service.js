import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
    headers: {
        'Authorization': token,
    }
};

class DoctorDataService {
    getAll() {
        return http.get("/medecins/", options);
    }

    get(id) {
        return http.get(`/medecins/${id}/`, options);
    }

    create(data) {
        return http.post("/medecins/", data, options);
    }

    update(id, data) {
        return http.put(`/medecins/${id}/`, data, options);
    }

    delete(id) {
        return http.delete(`/medecins/${id}/`, options);
    }

    addHospital(data) {
        return http.post(`/medecins/add_structure_sanitaire/`, data, options);
    }

    getDashInfos() {
        return http.get("/dash_infos/", options);
    }
}

export default new DoctorDataService();