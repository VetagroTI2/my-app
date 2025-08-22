import { View, Text, StyleSheet } from "react-native"
import { Link } from "expo-router"
export default function HomeScream() {
    return (
        <View style={styles.container}>
            <Text>Hello World!</Text>
            <Link href={"/details"}>Ver detalhes</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});