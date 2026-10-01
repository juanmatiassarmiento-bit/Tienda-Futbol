import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MainTab from "./MainTab";

const Drawer = createDrawerNavigator();

// Componente para personalizar el interior del Drawer
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Cabecera del Drawer con estilo Mercado Libre */}
      <View style={estilos.drawerHeader}>
        <View style={estilos.avatarContainer}>
          <Ionicons name="football" size={30} color="#2b2d42" />
        </View>
        <Text style={estilos.drawerTitle}>Tienda Fútbol</Text>
        <Text style={estilos.drawerSubtitle}>Hola, Fanático del Fútbol</Text>
      </View>

      {/* Botones de navegación hacia los Tabs */}
      <View style={estilos.menuSection}>
        <DrawerItem
          label="Inicio"
          icon={({ color, size }) => (
            <Ionicons name="home-outline" size={size} color="#2b2d42" />
          )}
          labelStyle={estilos.labelStyle}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate("MainTabs", { screen: "Inicio" });
          }}
        />

        <DrawerItem
          label="Catálogo de Fútbol"
          icon={({ color, size }) => (
            <Ionicons name="shirt-outline" size={size} color="#2b2d42" />
          )}
          labelStyle={estilos.labelStyle}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate("MainTabs", { screen: "Productos" });
          }}
        />

        <DrawerItem
          label="Mi Cuenta"
          icon={({ color, size }) => (
            <Ionicons name="person-outline" size={size} color="#2b2d42" />
          )}
          labelStyle={estilos.labelStyle}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate("MainTabs", { screen: "Perfil" });
          }}
        />
      </View>

      <View style={estilos.footerDrawer}>
        <Text style={estilos.footerTexto}>Mercado Fútbol v2.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#ffffff",
            width: 280,
          },
        }}
      >
        <Drawer.Screen name="MainTabs" component={MainTab} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  drawerHeader: {
    backgroundColor: "#ffe600",
    padding: 24,
    paddingTop: 45,
    marginBottom: 10,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  drawerTitle: {
    color: "#2b2d42",
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerSubtitle: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },
  menuSection: {
    paddingHorizontal: 8,
    paddingTop: 10,
    flex: 1,
  },
  labelStyle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2b2d42",
    marginLeft: -10,
  },
  footerDrawer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerTexto: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
});