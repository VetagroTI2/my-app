import { View, Text, StyleSheet } from 'react-native'

export default function Header(){
    return (
        <View style={styles.container}>
            <View style={styles.title}>
              <Text>MAPA DA SOLIDARIEDADE</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,   // espaçamento suave depois do safe area
    marginBottom: 10 // garante respiro antes do mapa
  },
  title: {
    width: "100%",
    flexDirection: "row",              
    alignItems: "center",
    padding: 25,
    borderColor: "#E6E6E6",
    borderWidth: 0.5
  },
})