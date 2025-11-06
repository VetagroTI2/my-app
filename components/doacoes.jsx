import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { getAllDocs, updateDocById } from "../firebase/crud";
import { useAuth } from "../context/authContext.jsx";
import { Toast } from 'toastify-react-native'

// Componente principal de Doações
export default function Doacoes() {
  /// Estados e variáveis
  const { user, grupo } = useAuth()
  const [filtro, setFiltro] = useState("Todos")
  const [doacoes, setDoacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  // Detalhes da doação
  const [telaDetalhe, setTelaDetalhe] = useState(false);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);
  // Avaliação
  const [avaliacao, setAvaliacao] = useState(0)
  const estrelas = [1, 2, 3, 4, 5]
  // Filtros
  const filtros = ["Todos", "Fornecedor", "Delivery", "Transferencia", "Presencial"];

  // Carregar doações do usuário pegas no Firebase
  useEffect(() => {
    async function carregar() {
      // Se não estiver logado, não carrega
      if (!user?.uid) return null
      // Começa a carregar
      setCarregando(true)
      // Tenta pegar as doações
      try {
        // Nomes das subcoleções
        const subcolecoes = ["transferencia", "presencial", "delivery", "fornecedor"]
        // Pega todas as doações de todas as subcoleções
        const resultados = await Promise.all(
          // Para cada subcoleção, pega os documentos
          subcolecoes.map(async (nome) => {
            // Pega os documentos
            const data = await getAllDocs(`${grupo === "Doador" ? "doador" : "entidade" }/${user.uid}/${nome}`)
            // Adiciona o tipo de doação
            return data
          })
        )
        // Junta todas as doações em uma única lista
        const todas = resultados.flat()
        // Seta as doações no estado
        setDoacoes(todas)
        //Caso gere erro, mostra no console
      } catch (error) {
        // Mostra erro
        console.log("Erro ao carregar doações:", error)
      } finally {
        // Termina de carregar
        setCarregando(false)
      }
    }
    // Chama a função de carregar
    carregar();
    // caso o usuário mude, recarrega as doações
  }, [user]);

  // Função para filtrar e ordenar doações
  const filtrarDoacoes = () => {
    // Primeiro, filtra conforme o tipo
    let listaFiltrada =
      filtro === "Todos"
        ? [...doacoes] // cópia para não alterar o estado original
        : doacoes.filter((d) => d.tipo === filtro);

    // Depois, ordena pela data_registro (mais recente primeiro)
    listaFiltrada.sort((a, b) => {
      const dataA = a.data_registro?.toDate
        ? a.data_registro.toDate()
        : new Date(a.data_registro);
      const dataB = b.data_registro?.toDate
        ? b.data_registro.toDate()
        : new Date(b.data_registro);
      return dataB - dataA; // ordem decrescente
    });
    // Retorna a lista filtrada e ordenada
    return listaFiltrada;
  };

  // Função para atualizar a situação da doação
  async function updateSituacao(doador, tipo, doacao_doador, doacao_entidade) {
    // Atualiza a situação para "Recebida" em ambas as coleções (doador e entidade)
    await updateDocById(`doador/${doador}/${tipo}`, doacao_doador, { status: "Recebida" })
    await updateDocById(`entidade/${user.uid}/${tipo}`, doacao_entidade, { status: "Recebida" }).then(() => {
      Toast.success("Doação marcada como recebida!")
    })
    // Fecha a tela de detalhes
    setTelaDetalhe(false)
    setDoacaoSelecionada(null)
    setAvaliacao(0)
  }

  // Renderização da tela de detalhes
  if (telaDetalhe && doacaoSelecionada) {
    // Retorna a tela de detalhes da doação selecionada
    return (
      <View style={details.container}>
        <View style={details.acoesContainer}>
          <TouchableOpacity style={details.acaoBotao}>
            <Text style={details.acaoTexto}>Suporte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={details.acaoBotao}>
            <Text style={details.acaoTexto}>Contato</Text>
          </TouchableOpacity>
        </View>
        <Text style={details.titulo}>Detalhes da Doação</Text>

        <Text style={details.label}>Entidade:</Text>
        <Text style={details.valor}>{doacaoSelecionada.nome}</Text>

        <Text style={details.label}>Tipo:</Text>
        <Text style={details.valor}>{doacaoSelecionada.tipo}</Text>

        <Text style={details.label}>Status:</Text>
        <Text style={details.valor}>{doacaoSelecionada.status}</Text>

        <Text style={[details.label, { marginTop: 20 }]}>Avaliação:</Text>
        <View style={details.estrelasContainer}>
          {// Renderiza as estrelas para avaliação
          estrelas.map((estrela) => (
            <TouchableOpacity key={estrela} onPress={() => setAvaliacao(estrela)}>
              <Text style={[details.estrela, estrela <= avaliacao && details.estrelaAtiva]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[details.label, { marginTop: 20 }]}>Descrição:</Text>
        <ScrollView>
          {// Renderiza os detalhes da doação
          (() =>{ switch (doacaoSelecionada.tipo) {
            // Detalhes para doações do tipo Fornecedor
            case "Fornecedor":
              // Formata a data de registro e verifica se é válida
              let dataFormatada = doacaoSelecionada.data_registro?.toDate
                ? doacaoSelecionada.data_registro.toDate().toLocaleDateString('pt-BR')
                : 'Data inválida';
              // Retorna os detalhes específicos para o tipo Fornecedor
              return (
                <View style={details.container}>
                  <Text style={details.texto}>🏢 Empresa: {doacaoSelecionada.empresa}</Text>
                  <Text style={details.texto}>📅 Data do Registro: {dataFormatada}</Text>
                  <Text style={details.texto}>📦 Número do Pedido: {doacaoSelecionada.pedido}</Text>
                  <Text style={details.texto}>📌 Situação: {doacaoSelecionada.situacao}</Text>
                </View>
              );
              // Detalhes para doações do tipo Delivery
            case "Delivery":
              // Formata a data de registro e verifica se é válida
              let dataFormatoda = doacaoSelecionada.data_registro?.toDate
                ? doacaoSelecionada.data_registro.toDate().toLocaleDateString('pt-BR')
                : 'Data inválida';
              // Retorna os detalhes específicos para o tipo Delivery
              return (
                <View style={details.container}>
                  <Text style={details.texto}>🏢 Empresa: {doacaoSelecionada.empresa}</Text>
                  <Text style={details.texto}>📅 Data do Registro: {dataFormatoda}</Text>
                  <Text style={details.texto}>📦 Carga: {doacaoSelecionada.carga}</Text>
                  <Text style={details.texto}>🧑‍✈️ Motorista: {doacaoSelecionada.motorista}</Text>
                  <Text style={details.texto}>🚚 Veículo: {doacaoSelecionada.veiculo}</Text>
                  <Text style={details.texto}>🔢 Placa: {doacaoSelecionada.placa}</Text>
                </View>
              );
              // Detalhes para doações do tipo Transferencia
            case "Transferencia":
              // Calcula o valor com a taxa de 1,3%
              let valorOriginal = parseFloat(doacaoSelecionada.valor);
              let taxa = 0.013;
              let valorComTaxa = (valorOriginal * (1 + taxa)).toFixed(2);
              // Formata a data de registro e verifica se é válida
              let dataRegistro = doacaoSelecionada.data_registro?.toDate
                ? doacaoSelecionada.data_registro.toDate().toLocaleDateString('pt-BR')
                : 'Data inválida';
              // Retorna os detalhes específicos para o tipo Transferencia
              return (
                <View style={details.container}>
                  <Text style={details.texto}>
                    📅 Data do Registro: {dataRegistro}
                  </Text>
                  <Text style={details.texto}>
                    💳 Forma de Pagamento: {doacaoSelecionada.forma}
                  </Text>
                  <Text style={details.texto}>
                    💰 Valor Doado: R$ {valorOriginal.toFixed(2)}
                  </Text>
                  <Text style={details.texto}>
                    🧾 Valor após Taxa (1,3%): R$ {valorComTaxa}
                  </Text>
                  <Text style={details.texto}>
                    🏦 Banco Transferido: BCO DO BRASIL SA
                  </Text>
                  <Text style={details.texto}>
                    🏢 Agência: 1234-5
                  </Text>
                  <Text style={details.texto}>
                    🧾 Conta Corrente: 987654-3
                  </Text>
                </View>
              );
              // Detalhes para doações do tipo Presencial
            case "Presencial":
              // Retorna os detalhes específicos para o tipo Presencial
              return (
              <View style={presencialLista.container}>
                {// Mapeia os itens da doação e exibe suas informações
                doacaoSelecionada.itens.map((item, index) => {
                  const [nome, quantidade, estado, descricao] = item.split('/');
                  return (
                    <View key={index} style={presencialLista.cell}>
                      <Text style={presencialLista.itemText}>
                        {nome.trim()}
                      </Text>
                      <Text style={presencialLista.quantityText}>
                        {quantidade.trim()} unidades
                      </Text>
                      <Text style={presencialLista.quantityText}>
                        Estado: {estado.trim()}
                      </Text>
                      <Text style={presencialLista.quantityText}>
                        Decrição: {descricao.trim()}
                      </Text>
                    </View>
                  );
                })}
              </View>
              )
              // Caso o tipo não seja reconhecido
            default:
              return null;
          }})()}
        </ScrollView>
        {// Botão para marcar a doação como recebida, se aplicável. Se o grupo for doador, ele não pode marcar a doação como recebida.
        doacaoSelecionada.status !== "Recebida" && grupo !== "Doador" && (
        <TouchableOpacity
          style={[details.button, { marginBottom: -20, marginTop: 10,alignSelf: 'center' }]}
          onPress={() => updateSituacao(doacaoSelecionada.doador_id, doacaoSelecionada.tipo.toLowerCase(), doacaoSelecionada.doa_id, doacaoSelecionada.id)}
        >
          <Text style={details.buttonText}>Doação recebida</Text>
        </TouchableOpacity>)}
        <TouchableOpacity
          style={[details.button, { marginTop: 40, alignSelf: 'center' }]}
          onPress={() => setTelaDetalhe(false) || setDoacaoSelecionada(null) || setAvaliacao(0)}
        >
          <Text style={details.buttonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {// Renderiza os botões de filtro
          filtros.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.filtroBotao, filtro === item && styles.filtroAtivo]}
              onPress={() => setFiltro(item)}
            >
              <Text style={[styles.filtroTexto, filtro === item && styles.filtroTextoAtivo]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {// Condicionalmente renderiza o conteúdo baseado no estado de autenticação e carregamento
      // Se o usuário não estiver logado, mostra uma mensagem de aviso
      // Se estiver carregando, mostra um indicador de atividade
      // Se não houver doações, mostra uma mensagem de aviso
      // Caso contrário, mostra a lista de doações filtradas
      !user?.uid ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          ⚠️ Faça login para ver suas doações.
        </Text>
      ) : carregando ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : doacoes.length === 0 ?  (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          ⚠️ Nenhuma doação encontrada.
        </Text>
      ) : (
        <FlatList
          data={filtrarDoacoes()}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setDoacaoSelecionada(item);
                setTelaDetalhe(true);
              }}
            >
              <View style={styles.card}>
                <Text style={styles.nome}>{grupo === "Doador" ? item.nome : item.id}</Text>
                <Text style={styles.tipo}>{item.tipo}</Text>
                <Text style={styles.valor}>Status: {item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  filtros: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  filtroBotao: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  filtroAtivo: {
    backgroundColor: "#000000",
  },
  filtroTexto: {
    fontSize: 14,
    color: "#555",
  },
  filtroTextoAtivo: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tipo: {
    fontSize: 14,
    color: "#007bff",
  },
  valor: {
    fontSize: 14,
    marginTop: 4,
  },
});


const details = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffffff', padding: 20,paddingTop: 10, },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  valor: { fontSize: 16 },
  estrelasContainer: { flexDirection: 'row', marginTop: 10 },
  estrela: { fontSize: 32, color: '#ccc', marginHorizontal: 4 },
  estrelaAtiva: { color: '#000000ff' }, // amarelo
  acoesContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, alignItems: 'center', },
  acaoBotao: { alignItems: 'center'},
  acaoTexto: { marginTop: 5, fontSize: 14,color: '#333'},
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
});

const presencialLista = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 15,
  },
  cell: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2, // para Android (sombra leve)
    shadowColor: '#000', // para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
  },
});