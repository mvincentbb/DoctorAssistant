import http from "../http-common";
import Cookies from 'universal-cookie';

const cookies = new Cookies();
let token = "Token " + cookies.get("token");

let options = {
	headers: {
		'Authorization': token,
	}
};

class ScheduleDataService {
	getAll() {
		return http.get("/schedules/", options);
	}

	getByMonth(month, year) {
		return http.get(`/schedules/?month=${month}&year=${year}`, options);
	}

}

export default new ScheduleDataService();