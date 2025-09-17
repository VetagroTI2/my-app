import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";

export default function AuthModal({ visible, onClose }) {
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                      <Text style={styles.closeText}>X</Text>
                  </TouchableOpacity>
                  <ScrollView>
                    <Text style={styles.label}>Latitude</Text>
                    <TextInput
                        style={styles.input}
                    />
                    <Text style={styles.label}>Longitude</Text>
                    <TextInput
                        style={styles.input}
                    />
                    <Text style={styles.label}>Horario de Func.</Text>
                    <TextInput
                        style={styles.input}
                    />
                    <Text style={styles.label}>Tamanho</Text>
                    <TextInput
                        style={styles.input}
                    />
                    <Text style={styles.label}>Aceito doações de</Text>
                    <TextInput
                        style={styles.input}
                    />
                  </ScrollView>
                  <TouchableOpacity style={styles.QueroDoarButton} onPress={() => console.log("modalAuth.jsx: Dados Atualizados!")}>
                      <Text style={styles.QueroDoarText}>Atualizar</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
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
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
