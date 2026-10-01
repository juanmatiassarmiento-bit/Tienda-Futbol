import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/inicio/InicioScreen";
import ProductosStack from "./Stack.js/Stack";

const Tab = createBottomTabNavigator();

function PerfilScreen() {
  return (
    <View style={estilos.pantalla}>
      <View style={estilos.avatarContenedor}>
        <Ionicons name="person" size={54} color="#ffe600" />
      </View>
      <Text style={estilos.titulo}>Mi Perfil</Text>
      <Text style={estilos.subtitulo}>Nivel 6 - Mercado Puntos</Text>
      <View style={estilos.tarjetaPuntos}>
        <Ionicons name="football" size={24} color="#2b2d42" />
        <Text style={estilos.puntosTexto}>2.450 Puntos de Fútbol acumulados</Text>
      </View>
    </View>
  );
}

export default function MainTab({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: "#2b2d42",
        tabBarInactiveTintColor: "#737373",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e5e5e5",
          elevation: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
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
        // Botón hamburguesa para abrir el menú Drawer
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="menu" size={28} color="#2b2d42" />
          </Pressable>
        ),
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarLabel: "Inicio",
          headerTitle: "Fútbol Libre",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={focused ? "#3483fa" : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Productos"
        component={ProductosStack}
        options={{
          tabBarLabel: "Productos",
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "shirt" : "shirt-outline"}
              size={size}
              color={focused ? "#3483fa" : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: "Mi Cuenta",
          headerTitle: "Mi Cuenta",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={focused ? "#3483fa" : color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ebebeb",
    padding: 20,
  },
  avatarContenedor: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2b2d42",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2b2d42",
  },
  subtitulo: {
    fontSize: 14,
    color: "#00a650",
    fontWeight: "600",
    marginTop: 4,
  },
  tarjetaPuntos: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 24,
    elevation: 2,
  },
  puntosTexto: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginLeft: 10,
  },
});