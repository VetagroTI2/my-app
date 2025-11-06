import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/service";

// Criando o contexto
// AuthContext vai armazenar as informações do usuário autenticado
// e disponibilizá-las para toda a aplicação
const AuthContext  = createContext({})

// Provider do contexto
// Componente que envolve a aplicação e fornece o contexto
export function AuthProvider({ children }) {
    // Estados
    const [user, setUser] = useState(null)
    const [status, setStatus] = useState("")
    const [grupo, setGrupo] = useState("")
    // Monitorando o estado de autenticação
    useEffect(() => {
        // Função que escuta mudanças no estado de autenticação
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // Se o usuário estiver autenticado atualiza os estados
        if (currentUser) {
            setUser(currentUser)
            setStatus("online")
            setGrupo(currentUser.displayName)
        } else {
            // Se não estiver, reseta os estados
            setUser(null);
            setStatus("offline")
            setGrupo("")
        }
        });
        // Retorna a função de desmontagem
        return unsubscribe;
    }, []);
    // Fornecendo o contexto para os componentes filhos
    // children são os componentes que estarão dentro do AuthProvider
    // Ex: <AuthProvider><App /></AuthProvider>
    // O valor fornecido no contexto inclui o usuário autenticado, status e grupo
    // Voce pode ver o seu uso dentro do App.jsx.
    return (
        <AuthContext.Provider value={{user, status, grupo}}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook pra acessar facilmente
// o contexto de autenticação em qualquer componente
export function useAuth() {
  return useContext(AuthContext);
}