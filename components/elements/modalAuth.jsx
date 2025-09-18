import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { useState, useEffect } from "react"
import { GeoPoint } from "firebase/firestore";
import { updateDocById, getDocById } from "../../firebase/crud";
import { useAuth } from "../../context/authContext";

export default function AuthModal({ visible, onClose }) {
  const { user } = useAuth();

  // estados
  const [campoLatitude, setCampoLatitude] = useState("");
  const [campoLongitude, setCampoLongitude] = useState("");
  const [campoHorario, setCampoHorario] = useState("");
  const [campoTamanho, setCampoTamanho] = useState("");
  const [campoDoacoes, setCampoDoacoes] = useState("");

  // quando abrir o modal, carrega os dados do Firestore
  useEffect(() => {
    if (visible) {
      async function carregarDados() {
        const dados = await getDocById("entidade", user.uid);
        if (dados) {
          setCampoLatitude(dados.geoloc?.latitude?.toString() || "");
          setCampoLongitude(dados.geoloc?.longitude?.toString() || "");
          setCampoHorario(dados.horario || "");
          setCampoTamanho(dados.tamanho || "");
          setCampoDoacoes(dados.doacao || "");
        }
      }
      carregarDados();
    }
  }, [visible]);

  async function updateEntidade() {
    let geo = new GeoPoint(Number(campoLatitude), Number(campoLongitude));

    const data = {
      geoloc: geo,
      horario: campoHorario,
      tamanho: campoTamanho,
      doacao: campoDoacoes,
    };

    await updateDocById("entidade", user.uid, data).then((param) =>
      param ? console.log("Atualizado!") : null
    );
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={styles.input}
              value={campoLatitude}
              onChangeText={setCampoLatitude}
            />
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={styles.input}
              value={campoLongitude}
              onChangeText={setCampoLongitude}
            />
            <Text style={styles.label}>Horário de Func.</Text>
            <TextInput
              style={styles.input}
              value={campoHorario}
              onChangeText={setCampoHorario}
            />
            <Text style={styles.label}>Tamanho</Text>
            <TextInput
              style={styles.input}
              value={campoTamanho}
              onChangeText={setCampoTamanho}
            />
            <Text style={styles.label}>Aceito doações de</Text>
            <TextInput
              style={styles.input}
              value={campoDoacoes}
              onChangeText={setCampoDoacoes}
            />
          </ScrollView>
          <TouchableOpacity style={styles.QueroDoarButton} onPress={updateEntidade}>
            <Text style={styles.QueroDoarText}>Atualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.QueroDoarButton} onPress={onClose}>
            <Text style={styles.QueroDoarText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  QueroDoarButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#000000",
    borderRadius: 8,
    alignItems: "center",
  },
  QueroDoarText: {
    color: "white",
    fontWeight: "bold",
  },
  label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
  },
  input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
  },
});
