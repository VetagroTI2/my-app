import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Ícones do Expo

export default function ListaComFormulario({ setLista }) {
  const [itens, setItens] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [estado, setEstado] = useState("");
  const [descricao, setDescricao] = useState("");

  const adicionarItem = () => {
    if (!nome || !quantidade) return; // validação simples

    const novoItem = {
      id: Date.now().toString(),
      nome,
      quantidade,
      estado,
      descricao,
    };

    setItens([...itens, novoItem]);

    // limpa e fecha modal
    setNome("");
    setQuantidade("");
    setEstado("");
    setDescricao("");
    setModalVisible(false);
  };

  const limparLista = () => {
    setItens([]); // apaga todos os itens
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>
        {item.nome} - {item.quantidade}
      </Text>
      <Text style={styles.itemSub}>
        Estado: {item.estado || "—"} | {item.descricao || "Sem descrição"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {itens.length > 0 && (
          <TouchableOpacity onPress={limparLista}>
            <Ionicons name="trash-outline" size={28} color="black" alignItems="center" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.botaoMais}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.botaoMaisTexto}>+ Adicionar</Text>
          </TouchableOpacity>
        }
      />

      {/* Modal Formulário */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Novo Item</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              keyboardType="numeric"
              value={quantidade}
              onChangeText={setQuantidade}
            />
            <TextInput
              style={styles.input}
              placeholder="Estado"
              value={estado}
              onChangeText={setEstado}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />

            <View style={styles.botoes}>
              <TouchableOpacity
                style={[styles.botao, { backgroundColor: "#000" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#fff" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botao, { backgroundColor: "#000" }]}
                onPress={adicionarItem}
              >
                <Text style={{ color: "#fff" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: { fontSize: 16, fontWeight: "bold" },
  itemSub: { fontSize: 12, color: "#555" },
  botaoMais: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#000",
    alignItems: "center",
  },
  botaoMaisTexto: { color: "#fff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botao: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
});
