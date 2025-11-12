import { View, Text, StyleSheet, Image } from 'react-native'

// Componente de cabeçalho simples com título
export default function Header(){
    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <Image 
                    source={require('../public/logo-app.jpg')} 
                    style={{ width: "100%", height: 79, marginRight: 10, alignItems: "center", marginLeft: -10 }} 
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 1,   // espaçamento suave depois do safe area
    marginBottom: 1 // garante respiro antes do mapa
  },
  title: {
    width: "100%",
    flexDirection: "row",              
    alignItems: "center",
    padding: 25,
    borderColor: "#E6E6E6",
    borderWidth: 2
  },
})