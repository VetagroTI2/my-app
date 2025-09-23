import { useState } from 'react'

import SearchBar from './components/searchbar.jsx'
import Menu from './components/menu.jsx'
import Mapa from './components/mapa.jsx'
import Header from './components/header.jsx'
import Perfil from './components/auth.jsx'
import Doa from './components/doa.jsx'

import { AuthProvider } from './context/authContext.jsx'
import { SafeAreaView } from 'react-native-safe-area-context'
import HeaderNav from './components/headerNav.jsx'

export default function App() {

  const [opcao, setOpcao] = useState("Home")

  if (opcao === "Doar") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <HeaderNav setOpcao={setOpcao}/>
        <Doa/>
      </SafeAreaView>
    )
  }

  if (opcao === "Doações") {
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

  if (opcao === "Home") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <SearchBar/>
        <Mapa setOpcao={setOpcao}/>
        <Menu setOpcao={setOpcao}/>
      </SafeAreaView>
    );
  }
}
