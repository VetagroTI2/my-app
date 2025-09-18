import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { getAllDocs } from "../firebase/crud";

export default function Map({ setOpcao }) {
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
      const data = await getAllDocs();
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
        {/* Marcador fixo de teste */}
        <Marker
          coordinate={{ latitude: -3.764301, longitude: -38.486617 }}
          onPress={() => setModalVisible(true)}
        />

        {/* Marcadores vindos do Firestore */}
        {ongs.map((ong) => (
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
        ))}
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {ongSelecionada?.nome || "Nome da ONG"}
            </Text>
            <Text>
              {ongSelecionada?.descricao ||
                "Informações detalhadas sobre a ONG aqui..."}
            </Text>

            <TouchableOpacity
              style={styles.QueroDoarButton}
              onPress={() => setOpcao("Doar")}
            >
              <Text style={styles.QueroDoarText}>Quero Doar!</Text>
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
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
});
