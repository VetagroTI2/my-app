import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { getAllDocs } from "../firebase/crud";
import { useAuth } from "../context/authContext.jsx";

export default function Doacoes() {
  const { user } = useAuth()
  const [filtro, setFiltro] = useState("Todos")
  const [doacoes, setDoacoes] = useState([])
  const [carregando, setCarregando] = useState(true)

  const [telaDetalhe, setTelaDetalhe] = useState(false);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

  const [avaliacao, setAvaliacao] = useState(0)
  const estrelas = [1, 2, 3, 4, 5]

  const filtros = ["Todos", "Fornecedor", "Delivery", "Transferencia", "Presencial"];

  useEffect(() => {
    async function carregar() {
      if (!user?.uid) return null
      setCarregando(true)
      try {
        const subcolecoes = ["transferencia", "presencial", "delivery", "fornecedor"]

        const resultados = await Promise.all(
          subcolecoes.map(async (nome) => {
            const data = await getAllDocs(`doador/${user.uid}/${nome}`)
            return data
          })
        )
        const todas = resultados.flat()
        setDoacoes(todas)
      } catch (error) {
        console.log("Erro ao carregar doações:", error)
      } finally {
        setCarregando(false)
      }
    }
    carregar();
  }, [user]);

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

    return listaFiltrada;
  };

  if (telaDetalhe && doacaoSelecionada) {
    return (
      <View style={details.container}>
        <View style={details.acoesContainer}>
          <TouchableOpacity style={details.acaoBotao}>
            {/* <Icon name="report" size={24} color="#d9534f" /> */}
            <Text style={details.acaoTexto}>Suporte</Text>
          </TouchableOpacity>

          <TouchableOpacity style={details.acaoBotao}>
            {/*<Icon name="contact-mail" size={24} color="#0275d8" />*/}
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
          {estrelas.map((estrela) => (
            <TouchableOpacity key={estrela} onPress={() => setAvaliacao(estrela)}>
              <Text style={[details.estrela, estrela <= avaliacao && details.estrelaAtiva]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[details.label, { marginTop: 20 }]}>Descrição:</Text>
        <ScrollView>
          {(() =>{ switch (doacaoSelecionada.tipo) {
            case "Fornecedor":
              let dataFormatada = doacaoSelecionada.data_registro?.toDate
                ? doacaoSelecionada.data_registro.toDate().toLocaleDateString('pt-BR')
                : 'Data inválida';

              return (
                <View style={details.container}>
                  <Text style={details.texto}>🏢 Empresa: {doacaoSelecionada.empresa}</Text>
                  <Text style={details.texto}>📅 Data do Registro: {dataFormatada}</Text>
                  <Text style={details.texto}>📦 Número do Pedido: {doacaoSelecionada.pedido}</Text>
                  <Text style={details.texto}>📌 Situação: {doacaoSelecionada.situacao}</Text>
                </View>
              );
            case "Delivery":
              let dataFormatoda = doacaoSelecionada.data_registro?.toDate
                ? doacaoSelecionada.data_registro.toDate().toLocaleDateString('pt-BR')
                : 'Data inválida';

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
            case "Transferencia":
              let valorOriginal = parseFloat(doacaoSelecionada.valor);
              let taxa = 0.013;
              let valorComTaxa = (valorOriginal * (1 + taxa)).toFixed(2);

              let dataRegistro = doacaoSelecionada.data_registro?.toDate
                ? doacaoSelecionada.data_registro.toDate().toLocaleDateString('pt-BR')
                : 'Data inválida';

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
            case "Presencial":
              return (
              <View style={presencialLista.container}>
                {doacaoSelecionada.itens.map((item, index) => {
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
            default:
              return null;
          }})()}
        </ScrollView>
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
        {filtros.map((item) => (
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
      </View>

      {carregando ? (
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filtrarDoacoes()}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setTelaDetalhe(true) || setDoacaoSelecionada(item)}>
              <View style={styles.card}>
                <Text style={styles.nome}>{item.nome}</Text>
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