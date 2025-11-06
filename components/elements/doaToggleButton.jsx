import { TouchableOpacity, Text, StyleSheet } from "react-native";

// Botao responsavel por renderizar cada opcao de doacao.
export default function ToggleButton({ label, selected, onSelect, text }) {
  // Renderiza o botao com estilos condicionalmente aplicados
  return (
    <TouchableOpacity
      style={[styles.item, selected && styles.selectedItem]}
      onPress={onSelect}
    >
      <Text style={[styles.title, selected && styles.selectedText]}>
        {label}
      </Text>
      { text ?
        <Text style={[styles.text, selected && styles.selectedText]}>
          {text}
        </Text>
      :null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#000",
  },
  title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold"
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  selectedText: {
    color: "#fff",
  },
});
