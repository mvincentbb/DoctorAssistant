import http from "../http-common";


class AuthService {
  login(data) {
    return http.post("/login/", data);
  }

  assert(data) {
    return http.post("/assert_user_by_token/", data);
  }

  register(data) {
    return http.post(`/register/`, data);
  }
}

export default new AuthService();