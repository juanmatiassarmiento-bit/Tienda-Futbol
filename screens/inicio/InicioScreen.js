import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

function CategoriaItem({ icono, titulo, colorFondo, colorIcono, onPress }) {
  const animEscala = useRef(new Animated.Value(1)).current;

  const presionarIn = () => {
    Animated.spring(animEscala, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 25,
      bounciness: 4,
    }).start();
  };

  const presionarOut = () => {
    Animated.spring(animEscala, {
      toValue: 1,
      useNativeDriver: true,
      speed: 15,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: animEscala }], width: "23%" }}>
      <Pressable
        style={estilos.categoriaItem}
        onPressIn={presionarIn}
        onPressOut={presionarOut}
        onPress={onPress}
      >
        <View style={[estilos.iconoCat, { backgroundColor: colorFondo }]}>
          <Ionicons name={icono} size={26} color={colorIcono} />
        </View>
        <Text style={estilos.categoriaTexto}>{titulo}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const animFade = useRef(new Animated.Value(0)).current;
  const animSlide = useRef(new Animated.Value(18)).current;
  const animBoton = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(animSlide, {
        toValue: 0,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animFade, animSlide]);

  const presionarBotonIn = () => {
    Animated.spring(animBoton, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const presionarBotonOut = () => {
    Animated.spring(animBoton, {
      toValue: 1,
      useNativeDriver: true,
      speed: 15,
      bounciness: 5,
    }).start();
  };

  const navegarConFiltro = (filtro) => {
    navigation.navigate("Productos", {
      screen: "ProductosLista",
      params: { categoriaFiltro: filtro },
    });
  };

  return (
    <ScrollView style={estilos.pantalla} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={{
          opacity: animFade,
          transform: [{ translateY: animSlide }],
        }}
      >
        {/* Banner Superior Estilo Tienda */}
        <View style={estilos.bannerHeader}>
          <View style={estilos.circuloIcono}>
            <Ionicons name="football" size={38} color="#ffe600" />
          </View>
          <Text style={estilos.bannerTitulo}>FÚTBOL STORE</Text>
          <Text style={estilos.bannerSubtitulo}>
            Indumentaria, pelotas, botines y accesorios oficiales
          </Text>
        </View>

        {/* Promoción estilo Mercado Libre */}
        <View style={estilos.promoCard}>
          <View style={estilos.promoTag}>
            <Text style={estilos.promoTagTexto}>OFERTAS DE LA SEMANA</Text>
          </View>
          <Text style={estilos.promoTitulo}>¡Hasta 25% OFF y cuotas fijas!</Text>
          <Text style={estilos.promoTexto}>
            En indumentaria de selecciones, pelotas de partido y botines de alta gama.
          </Text>
        </View>

        {/* Categorías Rápidas que filtran en la barra de búsqueda al hacer clic */}
        <Text style={estilos.seccionTitulo}>Categorías Destacadas</Text>
        <View style={estilos.categoriasGrid}>
          <CategoriaItem
            icono="shirt-outline"
            titulo="Camisetas"
            colorFondo="#e3f2fd"
            colorIcono="#1976d2"
            onPress={() => navegarConFiltro("Camiseta")}
          />
          <CategoriaItem
            icono="football-outline"
            titulo="Pelotas"
            colorFondo="#e8f5e9"
            colorIcono="#388e3c"
            onPress={() => navegarConFiltro("Pelota")}
          />
          <CategoriaItem
            icono="flash-outline"
            titulo="Botines"
            colorFondo="#fff3e0"
            colorIcono="#f57c00"
            onPress={() => navegarConFiltro("Botines")}
          />
          <CategoriaItem
            icono="shield-outline"
            titulo="Accesorios"
            colorFondo="#f3e5f5"
            colorIcono="#7b1fa2"
            onPress={() => navegarConFiltro("Guantes")}
          />
        </View>

        {/* Botón Principal para ir a ver catálogo completo */}
        <View style={estilos.contenedorBoton}>
          <Animated.View style={{ transform: [{ scale: animBoton }] }}>
            <Pressable
              style={estilos.botonPrincipal}
              onPressIn={presionarBotonIn}
              onPressOut={presionarBotonOut}
              onPress={() => navegarConFiltro("")}
            >
              <Text style={estilos.botonPrincipalTexto}>
                Explorar Catálogo de Fútbol
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#2b2d42" />
            </Pressable>
          </Animated.View>
        </View>

        {/* Ventajas de compra */}
        <View style={estilos.ventajasContainer}>
          <View style={estilos.ventajaItem}>
            <Ionicons name="cube-outline" size={20} color="#00a650" />
            <Text style={estilos.ventajaTexto}>
              Envíos gratis en productos seleccionados
            </Text>
          </View>
          <View style={estilos.ventajaItem}>
            <Ionicons name="card-outline" size={20} color="#3483fa" />
            <Text style={estilos.ventajaTexto}>
              Pagá en cuotas con todas las tarjetas
            </Text>
          </View>
          <View style={estilos.ventajaItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#00a650" />
            <Text style={estilos.ventajaTexto}>
              Productos 100% originales garantizados
            </Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#ebebeb",
  },
  bannerHeader: {
    backgroundColor: "#ffe600",
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  circuloIcono: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2b2d42",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 4,
  },
  bannerTitulo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2b2d42",
    letterSpacing: 1,
  },
  bannerSubtitulo: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
    textAlign: "center",
  },
  promoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -14,
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  promoTag: {
    backgroundColor: "#ff5252",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  promoTagTexto: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  promoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  promoTexto: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    lineHeight: 18,
  },
  seccionTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  categoriasGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  categoriaItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  iconoCat: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  categoriaTexto: {
    fontSize: 11,
    fontWeight: "600",
    color: "#444",
  },
  contenedorBoton: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  botonPrincipal: {
    backgroundColor: "#ffe600",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  botonPrincipalTexto: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2b2d42",
    marginRight: 8,
  },
  ventajasContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  ventajaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  ventajaTexto: {
    fontSize: 13,
    color: "#444",
    marginLeft: 10,
    flex: 1,
  },
});