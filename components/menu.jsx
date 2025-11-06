import { View, StyleSheet, TouchableOpacity, Image  } from 'react-native'

// Componente de menu inferior
// Recebe a função setOpcao como prop para alterar a opção selecionada
export default function Menu({ setOpcao }) {
  // Renderiza o menu com botões para Home, Doações e Perfil
  // Cada botão chama setOpcao com a opção correspondente ao ser pressionado
  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.menuItem} onPress={() => setOpcao("Home")}>
        <Image style={styles.image} source={require("../public/marcador-de-mapa.png")} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => setOpcao("Doações")}>
        <Image style={styles.image} source={require("../public/maos-coracao.png")} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => setOpcao("Perfil")}>
        <Image style={styles.image} source={require("../public/usuario-do-circulo.png")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  menuItem: {
    flex: 1,                    // Ocupa todo   espaço disponível
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 17,        // Altura do botão
    backgroundColor: "#ffffff" // Cor de fundo do botão           // Sem bordas arredondadas para ocupar tudo
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  image: {
    width: 24,      // largura menor
    height: 24,     // altura 
    marginRight: 12 
  },
});