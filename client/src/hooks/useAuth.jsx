import { useContext } from "react"
import { AuthContext } from "../authProvider/AuthProvider";

export const useAuth = ()=>{
  const auth = useContext(AuthContext);
  return auth;
}