import { View, Image, StyleSheet, TouchableOpacity  } from 'react-native'

export default function Header({ setOpcao }){
    return (
        <View style={styles.container}>
            <View style={styles.searchbox}>
                <TouchableOpacity onPress={() => setOpcao("home")}>
                    <Image style={styles.image} source={require('../public/angulo-esquerdo.png')}/>
                </TouchableOpacity>
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
  image: {
    width: 24,      // largura menor
    height: 24,     // altura 
    marginRight: 12 
  },
})