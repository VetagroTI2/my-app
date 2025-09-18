import { StyleSheet, View } from 'react-native'
import { useState } from 'react'

import SearchBar from './components/searchbar.jsx'
import Menu from './components/menu.jsx'
import Mapa from './components/mapa.jsx'
import Header from './components/header.jsx'
import Perfil from './components/auth.jsx'

import { AuthProvider } from './context/authContext.jsx'
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderNav from './components/headerNav.jsx'

export default function App() {

  const [opcao, setOpcao] = useState("home")

  if (opcao === "Doar") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <HeaderNav setOpcao={setOpcao}/>
      </SafeAreaView>
    )
  }

  if (opcao === "opcao2") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <Header setOpcao={setOpcao}/>
        <Menu setOpcao={setOpcao}/>
      </SafeAreaView>
    )
  }

  if (opcao === "Perfil") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <AuthProvider>
          <Header/>
          <Perfil/>
          <Menu setOpcao={setOpcao}/>
        </AuthProvider>
      </SafeAreaView>
    )
  }

  if (opcao === "home") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <SearchBar/>
        <Mapa setOpcao={setOpcao}/>
        <Menu setOpcao={setOpcao}/>
      </SafeAreaView>
    );
  }
}
