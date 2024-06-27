import wretch from "wretch";
import Cookies from "js-cookie";
import { HomeURL } from "@/lib/utils";


const storeToken = (token: string, type: "access" | "refresh") => {
  Cookies.set(type + "Token", token, { sameSite: 'none', secure: false});
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

// Initialize api within a function to ensure HomeURL is accessed after full module load
const getApi = () => {
  const url = HomeURL(); // Now calling HomeURL() within a function
  return wretch(url).accept("application/json"); // Corrected to use the url variable
};

const register = (
  username: string,
  email: string,
  password: string,
  re_password: string
) => {
  return getApi().post({ username, email, password, re_password }, "auth/users/");
};

const login = (email: string, password: string) => {
  return getApi().post({ email, password }, "auth/jwt/create");
};

const logout = () => {
  const refreshToken = getToken("refresh");
  return getApi().post({ refresh: refreshToken }, "auth/logout/");
};

const handleJWTRefresh = () => {
  const refreshToken = getToken("refresh");
  return getApi().post({ refresh: refreshToken }, "auth/jwt/refresh");
};

const verifyJWT = () => {
  const accessToken = getToken("access");
  return getApi().post({ token: accessToken }, "auth/jwt/verify");
}

const resetPassword = (email: string) => {
  return getApi().post({ email }, "auth/users/reset_password/");
};

const resetPasswordConfirm = (
  new_password: string,
  re_new_password: string,
  token: string,
  uid: string
) => {
  return getApi().post(
    { uid, token, new_password, re_new_password },
    "auth/users/reset_password_confirm/"
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