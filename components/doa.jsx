import { View, Text, StyleSheet, ScrollView } from 'react-native'
import ToggleButton from './elements/doaToggleButton'
import { useState } from 'react'

export default function Doa(){
    const [campoTipo, setCampoTipo] = useState("")
    return (
        <View style={styles.container}>
            <Text style={styles.title}>De qual maneira deseja fazer sua doação?</Text>
            <ScrollView style={styles.scroll}>
                <ToggleButton
                    label={"Entregue pelo Fornecedor"}
                    text={"Mercados, Atacados e Varejos cadastrados em nossa base serão responsaveis por toda logistica e entrega! Itens e quantidade poderá ser requisitado pelo nosso app e serão enviados para administração do estabelicimento."}
                    selected={campoTipo === "fornecedor"}
                    onSelect={() => setCampoTipo("fornecedor")}
                />
                <ToggleButton
                    label={"Entregue por Delivery"}
                    text={"Se você tem algo para que possa doar e não tem como ir presencialmente ao local, chame um entregador! Modalidade integrada apenas  para serviços da Uber e 99. "}
                    selected={campoTipo === "delivery"}
                    onSelect={() => setCampoTipo("delivery")}
                />
                <ToggleButton
                    label={"Presencialmente"}
                    text={"Organize sua doação e mova-se para o local! Ao selecionar essa modalidade será enviado uma notificação à administração da ONG/Entidade para que todos fiquem ciente da sua chegada e doação."}
                    selected={campoTipo === "presente"}
                    onSelect={() => setCampoTipo("presente")}
                />
                <ToggleButton
                    label={"Transferência"}
                    text={"Realize qualquer transferencia em valores monetários para a instituição. Selecione a forma de pagamento disponivel pelo aplicativo ou registrado no seu cadastro."}
                    selected={campoTipo === "transfe"}
                    onSelect={() => setCampoTipo("transfe")}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // começa do topo (já respeitado pelo SafeAreaView)
    alignItems: "center",
    paddingHorizontal: 20, // só padding lateral
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 50,
    paddingLeft: 35,
    paddingRight: 25
  },
  scroll: {
    width: "100%",
    maxHeight: "60%",
    marginTop: 40,  // espaçamento depois do topo
    marginBottom: 20,
  }
})