import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/service";

const AuthContext  = createContext({})

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [status, setStatus] = useState("")

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            setStatus("online");
        } else {
            setUser(null);
            setStatus("offline");
        }
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{user, status}}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook pra acessar facilmente
export function useAuth() {
  return useContext(AuthContext);
}