import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
    headers: {
        'Authorization': token,
    }
};

class PatientDataService {
    getAll() {
        return http.get("/patients/", options);
    }

    get(id) {
        return http.get(`/patients/${id}/`, options);
    }

    create(data, isFormData=false) {
        if (isFormData)
            return http.post("/patients/", data, {...options, "Content-type": "multipart/form-data; boundary=63c5979328c44e2c869349443a94200e"});
        return http.post("/patients/", data, options);
    }

    countPatients(data) {
        console.log(data)
        return http.post("count/patients/", data, options);
    }

    update(id, data, isFormData=false) {
        if (isFormData)
            return http.put(`/patients/${id}/`, data, {...options, "Content-type": "multipart/form-data; boundary=63c5979328c44e2c869349443a94200e"});
        return http.put(`/patients/${id}/`, data, options);
    }

    delete(id) {
        return http.delete(`/patients/${id}/`, options);
    }
}

export default new PatientDataService();