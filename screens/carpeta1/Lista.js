import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  FlatList,
  Animated,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { productosEjemplo } from "../../data/data";

function ProductoItem({ item, navigation, index }) {
  const animFade = useRef(new Animated.Value(0)).current;
  const animSlide = useRef(new Animated.Value(24)).current;
  const animScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animFade, {
        toValue: 1,
        duration: 400,
        delay: index * 70,
        useNativeDriver: true,
      }),
      Animated.spring(animSlide, {
        toValue: 0,
        tension: 45,
        friction: 7,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animFade, animSlide, index]);

  const handlePressIn = () => {
    Animated.spring(animScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 15,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: animFade,
        transform: [{ translateY: animSlide }, { scale: animScale }],
      }}
    >
      <Pressable
        style={estilos.tarjeta}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate("Detalle", { producto: item })}
      >
        <View style={estilos.contenedorImagen}>
          <Image
            source={{ uri: item.imagen }}
            style={estilos.imagen}
            resizeMode="cover"
          />
          {item.full && (
            <View style={estilos.badgeFull}>
              <Ionicons name="flash" size={10} color="#00a650" />
              <Text style={estilos.badgeFullTexto}>FULL</Text>
            </View>
          )}
        </View>

        <View style={estilos.infoContainer}>
          <Text style={estilos.nombreProducto} numberOfLines={2}>
            {item.nombre}
          </Text>

          {item.precioOriginal && (
            <Text style={estilos.precioOriginal}>
              ${item.precioOriginal.toLocaleString()}
            </Text>
          )}

          <View style={estilos.filaPrecio}>
            <Text style={estilos.precio}>
              ${item.precio.toLocaleString()}
            </Text>
            {item.descuento && (
              <Text style={estilos.descuento}>{item.descuento}</Text>
            )}
          </View>

          {item.cuotas && (
            <Text style={estilos.cuotas}>{item.cuotas}</Text>
          )}

          {item.envioGratis ? (
            <Text style={estilos.envioGratis}>Envío gratis</Text>
          ) : (
            <Text style={estilos.envioNormal}>Envío con normalidad</Text>
          )}

          <View style={estilos.ratingFila}>
            <Ionicons name="star" size={13} color="#3483fa" />
            <Text style={estilos.ratingTexto}>{item.calificacion}</Text>
            <Text style={estilos.opinionesTexto}>({item.opiniones})</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function ProductosScreen({ route, navigation }) {
  const [textoBusqueda, setTextoBusqueda] = useState(
    route.params?.categoriaFiltro || ""
  );

  useEffect(() => {
    if (route.params?.categoriaFiltro !== undefined) {
      setTextoBusqueda(route.params.categoriaFiltro);
    }
  }, [route.params?.categoriaFiltro]);

  // Filtrado reactivo en tiempo real por nombre, descripción o características
  const productosFiltrados = productosEjemplo.filter((p) => {
    if (!textoBusqueda.trim()) return true;
    const busq = textoBusqueda.toLowerCase().trim();
    const coincideNombre = p.nombre.toLowerCase().includes(busq);
    const coincideDesc = p.descripcion.toLowerCase().includes(busq);
    return coincideNombre || coincideDesc;
  });

  return (
    <View style={estilos.pantalla}>
      {/* Barra de búsqueda interactiva y funcional */}
      <View style={estilos.barraBusqueda}>
        <Ionicons
          name="search"
          size={18}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={estilos.inputBusqueda}
          placeholder="Buscar camisetas, botines, pelotas..."
          placeholderTextColor="#999"
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {textoBusqueda.length > 0 && (
          <Pressable
            style={estilos.botonLimpiar}
            onPress={() => setTextoBusqueda("")}
          >
            <Ionicons name="close-circle" size={18} color="#999" />
          </Pressable>
        )}
      </View>

      {/* Contador de resultados */}
      <View style={estilos.filaResultados}>
        <Text style={estilos.textoResultados}>
          {productosFiltrados.length === 1
            ? "1 producto encontrado"
            : `${productosFiltrados.length} productos encontrados`}
          {textoBusqueda.trim() ? ` para "${textoBusqueda}"` : ""}
        </Text>
      </View>

      {/* Lista de productos filtrados */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ProductoItem item={item} navigation={navigation} index={index} />
        )}
        contentContainerStyle={estilos.listaContenido}
        ItemSeparatorComponent={() => <View style={estilos.separador} />}
        ListEmptyComponent={() => (
          <View style={estilos.vacioContainer}>
            <Ionicons name="football-outline" size={54} color="#bbb" />
            <Text style={estilos.vacioTitulo}>No encontramos coincidencias</Text>
            <Text style={estilos.vacioSubtitulo}>
              Intentá buscar con otras palabras como "Messi", "Pelota", "Botines" o "Canilleras".
            </Text>
            <Pressable
              style={estilos.botonReset}
              onPress={() => setTextoBusqueda("")}
            >
              <Text style={estilos.botonResetTexto}>Ver todos los productos</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#ebebeb",
  },
  barraBusqueda: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 22,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  inputBusqueda: {
    flex: 1,
    fontSize: 14,
    color: "#2b2d42",
    paddingVertical: 2,
  },
  botonLimpiar: {
    padding: 4,
  },
  filaResultados: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  textoResultados: {
    fontSize: 12,
    color: "#777",
    fontWeight: "500",
  },
  listaContenido: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  tarjeta: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contenedorImagen: {
    width: 120,
    height: 120,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  imagen: {
    width: "100%",
    height: "100%",
  },
  badgeFull: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeFullTexto: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#00a650",
    fontStyle: "italic",
    marginLeft: 2,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  nombreProducto: {
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
    marginBottom: 4,
  },
  precioOriginal: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  filaPrecio: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  precio: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  descuento: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00a650",
    marginLeft: 8,
  },
  cuotas: {
    fontSize: 12,
    color: "#00a650",
    fontWeight: "500",
    marginBottom: 4,
  },
  envioGratis: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#00a650",
    marginBottom: 4,
  },
  envioNormal: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  ratingFila: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingTexto: {
    fontSize: 12,
    color: "#3483fa",
    fontWeight: "bold",
    marginLeft: 3,
  },
  opinionesTexto: {
    fontSize: 11,
    color: "#999",
    marginLeft: 3,
  },
  separador: {
    height: 10,
  },
  vacioContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  vacioTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#444",
    marginTop: 12,
  },
  vacioSubtitulo: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  botonReset: {
    backgroundColor: "#3483fa",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 18,
  },
  botonResetTexto: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});