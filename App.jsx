import { StyleSheet, View } from 'react-native'
import { useState } from 'react'

import SearchBar from './components/searchbar.jsx'
import Menu from './components/menu.jsx'
import Mapa from './components/mapa.jsx'
import Header from './components/header.jsx'
import Perfil from './components/auth.jsx'

import { AuthProvider } from './context/authContext.jsx'

export default function App() {

  const [opcao, setOpcao] = useState("home")

  if (opcao === "Doar") {
    return (
      <View style={styles.container}>
        <Header setOpcao={setOpcao}/>
      </View>
    )
  }

  if (opcao === "opcao2") {
    return (
      <View style={styles.container}>
        <Header setOpcao={setOpcao}/>
        <Menu setOpcao={setOpcao}/>
      </View>
    )
  }

  if (opcao === "Perfil") {
    return (
      <View style={styles.container}>
        <AuthProvider>
          <Header/>
          <Perfil/>
          <Menu setOpcao={setOpcao}/>
        </AuthProvider>
      </View>
    )
  }

  if (opcao === "home") {
    return (
      <View style={styles.container}>
        <SearchBar/>
        <Mapa setOpcao={setOpcao}/>
        <Menu setOpcao={setOpcao}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
