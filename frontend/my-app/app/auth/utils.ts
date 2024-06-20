import wretch from "wretch";
import Cookies from "js-cookie";

const api = wretch("http://localhost:8000/api").accept("application/json");

const storeToken = (token: string, type: "access" | "refresh") => {
  Cookies.set(type + "Token", token, { sameSite: 'none', secure: true});
};

const storeUserObject = (user: object)=>{
  // Add your code here to store the user object
  console.log(user);
}

const getToken = (type: string) => {
  return Cookies.get(type + "Token");
};

const removeTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

const register = (
  username: string,
  email: string,
  password: string,
  re_password: string
) => {
  return api.post({ username, email, password, re_password }, "/auth/users/");
};

const login = (email: string, password: string) => {
  return api.post({ email, password }, "/auth/jwt/create");
};

const logout = () => {
  const refreshToken = getToken("refresh");
  return api.post({ refresh: refreshToken }, "/auth/logout/");
};

const handleJWTRefresh = () => {
  const refreshToken = getToken("refresh");
  return api.post({ refresh: refreshToken }, "/auth/jwt/refresh");
};

const verifyJWT = () => {
  const accessToken = getToken("access");
  return api.post({ token: accessToken }, "/auth/jwt/verify");
}

const resetPassword = (email: string) => {
  return api.post({ email }, "/auth/users/reset_password/");
};

const resetPasswordConfirm = (
  new_password: string,
  re_new_password: string,
  token: string,
  uid: string
) => {
  return api.post(
    { uid, token, new_password, re_new_password },
    "/auth/users/reset_password_confirm/"
  );
};

export const AuthActions = () => {
  return {
    login,
    storeUserObject,
    resetPasswordConfirm,
    handleJWTRefresh,
    verifyJWT,
    register,
    resetPassword,
    storeToken,
    getToken,
    logout,
    removeTokens,
  };
};
