"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";

// Define the AuthContext type
interface AuthContextType {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  isLoggedIn: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { logout, removeTokens, getToken } = AuthActions();

  useEffect(() => {
    const token = getToken("access");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, [getToken]);

  function handleLogout() {
    try {
      logout();
      removeTokens();
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      removeTokens();
      setIsLoggedIn(false);
      router.push("/");
    }
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loading, setLoading, setIsLoggedIn, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
