import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView} from 'react-native'
import { login, logout, registrar } from '../firebase/auth'
import { useState } from 'react'
import { useAuth } from '../context/authContext'
import ToggleButton from './elements/authToggleButton'
import AuthModal from './elements/modalAuth'
import { createDoc } from '../firebase/crud'
import { Picker } from '@react-native-picker/picker'

export default function Perfil() {

    const { user, status } = useAuth()

    const [tipoFormulario, setTipoFormulario] = useState("Entrar")

    const [openModal, setOpenModal] = useState(false);

    //*************** VARIAVEIS DE ENTRADA 
    const [emailSignIn, setEmailSignIn] = useState("")
    const [passSignIn, setPassSignIn] = useState("")

    //***************VARIAVEIS DE REGISTROS DE USUARIO
    /**/ const [campoTipo, setCampoTipo] = useState("doador")
    /**/ const [campoBairro, setCampoBairro] = useState("")
    /**/ const [campoCep, setCampoCep] = useState("")
    /**/ const [campoComp, setCampoComp] = useState("")
    /**/ const [campoCpfcnpj, setCampoCpfcnpj] = useState("")
    /**/ const [campoEmail, setCampoEmail] = useState("")
    /**/ const [campoEndereco, setCampoEndereco] = useState("")
    /**/ const [campoNome, setCampoNome] = useState("")
    /**/ const [campoNumeroEnd, setCampoNumeroEnd] = useState("")
    /**/ const [campoSenha, setCampoSenha] = useState("")
    /**/ const [campoSenhaConf, setCampoSenhaConf] = useState("")
    /*************************************************************/

    async function sendDataRegister() {
        const newUser = {
            campoTipo,
            campoEmail,
            campoSenha,
            campoSenhaConf
        };

        const newInfoUsers = {
            bairro: campoBairro,
            cep: campoCep,
            comp: campoComp,
            cpfcnpj: campoCpfcnpj,
            email: campoEmail,
            endereco: campoEndereco,
            nome: campoNome,
            numeroEnd: campoNumeroEnd,
            tipo: campoTipo
        };

        // Valida se todas as informações obrigatórias foram preenchidas
        const allUserInfoFilled = Object.values(newInfoUsers).every(value => value);
        if (!allUserInfoFilled) {
            console.log("Preencha todos os campos obrigatórios!");
            return; // Sai da função se faltar algum campo
        }

        // Valida se as senhas conferem
        if (newUser.campoSenha !== newUser.campoSenhaConf) {
            console.log("As senhas não correspondem!");
            return;
        }

        try {
            // Registra o usuário
            const uid = await registrar(newUser.campoEmail, newUser.campoSenha, newUser.campoTipo);
            console.log("Usuário registrado com sucesso! UID:", uid);

            // Cria o documento no Firestore
            await createDoc(newInfoUsers, uid, newUser.campoTipo);
            console.log("Dados adicionais salvos com sucesso!");
            
        } catch (error) {
            console.error("Erro ao registrar usuário ou salvar dados:", error);
        }
    }

    if (status === "online") {
        return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Usuário logado ✅</Text>
                <Text style={styles.info}>UID: {user?.uid}</Text>
                <Text style={styles.info}>Email: {user?.email}</Text>

                <TouchableOpacity style={styles.button} onPress={() => setOpenModal(true)}>
                    <Text style={styles.buttonText}>Gravar Ponto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => null}>
                    <Text style={styles.buttonText}>Atualizar Dados</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => logout()}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </View>
            <AuthModal
                visible={openModal}
                onClose={() => setOpenModal(false)}
            />
        </View>
        );
    }

    if (status === "offline" && tipoFormulario === "Entrar") {
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        onChangeText={setEmailSignIn}
                        style={styles.input}
                        placeholder="Digite seu email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        onChangeText={setPassSignIn} 
                        style={styles.input}
                        placeholder="Digite sua senha"
                        secureTextEntry
                    />
                    <Picker>
                        <Picker.Item label="Selecione o tipo" value=""/>
                        <Picker.Item label="Doador" value="Doador"/>
                        <Picker.Item label="Entidade/ONG" value="Entidade/ONG"/>
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={() => login(emailSignIn, passSignIn)}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.registerText}>
                    Ainda não possui um cadastro?
                    <Text style={styles.registerLink} onPress={() => setTipoFormulario("Registrar")}> Clique aqui</Text>
                </Text>
            </View>
        )
    } else if (status === "offline" && tipoFormulario === "Registrar") {
        return (
            <View style={styles.container}>
                <Text style={styles.signInText}>
                    Já possui um cadastro?
                    <Text style={styles.signInLink} onPress={() => setTipoFormulario("Entrar")}> Clique aqui</Text>
                </Text>
                <View style={styles.form}>
                    <ScrollView>
                        <Text style={styles.label}>Você é?</Text>
                        <ToggleButton
                            label="Doador"
                            selected={campoTipo === "doador"}
                            onSelect={() => setCampoTipo("doador")}
                        />
                        <ToggleButton
                            label="Entidade/ONG"
                            selected={campoTipo === "entidade"}
                            onSelect={() => setCampoTipo("entidade")}
                        />
                        <Text style={styles.label}>CPF ou CNPJ</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoCpfcnpj}
                        />
                        <Text style={styles.label}>Nome completo ou Razão Social</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoNome}
                        />
                        <Text style={styles.label}>CEP</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoCep}
                        />
                        <Text style={styles.label}>Endereço</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoEndereco}
                        />
                        <Text style={styles.label}>Nº</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoNumeroEnd}
                        />
                        <Text style={styles.label}>Complemento</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoComp}
                        />
                        <Text style={styles.label}>Bairro</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoBairro}
                        />
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoEmail}
                        />
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoSenha}
                            secureTextEntry 
                        />
                        <Text style={styles.label}>Confirmar Senha</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setCampoSenhaConf}
                            secureTextEntry 
                        />
                        <TouchableOpacity style={styles.button} onPress={() => sendDataRegister()}>
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // começa do topo (já respeitado pelo SafeAreaView)
    alignItems: "center",
    paddingHorizontal: 20, // só padding lateral
    backgroundColor: "#fff",
  },
  form: {
    width: "100%",
    maxHeight: "89%",
    marginTop: 20,  // espaçamento depois do topo
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 15,
  },
  registerLink: {
    color: "#000000",
    fontWeight: "bold",
  },
  signInText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginTop: 15,
  },
  signInLink: {
    color: "#000000",
    fontWeight: "bold",
  },
});
