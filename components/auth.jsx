import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView} from 'react-native'
import { login, logout, registrar } from '../firebase/auth'
import { useState } from 'react'
import { useAuth } from '../context/authContext'
import ToggleButton from './elements/authToggleButton'
import AuthModal from './elements/modalAuth'

export default function Perfil() {

    const { user, status } = useAuth()

    const [tipoFormulario, setTipoFormulario] = useState("Entrar")

    const [openModal, setOpenModal] = useState(false);


    const [emailSignIn, setEmailSignIn] = useState("")
    const [passSignIn, setPassSignIn] = useState("")

    const [selectedId, setSelectedId] = useState("doador");

    if (status === "online") {
        return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Usuário logado ✅</Text>
                <Text style={styles.info}>UID: {user?.uid}</Text>
                <Text style={styles.info}>Email: {user?.email}</Text>

                <TouchableOpacity style={styles.button} onPress={() => setOpenModal(true)}>
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
                <View style={styles.form}>
                    <ScrollView>
                        <Text style={styles.label}>Você é?</Text>
                        <ToggleButton
                            label="Doador"
                            selected={selectedId === "doador"}
                            onSelect={() => setSelectedId("doador")}
                        />
                        <ToggleButton
                            label="Entidade/ONG"
                            selected={selectedId === "entidade"}
                            onSelect={() => setSelectedId("entidade")}
                        />
                        <Text style={styles.label}>CPF ou CNPJ</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>Nome completo ou Razão Social</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>CEP</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>Endereço</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>Nº</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>Complemento</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>Bairro</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>Senha</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <Text style={styles.label}>Confirmar Senha</Text>
                        <TextInput
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.button} onPress={() => null}>
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        </TouchableOpacity>
                    </ScrollView> 
                </View>
                <Text style={styles.registerText}>
                    Já possui um cadastro?
                    <Text style={styles.registerLink} onPress={() => setTipoFormulario("Entrar")}> Clique aqui</Text>
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff"
    },
    form: {
        width: "100%",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#000000",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    registerText: {
        fontSize: 14,
        color: "#333",
    },
    registerLink: {
        color: "#000000",
        fontWeight: "bold",
    },
})
