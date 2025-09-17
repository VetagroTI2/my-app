import { useState } from "react";
import { View, TextInput, StyleSheet, Image  } from 'react-native'

export default function SearchBar() {
  const [search, setSearch] = useState("");
  return (
      <View style={styles.container}>
        <View style={styles.searchbox}>
          <Image style={styles.image} source={require('../public/procurar.png')}/>
          <TextInput
            style={styles.text}
            placeholder="Buscar"
            value={search}
            onChangeText={setSearch} // atualiza o estado
           />
         </View>
       </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start", // começa no topo
    alignItems: "center",          // centraliza horizontal
    paddingTop: 50,                // espaço do topo
  },
  searchbox: {
    width: "90%",    // largura responsiva
    flexDirection: "row",              
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 9,              // espaçamento interno
  },
  image: {
    width: 24,      // largura menor
    height: 24,     // altura 
    marginRight: 12 
  },
  text: {
    fontSize: 18,
    color: "#828282",
    width: "90%"
  },
});

