// firestoreCrud.js
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./service";

const COLLECTION_NAME = "entidade"; // sua coleção no Firestore

// CREATE
export async function createDoc(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Erro ao criar documento:", error);
  }
}

// READ (pegar todos os documentos)
export async function getAllDocs() {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    let docs = [];
    snapshot.forEach((doc) => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    return docs;
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
  }
}

// UPDATE
export async function updateDocById(id, newData) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
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
