import { auth, db } from "./service.js";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Toast } from 'toastify-react-native'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";


// Registrar usuário
export const registrar = async (email, senha) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
    console.log("Usuário criado:", userCredential.user.uid)
    return userCredential.user.uid
  } catch (error) {
    console.log("Erro:", error.message)
  }
};

// Login usuário
export const login = async (email, senha, tipo) => {
  try {
    const collectionRef = collection(db, tipo === "Doador" ? "doador" : "entidades")
    const q = query(collectionRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      Toast.error("Nenhum usuário encontrado.")
      return false
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user
      await updateProfile(user, {displayName:tipo})
      return false
    }
    
    //CRIAR UMA CONDICIONAL PARA O tipo. Pois não pode entrar com conta de doador sendo do tipo Entidade


    //console.log("Logado:", user.uid);
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
