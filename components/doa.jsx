import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native'
import ToggleButton from './elements/doaToggleButton'
import { useState } from 'react'
import { useAuth } from '../context/authContext'
import { createRandomDoc } from '../firebase/crud'
import { Timestamp } from 'firebase/firestore'
import ListaComFormulario from './elements/doaFlatList'
import { Toast } from 'toastify-react-native'

export default function Doa({ setOpcao, setEntidade }) {
  
  const { status, grupo, user } = useAuth()
  const dataHoje = new Date()
  const dataHojeTimestamp = Timestamp.fromDate(dataHoje)

  /***************CONSTANTES DA FORMA DE DOAÇÃO******************* */
  /**/ const [campoTipo, setCampoTipo] = useState("fornecedor")
  /**/ const [confirm, setConfirm] = useState(false)
  /***************CONSTANTES DA FORMA DE DOAÇÃO******************* */

  /***************CONSTANTES DA FORMA FORNECEDOR******************* */
  /**/ const [fornecedor, setFornecedor] = useState("acucar")
  /**/ const [confirmFornecedor, setConfirmFornecedor] = useState(false)
  /**/ const dadosFornecedor = {empresa: fornecedor, tipo: "Fornecedor", nome: setEntidade?.nome, status: "Pendente", data_registro: dataHojeTimestamp, ong_id: setEntidade?.id, pedido: "#0075562", situacao: "separando" }
  /***************CONSTANTES DA FORMA FORNECEDOR******************* */

  /***************CONSTANTES DA FORMA DELIVERY******************* */
  /**/ const [delivery, setDelivery] = useState("uber")
  /**/ const [confirmDelivery, setConfirmDelivery] = useState(false)
  /**/ const dadosDelivery = {empresa: delivery, tipo: "Delivery", nome: setEntidade?.nome, status: "Pendente", data_registro: dataHojeTimestamp, ong_id: setEntidade?.id, carga: "caixa de papel", motorista: "Joaquim", veiculo: "Moto", placa: "XXX-0000" }
  /***************CONSTANTES DA FORMA DELIVERY******************* */

  /***************CONSTANTES DA FORMA TRANSFERENCIA******************* */
  /**/ const [confirmPagamento, setConfirmPagamento] = useState(false)
  /**/ const [confirmTransferencia, setConfirmTransferencia] = useState(false)
  /**/ const [forma, setForma] = useState("Transferência Pix")
  /**/ const [valor, setValor] = useState(0)
  /**/ const dadosTransferencia = {forma: forma, valor: valor, tipo: "Transferencia", nome: setEntidade?.nome, status: "Pendente", data_registro: dataHojeTimestamp, ong_id: setEntidade?.id }
  /***************CONSTANTES DA FORMA TRANSFERENCIA******************* */

  /***************CONSTANTES DA FORMA PRESENCIAL******************* */
  /**/ const [confirmPresente, setConfirmPresente] = useState(false)
  /**/ const dadosPresencial = {itens: ['Brinquedo/2/usado/Bom pra crianças', 'Roupa/5/nova/peça feminina', 'arroz/1/novo/5kg'], tipo: "Presencial", nome: setEntidade?.nome, status: "Pendente", data_registro: dataHojeTimestamp, ong_id: setEntidade?.id }
  /***************CONSTANTES DA FORMA PRESENCIAL******************* */

  async function addFornecedor() {
    let ref = "doador/"+user.uid+"/fornecedor"
    await createRandomDoc(dadosFornecedor, ref).then(async(res) => {
      let ref = "entidade/"+setEntidade?.id+"/fornecedor"
      await createRandomDoc({...dadosFornecedor, doador_id: user.uid, doa_id: res.id}, ref)
    })
    setConfirmFornecedor(true)
  }
  async function addDelivery() {
    let ref = "doador/"+user.uid+"/delivery"
    await createRandomDoc(dadosDelivery, ref).then(async(res) => {
      let ref = "entidade/"+setEntidade?.id+"/delivery"
      await createRandomDoc({...dadosDelivery, doador_id: user.uid, doa_id: res.id}, ref)
    })
    setConfirmDelivery(true)
  }
  async function addTransferencia() {
    let ref = "doador/"+user.uid+"/transferencia"
    await createRandomDoc(dadosTransferencia, ref).then(async(res) => {
      let ref = "entidade/"+setEntidade?.id+"/transferencia"
      await createRandomDoc({...dadosTransferencia, doador_id: user.uid, doa_id: res.id}, ref)
    })
    setConfirmTransferencia(true)
  }
  async function addPresencial() {
    let ref = "doador/"+user.uid+"/presencial"
    await createRandomDoc(dadosPresencial, ref).then(async(res) => {
      let ref = "entidade/"+setEntidade?.id+"/presencial"
      await createRandomDoc({...dadosPresencial, doador_id: user.uid, doa_id: res.id}, ref)
    })
    setConfirmPresente(true)
  }

  if (confirm && campoTipo === "presente") {
    if (confirmPresente) {
      return (
        <View style={styles.container}>
          <View style={styles.containerText}>
            <Text style={styles.text}>Sua doação foi registrada!</Text>
          <Text style={styles.text}>Obrigado por Contribuir!</Text>
          </View>
          <Image style={styles.imagePalmas} source={require('../public/maos-batendo-palmas.png')}/>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setOpcao("Doações") }
          >
            <Text style={styles.buttonText}>Ver Doações</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cadastreos itens para doação:</Text>
        <ListaComFormulario/>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addPresencial()}
        >
          <Text style={styles.buttonText}>Cadastrar doação</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (confirm && campoTipo === "transfe") {
    if (confirmPagamento) {
      if (confirmTransferencia) {
        return (
          <View style={styles.container}>
            <View style={styles.containerText}>
              <Text style={styles.text}>Sua doação foi registrada!</Text>
            <Text style={styles.text}>Obrigado por Contribuir!</Text>
            </View>
            <Image style={styles.imagePalmas} source={require('../public/maos-batendo-palmas.png')}/>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setOpcao("Doações")}
            >
              <Text style={styles.buttonText}>Ver Doações</Text>
            </TouchableOpacity>
          </View>
        )
      }
      return (
        <View style={pagar.container}>
          <View style={pagar.content}>
            <Text style={pagar.label}>Você vai enviar</Text>
            <Text style={pagar.valor}>R$ {Number(valor).toFixed(2)}</Text>
            <Text style={pagar.tipo}>{forma}</Text>

            <View style={pagar.separator} />

            <Text style={pagar.entidade}>ONG Esperança</Text>
            <Text style={pagar.banco}>Banco do Brasil</Text>

            <View style={pagar.separator} />

            <Text style={pagar.taxa}>Taxa de Administração</Text>
            <Text style={pagar.taxa}>+1,30%</Text>
          </View>

          <View style={pagar.footer}>
            <Text style={pagar.total}>Valor Total: R$ {(Number(valor) + Number(valor) * 0.013).toFixed(2)}</Text>
            <TouchableOpacity
              style={pagar.button}
              onPress={() => addTransferencia()}
            >
              <Text style={pagar.buttonText}>Pagar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    
    return (
      <View style={transf.container}>
        <Text style={transf.title}>
          Transferir para <Text style={transf.highlight}>{setEntidade?.nome}</Text>
        </Text>

        <TextInput
          style={transf.input}
          keyboardType="numeric"
          placeholder="R$ 0,00"
          placeholderTextColor="#555"
          onChangeText={(text) => setValor(text.replace(",", "."))}
        />

        <Text style={transf.subtitle}>Pagando com</Text>

        <View style={transf.paymentOptions}>
          <ToggleButton style={styles.option}
            label={"Pix"}
            selected={forma === "Transferência Pix"}
            onSelect={() => setForma("Transferência Pix")}
          />

          <ToggleButton
            label={"Boleto"}
            selected={forma === "Boleto Bancário"}
            onSelect={() => setForma("Boleto Bancário")}
          />
          <ToggleButton
            label={"Cartão"}
            selected={forma === "Cartão MASTER Final 9033"}
            onSelect={() => setForma("Cartão MASTER Final 9033")}
          />
        </View>

        <TouchableOpacity
          style={transf.button}
          onPress={() => setConfirmPagamento(true)}
        >
          <Text style={transf.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (confirm && campoTipo === "delivery") {
    if (confirmDelivery) {
      return (
        <View style={styles.container}>
          <Image style={styles.imagePalmas} source={require('../public/maos-batendo-palmas.png')}/>
          <View style={styles.containerText}>
            <Text style={styles.text}>Abre uma aplicação externa por meio de uma API ou Integração.</Text>
            <Text style={styles.text}>Uma chave ou token será criada para a integração e comunicação entre app e o Entregador.</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setOpcao("Doações")}
          >
            <Text style={styles.buttonText}>Ver Doações</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fazer um pedido para "Nome da ONG/Entidade" </Text>
        <ScrollView style={styles.scroll}>
          <ToggleButton
            label={"Uber"}
            selected={delivery === "uber"}
            onSelect={() => setDelivery("uber")}
          />
          <ToggleButton
            label={"99"}
            selected={delivery === "99"}
            onSelect={() => setDelivery("99")}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addDelivery()}
        >
          <Text style={styles.buttonText}>Fazer Pedido</Text>
          <Image style={styles.image} source={require('../public/seta-para-cima-e-para-a-direita-a-partir-do-quadrado.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  if (confirm && campoTipo === "fornecedor") {
    if (confirmFornecedor) {
      return (
        <View style={styles.container}>
          <Image style={styles.imagePalmas} source={require('../public/maos-batendo-palmas.png')}/>
          <View style={styles.containerText}>
            <Text style={styles.text}>Abre uma aplicação externa por meio de uma API ou Integração.</Text>
            <Text style={styles.text}>Uma chave ou token será criada para a integração e comunicação entre app e o Fornecedor.</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setOpcao("Doações") }
          >
            <Text style={styles.buttonText}>Ver Doações</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fazer um pedido para "Nome da ONG/Entidade" </Text>
        <ScrollView style={styles.scroll}>
          <ToggleButton
            label={"Pao de Acuçar"}
            selected={fornecedor === "acucar"}
            onSelect={() => setFornecedor("acucar")}
          />
          <ToggleButton
            label={"Cometa"}
            selected={fornecedor === "cometa"}
            onSelect={() => setFornecedor("cometa")}
          />
          <ToggleButton
            label={"São Luis"}
            selected={fornecedor === "luis"}
            onSelect={() => setFornecedor("luis")}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addFornecedor()}
        >
          <Text style={styles.buttonText}>Fazer Pedido</Text>
          <Image style={styles.image} source={require('../public/seta-para-cima-e-para-a-direita-a-partir-do-quadrado.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

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
      <TouchableOpacity
        style={styles.button}
        onPress={() => grupo === "Doador" && status === "online" ? setConfirm(true) : Toast.error("Você precisa estar logado como Doador para prosseguir com a doação!")}
      >
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start", // começa do topo (já respeitado pelo SafeAreaView)
    alignItems: "center",
    paddingHorizontal: 20, // só padding lateral
    backgroundColor: "#fff"
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
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "end",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 11,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: 24,      // largura menor
    height: 24,     // altura 
    marginLeft: 7  
  },
  containerText: {
    marginBottom: 40,
    width: "100%",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  imagePalmas: {
    width: "40%",   // responsivo (ocupa 40% da largura da tela)
    aspectRatio: 1, // mantém proporção quadrada
    marginBottom: 60,
  },

})

const transf = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold"
  },
  highlight: {
    color: "#303030", // ONG em cinza claro
    fontWeight: "700",
  },
  input: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#000000",
    marginBottom: 15,
    fontWeight: "bold"

  },
  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});

const pagar = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
    marginTop: 40,
  },
  label: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 10,
  },
  valor: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  tipo: {
    fontSize: 20,
    color: "#000000",
    marginBottom: 25,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginVertical: 20,
  },
  entidade: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "600",
  },
  banco: {
    fontSize: 16,
    color: "#757575",
    marginTop: 5,
  },
  taxa: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 5,
  },
  footer: {
    marginBottom: 20,
  },
  total: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
