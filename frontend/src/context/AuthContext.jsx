import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "tripmate_token";

/*
=========================================================
GET CURRENT USER
=========================================================
*/
const extractUser = (response) => {
  const data = response?.data;

  return (
    data?.user ||
    data?.data?.user ||
    data?.data ||
    null
  );
};

/*
=========================================================
AUTH PROVIDER
=========================================================
*/
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  =======================================================
  GET CURRENT USER
  =======================================================
  */
  const getCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await API.get("/auth/me");

      const currentUser = extractUser(response);

      if (currentUser) {
        setUser(currentUser);
        return currentUser;
      }

      localStorage.removeItem(TOKEN_KEY);
      setUser(null);

      return null;
    } catch (error) {
      console.warn(
        "TripMate /auth/me failed:",
        error?.response?.status,
        error?.response?.data || error?.message
      );

      localStorage.removeItem(TOKEN_KEY);
      setUser(null);

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  =======================================================
  INITIAL AUTH CHECK
  =======================================================
  */
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  /*
  =======================================================
  LOGIN
  =======================================================
  
  Supports BOTH:

  login(email, password)

  AND

  login({
    email,
    password
  })
  =======================================================
  */
  const login = async (
    emailOrData,
    password
  ) => {
    try {
      let emailValue;
      let passwordValue;

      /*
      Login page may send an object
      */
      if (
        emailOrData &&
        typeof emailOrData === "object"
      ) {
        emailValue = emailOrData.email;
        passwordValue =
          emailOrData.password;
      }

      /*
      Or it may send two arguments
      */
      else {
        emailValue = emailOrData;
        passwordValue = password;
      }

      /*
      Validate
      */
      if (
        !emailValue ||
        !passwordValue
      ) {
        throw new Error(
          "Please provide both email and password."
        );
      }

      /*
      LOGIN REQUEST
      */
      const response = await API.post(
        "/auth/login",
        {
          email: String(emailValue)
            .trim()
            .toLowerCase(),

          password: passwordValue,
        }
      );

      const data = response?.data;

      /*
      Get JWT token
      */
      const token =
        data?.token ||
        data?.data?.token;

      if (!token) {
        throw new Error(
          data?.message ||
            "Login succeeded but the server did not return an authentication token."
        );
      }

      /*
      SAVE TOKEN
      */
      localStorage.setItem(
        TOKEN_KEY,
        token
      );

      /*
      Get user returned by login
      */
      const loggedInUser =
        data?.user ||
        data?.data?.user ||
        data?.data ||
        null;

      if (!loggedInUser) {
        throw new Error(
          "Login succeeded but no user information was returned."
        );
      }

      /*
      Set user immediately
      */
      setUser(loggedInUser);

      /*
      Verify token with /auth/me
      */
      try {
        const meResponse =
          await API.get("/auth/me");

        const verifiedUser =
          extractUser(meResponse);

        if (verifiedUser) {
          setUser(verifiedUser);
          return verifiedUser;
        }
      } catch (verifyError) {
        console.warn(
          "TripMate login verification failed:",
          verifyError?.response?.status,
          verifyError?.response?.data ||
            verifyError?.message
        );

        /*
        The login itself succeeded.
        Keep the token and logged-in user.
        */
      }

      return loggedInUser;
    } catch (error) {
      console.error(
        "TripMate login failed:",
        error?.response?.status,
        error?.response?.data ||
          error?.message
      );

      localStorage.removeItem(
        TOKEN_KEY
      );

      setUser(null);

      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  /*
  =======================================================
  REGISTER
  =======================================================

  Supports BOTH:

  register(name, email, password)

  AND

  register({
    name,
    email,
    password
  })
  =======================================================
  */
  const register = async (
    nameOrData,
    email,
    password
  ) => {
    try {
      let nameValue;
      let emailValue;
      let passwordValue;

      /*
      Register page may send an object
      */
      if (
        nameOrData &&
        typeof nameOrData === "object"
      ) {
        nameValue = nameOrData.name;
        emailValue = nameOrData.email;
        passwordValue =
          nameOrData.password;
      }

      /*
      Or separate arguments
      */
      else {
        nameValue = nameOrData;
        emailValue = email;
        passwordValue = password;
      }

      /*
      Validate
      */
      if (
        !nameValue ||
        !emailValue ||
        !passwordValue
      ) {
        throw new Error(
          "Please provide name, email and password."
        );
      }

      /*
      REGISTER REQUEST
      */
      const response = await API.post(
        "/auth/register",
        {
          name: String(nameValue).trim(),

          email: String(emailValue)
            .trim()
            .toLowerCase(),

          password: passwordValue,
        }
      );

      const data = response?.data;

      /*
      Get token
      */
      const token =
        data?.token ||
        data?.data?.token;

      /*
      Save token
      */
      if (token) {
        localStorage.setItem(
          TOKEN_KEY,
          token
        );
      }

      /*
      Get user
      */
      const registeredUser =
        data?.user ||
        data?.data?.user ||
        data?.data ||
        null;

      /*
      If registration automatically
      logs the user in
      */
      if (
        registeredUser &&
        token
      ) {
        setUser(
          registeredUser
        );

        /*
        Verify token
        */
        try {
          const meResponse =
            await API.get("/auth/me");

          const verifiedUser =
            extractUser(meResponse);

          if (verifiedUser) {
            setUser(
              verifiedUser
            );

            return verifiedUser;
          }
        } catch (error) {
          console.warn(
            "Registration succeeded but /auth/me verification failed:",
            error?.response?.status
          );
        }

        return registeredUser;
      }

      /*
      Registration succeeded but
      backend didn't automatically
      log the user in.
      */
      return {
        success:
          data?.success !== false,

        message:
          data?.message ||
          "Registration successful. Please log in.",

        user:
          registeredUser,
      };
    } catch (error) {
      console.error(
        "TripMate registration failed:",
        error?.response?.status,
        error?.response?.data ||
          error?.message
      );

      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed."
      );
    }
  };

  /*
  =======================================================
  LOGOUT
  =======================================================
  */
  const logout = async () => {
    try {
      await API.post(
        "/auth/logout"
      );
    } catch (error) {
      console.warn(
        "TripMate logout failed:",
        error?.response?.data ||
          error?.message
      );
    } finally {
      localStorage.removeItem(
        TOKEN_KEY
      );

      setUser(null);
    }
  };

  /*
  =======================================================
  PROVIDER
  =======================================================
  */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        getCurrentUser,
        isAuthenticated:
          Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*
=========================================================
USE AUTH
=========================================================
*/
export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}

export default AuthContext;