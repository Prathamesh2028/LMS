import { Skeleton } from "@/components/ui/skeleton";
import {
  initialSignInFormData,
  initialSignUpFormData,
} from "@/config";
import {
  checkAuthService,
  loginService,
  registerService,
} from "@/services";
import {
  createContext,
  useEffect,
  useState,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
    if (data.success) {
      console.log("Registered");
      navigate("/");
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginService(signInFormData);
    console.log("Login response:", data);

    if (data.success) {
      sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken));
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  async function checkAuthUser() {
    console.log("Running checkAuthUser...");
    try {
      const data = await checkAuthService();
      console.log("Auth check result:", data);

      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false); // ✅ Always turn off loading
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
