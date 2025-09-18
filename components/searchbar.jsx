import { useState } from "react";
import { View, TextInput, StyleSheet, Image } from 'react-native';

export default function SearchBar() {
  const [search, setSearch] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.searchbox}>
        <Image style={styles.image} source={require('../public/procurar.png')} />
        <TextInput
          style={styles.text}
          placeholder="Buscar"
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,   // espaçamento suave depois do safe area
    marginBottom: 10 // garante respiro antes do mapa
  },
  searchbox: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 9,
  },
  image: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  text: {
    fontSize: 18,
    color: "#828282",
    flex: 1, // ocupa o espaço restante de forma responsiva
  },
});
