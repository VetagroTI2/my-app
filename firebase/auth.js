import { auth } from "./service.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Registrar usuário
export const registrar = async (email, senha) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
    console.log("Usuário criado:", userCredential.user)
    return userCredential.user.uid
  } catch (error) {
    console.log("Erro:", error.message)
  }
};

// Login usuário
export const login = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    console.log("Logado:", userCredential.user.uid);
  } catch (error) {
    console.log("Erro:", error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Usuário saiu com sucesso!");
  } catch (error) {
    console.error("Erro ao sair:", error);
  }
};
