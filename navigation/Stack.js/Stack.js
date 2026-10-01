import { createStackNavigator } from "@react-navigation/stack";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DetalleScreen from "../../screens/carpeta1/Detalles"; 
import ProductosScreen from "../../screens/carpeta1/Lista";

const Stack = createStackNavigator();

export default function ProductosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#ffe600", // Amarillo Mercado Libre
          elevation: 1,
          shadowOpacity: 0.1,
        },
        headerTintColor: "#2b2d42",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="ProductosLista"
        component={ProductosScreen}
        options={({ navigation }) => ({
          title: "Productos de Fútbol",
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="menu" size={28} color="#2b2d42" />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Detalle"
        component={DetalleScreen}
        options={{
          title: "Detalle del Producto",
          headerBackTitle: "Atrás",
        }}
      />
    </Stack.Navigator>
  );
}