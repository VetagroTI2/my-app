import { useState } from 'react'

import SearchBar from './components/searchbar.jsx'
import Menu from './components/menu.jsx'
import Mapa from './components/mapa.jsx'
import Header from './components/header.jsx'
import Perfil from './components/auth.jsx'
import Doa from './components/doa.jsx'
import HeaderNav from './components/headerNav.jsx'
import Doacoes from './components/doacoes.jsx'
import ToastManager, { Toast } from 'toastify-react-native'

import { AuthProvider } from './context/authContext.jsx'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function App() {

  const [opcao, setOpcao] = useState("Home")
  const [entidadeSelecionada, setEntidadeSelecionada] = useState("")

  if (opcao === "Doar") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <AuthProvider>
          <HeaderNav setOpcao={setOpcao}/>
          <Doa setOpcao={setOpcao} setEntidade={entidadeSelecionada}/>
          <ToastManager/>
        </AuthProvider>
      </SafeAreaView>
    )
  }

  if (opcao === "Doações") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <AuthProvider>
          <Header/>
          <Doacoes/>
          <Menu setOpcao={setOpcao}/>
        </AuthProvider>
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
          <ToastManager/>
        </AuthProvider>
      </SafeAreaView>
    )
  }

  if (opcao === "Home") {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <SearchBar/>
        <Mapa setOpcao={setOpcao} setEntidade={setEntidadeSelecionada}/>
        <Menu setOpcao={setOpcao}/>
      </SafeAreaView>
    );
  }
}
