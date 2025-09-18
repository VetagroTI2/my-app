// firestoreCrud.js
import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "./service";

// CREATE adddoc

export async function createDoc(data, docId, collectionName) {
  try {
    // Cria referência do documento usando o ID e a coleção passados
    const docRef = doc(db, collectionName, docId);

    // Cria ou atualiza o documento, mantendo campos existentes com merge: true
    await setDoc(docRef, data, { merge: true });

    return { id: docId, ...data };
  } catch (error) {
    console.error("Erro ao criar/atualizar documento:", error);
  }
}

// READ (pegar todos os documentos)
export async function getAllDocs(collectionName) {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    let docs = [];
    snapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    return docs;
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
  }
}

export async function getDocById(collectionName, id) {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Documento não encontrado!");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar documento:", error);
    return null;
  }
}

// UPDATE
export async function updateDocById(collectionName, id, newData) {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, newData);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar documento:", error);
    return false;
  }
}

// DELETE
export async function deleteDocById(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erro ao deletar documento:", error);
    return false;
  }
}
