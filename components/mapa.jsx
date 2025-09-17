import { StyleSheet, View, Dimensions, Modal, Text, TouchableOpacity  } from "react-native";
import { useState, useEffect } from 'react'
import MapView, { Marker  } from "react-native-maps";
import { getAllDocs } from "../firebase/crud";

export default function Map({ setOpcao }) {
  // Região inicial do mapa (Fortaleza - CE)
  const initialRegion = {
    latitude: -3.71722,
    longitude: -38.54306,
    latitudeDelta: 0.2,   // zoom vertical
    longitudeDelta: 0.2,  // zoom horizontal
  };

  const [region, setRegion] = useState(initialRegion);
  const [modalVisible, setModalVisible] = useState(false);

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
    })
  }

  const [ongs, setOngs] = useState([]);
  const [ongSelecionada, setOngSelecionada] = useState(null);

  useEffect(() => {
    async function carregar() {
      const data = await getAllDocs(); // retorna todos os docs da coleção
      setOngs(data);
    }
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={handleRegionChange}
        >
          <Marker
            coordinate={{ latitude: -3.764301, longitude: -38.486617 }}
            onPress={() => setModalVisible(true)}
          />
          {ongs.map((ong) =>
            <Marker
              key={ong.id}
              coordinate={{latitude:  ong.geoloc.latitude, longitude: ong.geoloc.longitude}}
              onPress={() => setModalVisible(true)}
            />
          )}
        </MapView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nome da ONG</Text>
            <Text>Informações detalhadas sobre a ONG aqui...</Text>
            <TouchableOpacity style={styles.QueroDoarButton} onPress={() => setOpcao("Doar")}>
              <Text style={styles.QueroDoarText}>Quero Doar!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  mapWrapper: {
    width: "100%",
    height: height * 0.82, // 60% da altura da tela
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
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
