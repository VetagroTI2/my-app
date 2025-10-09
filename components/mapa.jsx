import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { getAllDocs } from "../firebase/crud";

export default function Map({ setOpcao, setEntidade }) {
  const initialRegion = {
    latitude: -3.71722,
    longitude: -38.54306,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  const [region, setRegion] = useState(initialRegion);
  const [modalVisible, setModalVisible] = useState(false);

  const [ongs, setOngs] = useState([]);
  const [ongSelecionada, setOngSelecionada] = useState(null);

  const LAT_MIN = -3.9;
  const LAT_MAX = -3.5;
  const LON_MIN = -38.7;
  const LON_MAX = -38.3;

  const handleRegionChange = (newRegion) => {
    let latitude = Math.min(Math.max(newRegion.latitude, LAT_MIN), LAT_MAX);
    let longitude = Math.min(Math.max(newRegion.longitude, LON_MIN), LON_MAX);

    setRegion({
      ...newRegion,
      latitude,
      longitude,
    });
  };

  useEffect(() => {
    async function carregar() {
      const data = await getAllDocs("entidade");
      setOngs(data);
    }
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
      >
        {ongs.map((ong) => {
          if (ong.geoloc && ong.geoloc.latitude != null && ong.geoloc.longitude != null) {
            return (
              <Marker
                key={ong.id}
                coordinate={{
                  latitude: ong.geoloc.latitude,
                  longitude: ong.geoloc.longitude,
                }}
                onPress={() => {
                  setOngSelecionada(ong);
                  setModalVisible(true);
                }}
              />
            );
          }
          return null; // não renderiza nada se não tiver coordenadas
        })}
      </MapView>
      {/* Modal de detalhes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{ongSelecionada?.rating || "0"} ★</Text>
            </View>
            <Text style={styles.modalTitle}>
              {ongSelecionada?.nome || "Nome da ONG"}
            </Text>
            <Text>
              {"Local: "+ongSelecionada?.endereco+", nº"+ongSelecionada?.numeroEnd+", "+ongSelecionada?.bairro+" - Fortaleza/CE"}
            </Text>
            <Text>
              {"Horário de Funcionamento: "+ongSelecionada?.horario}
            </Text>
            <Text>
              {"Tamanho/Porte: "+ongSelecionada?.tamanho}
            </Text>
            <Text>
              {"Doação/Contribuição: "+ongSelecionada?.doacao}
            </Text>
            <TouchableOpacity
              style={styles.QueroDoarButton}
              onPress={() => {setOpcao("Doar"); setEntidade(ongSelecionada);}}
            >
              <Text style={styles.QueroDoarText}>Quero Doar!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.QueroDoarButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.QueroDoarText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa todo o espaço disponível
  },
  map: {
    flex: 1, // faz o mapa se ajustar dinamicamente
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  QueroDoarButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#000000",
    borderRadius: 8,
    alignItems: "center",
  },
  QueroDoarText: {
    color: "white",
    fontWeight: "bold",
  },
  ratingContainer: {
  position: 'absolute',
  top: 10,
  right: 13,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
},
ratingText: {
  marginLeft: 4,
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
},
});
