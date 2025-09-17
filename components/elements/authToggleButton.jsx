import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ToggleButton({ label, selected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.item, selected && styles.selectedItem]}
      onPress={onSelect}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
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
  text: {
    fontSize: 16,
    color: "#000",
  },
  selectedText: {
    color: "#fff",
  },
});
