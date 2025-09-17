import { View, Text, StyleSheet } from 'react-native'

export default function Header(){
    return (
        <View style={styles.container}>
            <View style={styles.searchbox}>
              <Text>MAPA DA SOLIDARIEDADE</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",          
    paddingTop: 32,                
  },
  searchbox: {
    width: "100%",
    flexDirection: "row",              
    alignItems: "center",
    padding: 25,
    borderColor: "#E6E6E6",
    borderWidth: 0.5
  },
})