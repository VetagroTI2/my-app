import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { useState, useEffect } from "react"
import { GeoPoint } from "firebase/firestore";
import { updateDocById, getDocById } from "../../firebase/crud";
import { useAuth } from "../../context/authContext";
import { Toast } from 'toastify-react-native'

// Modal para atualizar dados do usuario autenticado.
export default function AuthModal({ visible, onClose }) {
  const { user, grupo } = useAuth();

  // estados
  const [campoLatitude, setCampoLatitude] = useState("");
  const [campoLongitude, setCampoLongitude] = useState("");
  const [campoHorario, setCampoHorario] = useState("");
  const [campoContato, setCampoContato] = useState("");
  const [campoDoacoes, setCampoDoacoes] = useState("");
  const [campoEndereco, setCampoEndereco] = useState("");
  const [campoBairro, setCampoBairro] = useState("");

  // quando abrir o modal, carrega os dados do Firestore
  useEffect(() => {
    if (visible) {
      //funcao que carrega os dados do usuario
      async function carregarDados() {
        // busca os dados do usuario no Firestore dependendo do grupo
        const dados = await getDocById(grupo === "Doador" ? "doador" : "entidade", user.uid);
        if (dados) {
          setCampoLatitude(dados.geoloc?.latitude?.toString() || "");
          setCampoLongitude(dados.geoloc?.longitude?.toString() || "");
          setCampoHorario(dados.horario || "");
          setCampoContato(dados.contato || "");
          setCampoDoacoes(dados.doacao || "");
          setCampoEndereco(dados.endereco || "");
          setCampoBairro(dados.bairro || "");
        }
      }
      carregarDados();
    }
  }, [visible]);

  // funcao que atualiza os dados do usuario
  async function updateEntidade() {
    // cria o GeoPoint a partir dos campos de latitude e longitude
    let geo = new GeoPoint(Number(campoLatitude), Number(campoLongitude));
    // cria o objeto com os dados
    const data = {
      geoloc: geo,
      horario: campoHorario,
      contato: campoContato,
      doacao: campoDoacoes,
      endereco: campoEndereco,
      bairro: campoBairro,
    };
    // atualiza os dados no Firestore dependendo do grupo do usuario
    await updateDocById(grupo === "Doador" ? "doador" : "entidade", user.uid, data).then((param) =>
      param ? Toast.success("Atualizado com sucesso!") : null
    );
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>{grupo}</Text>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={campoEndereco}
              onChangeText={setCampoEndereco}
            />
            <Text style={styles.label}>Bairro</Text>
            <TextInput
              style={styles.input}
              value={campoBairro}
              onChangeText={setCampoBairro}
            />
            {// campos adicionais apenas para Entidade/ONG
            grupo === "Entidade/ONG" && (<>
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
              <Text style={styles.label}>Contato</Text>
              <TextInput
                style={styles.input}
                value={campoContato}
                onChangeText={setCampoContato}
              />
              <Text style={styles.label}>Aceito doações de</Text>
              <TextInput
                style={styles.input}
                value={campoDoacoes}
                onChangeText={setCampoDoacoes}
              />
            </>)}
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
