import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
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
      <View style={styles.container}>
        <Text style={details.titulo}>Detalhes da Doação</Text>

        <Text style={details.label}>Nome:</Text>
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
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  valor: { fontSize: 16 },
  estrelasContainer: { flexDirection: 'row', marginTop: 10 },
  estrela: { fontSize: 32, color: '#ccc', marginHorizontal: 4 },
  estrelaAtiva: { color: '#FFD700' }, // amarelo
});