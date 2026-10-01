import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { productosEjemplo } from "../../data/data";

export default function DetalleScreen({ route, navigation }) {
  const params = route.params || {};
  const producto =
    params.producto ||
    productosEjemplo.find((p) => p.id === params.id) ||
    productosEjemplo[0];

  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  // Estados de flujo: "compra", "carrito", "checkout", "exito"
  const [pasoModal, setPasoModal] = useState("compra");
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [cantidad, setCantidad] = useState(1);
  const [mensajeExito, setMensajeExito] = useState("");

  // Animaciones cálidas de entrada de pantalla
  const animFade = useRef(new Animated.Value(0)).current;
  const animSlide = useRef(new Animated.Value(20)).current;
  const animImgScale = useRef(new Animated.Value(0.92)).current;

  // Animaciones táctiles para los botones Pressable
  const animBtnComprar = useRef(new Animated.Value(1)).current;
  const animBtnCarrito = useRef(new Animated.Value(1)).current;
  const animBtnVolver = useRef(new Animated.Value(1)).current;

  // Animación del Modal (resorte cálido para emerger)
  const animModalScale = useRef(new Animated.Value(0.85)).current;
  const animModalFade = useRef(new Animated.Value(0)).current;

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
      Animated.spring(animImgScale, {
        toValue: 1,
        tension: 35,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animFade, animSlide, animImgScale]);

  const presionarBoton = (animRef, accion) => {
    Animated.sequence([
      Animated.timing(animRef, {
        toValue: 0.94,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(animRef, {
        toValue: 1,
        tension: 50,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (accion) accion();
    });
  };

  const animarEntradaModal = () => {
    animModalFade.setValue(0);
    animModalScale.setValue(0.9);

    Animated.parallel([
      Animated.timing(animModalFade, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(animModalScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const abrirModal = (tipo) => {
    setPasoModal(tipo);
    setCantidad(1);
    setModalVisible(true);
    animarEntradaModal();
  };

  const cambiarPasoModal = (nuevoPaso) => {
    setPasoModal(nuevoPaso);
    animarEntradaModal();
  };

  const cerrarModal = () => {
    Animated.timing(animModalFade, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const confirmarPagoFinal = () => {
    setMensajeExito(
      `¡Pago acreditado con éxito! Se procesó la orden de ${cantidad} unidad(es) de ${producto.nombre}.`
    );
    cambiarPasoModal("exito");
  };

  const precioTotal = (producto.precio * cantidad).toLocaleString();

  return (
    <ScrollView style={estilos.pantalla} showsVerticalScrollIndicator={false}>
      <Animated.View
        style={{
          opacity: animFade,
          transform: [{ translateY: animSlide }],
        }}
      >
        {/* Condición y ventas */}
        <View style={estilos.headerDetalle}>
          <Text style={estilos.condicion}>
            {producto.condicion || "Nuevo | +1mil vendidos"}
          </Text>
          <View style={estilos.ratingContenedor}>
            <Ionicons name="star" size={14} color="#3483fa" />
            <Text style={estilos.ratingTexto}>{producto.calificacion || "4.8"}</Text>
            <Text style={estilos.opinionesTexto}>
              ({producto.opiniones || 250})
            </Text>
          </View>
        </View>

        {/* Título */}
        <Text style={estilos.titulo}>{producto.nombre}</Text>

        {/* Imagen Principal con animación suave de apertura */}
        <Animated.View
          style={[
            estilos.contenedorImagen,
            { transform: [{ scale: animImgScale }] },
          ]}
        >
          <Image
            source={{ uri: producto.imagen }}
            style={estilos.imagen}
            resizeMode="contain"
          />
          {producto.full && (
            <View style={estilos.badgeFull}>
              <Ionicons name="flash" size={13} color="#00a650" />
              <Text style={estilos.badgeFullTexto}>FULL</Text>
            </View>
          )}
        </Animated.View>

        {/* Sección de Precio */}
        <View style={estilos.seccionPrecio}>
          {producto.precioOriginal && (
            <Text style={estilos.precioOriginal}>
              ${producto.precioOriginal.toLocaleString()}
            </Text>
          )}
          <View style={estilos.filaPrecioPrincipal}>
            <Text style={estilos.precio}>
              ${producto.precio.toLocaleString()}
            </Text>
            {producto.descuento && (
              <Text style={estilos.descuento}>{producto.descuento}</Text>
            )}
          </View>

          {producto.cuotas && (
            <Text style={estilos.cuotas}>{producto.cuotas}</Text>
          )}
        </View>

        {/* Envíos y Beneficios ML */}
        <View style={estilos.tarjetaBeneficios}>
          <View style={estilos.filaBeneficio}>
            <Ionicons name="car-outline" size={22} color="#00a650" />
            <View style={estilos.textoBeneficio}>
              <Text style={estilos.beneficioTitulo}>
                {producto.envioGratis
                  ? "Envío gratis a todo el país"
                  : "Envío a acordar con el vendedor"}
              </Text>
              <Text style={estilos.beneficioSubtitulo}>
                Conocé los tiempos y las formas de envío
              </Text>
            </View>
          </View>

          <View style={estilos.filaBeneficio}>
            <Ionicons name="return-down-back-outline" size={22} color="#00a650" />
            <View style={estilos.textoBeneficio}>
              <Text style={estilos.beneficioTitulo}>Devolución gratis</Text>
              <Text style={estilos.beneficioSubtitulo}>
                Tenés 30 días desde que lo recibís
              </Text>
            </View>
          </View>

          <View style={estilos.filaBeneficio}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#3483fa" />
            <View style={estilos.textoBeneficio}>
              <Text style={estilos.beneficioTitulo}>Compra Protegida</Text>
              <Text style={estilos.beneficioSubtitulo}>
                Recibí el producto que esperabas o te devolvemos tu dinero
              </Text>
            </View>
          </View>
        </View>

        {/* Stock disponible */}
        <View style={estilos.seccionStock}>
          <Text style={estilos.stockTitulo}>Stock disponible</Text>
          <Text style={estilos.stockCantidad}>
            Cantidad: <Text style={{ fontWeight: "bold" }}>1 unidad</Text> (
            {producto.stock || 10} disponibles)
          </Text>
        </View>

        {/* Botones de Acción con Pressable que disparan el Modal */}
        <View style={estilos.botonesContenedor}>
          <Animated.View style={{ transform: [{ scale: animBtnComprar }] }}>
            <Pressable
              style={estilos.botonComprar}
              onPress={() =>
                presionarBoton(animBtnComprar, () => abrirModal("compra"))
              }
            >
              <Text style={estilos.botonComprarTexto}>Comprar ahora</Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: animBtnCarrito }] }}>
            <Pressable
              style={estilos.botonCarrito}
              onPress={() =>
                presionarBoton(animBtnCarrito, () => abrirModal("carrito"))
              }
            >
              <Text style={estilos.botonCarritoTexto}>Agregar al carrito</Text>
            </Pressable>
          </Animated.View>
        </View>

        {/* Características del producto sin .map (usando FlatList) */}
        {producto.caracteristicas && producto.caracteristicas.length > 0 && (
          <View style={estilos.seccionDetalles}>
            <Text style={estilos.seccionTitulo}>Características principales</Text>
            <View style={estilos.tablaCaracteristicas}>
              <FlatList
                data={producto.caracteristicas}
                keyExtractor={(item, idx) => idx.toString()}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      estilos.filaCaracteristica,
                      index % 2 === 0 && { backgroundColor: "#f9f9f9" },
                    ]}
                  >
                    <Text style={estilos.caracteristicaClave}>{item.clave}</Text>
                    <Text style={estilos.caracteristicaValor}>{item.valor}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        )}

        {/* Descripción */}
        <View style={estilos.seccionDetalles}>
          <Text style={estilos.seccionTitulo}>Descripción</Text>
          <Text style={estilos.descripcionTexto}>
            {producto.descripcion || "Producto original de fútbol de primera calidad."}
          </Text>
        </View>

        {/* Botón Volver con Pressable y animación suave */}
        <Animated.View style={{ transform: [{ scale: animBtnVolver }] }}>
          <Pressable
            style={estilos.botonVolver}
            onPress={() =>
              presionarBoton(animBtnVolver, () => navigation.goBack())
            }
          >
            <Text style={estilos.botonVolverTexto}>← Volver a productos</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>

      {/* MODAL INTEGRAL ESTILO MERCADO LIBRE */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={cerrarModal}
      >
        <View style={estilos.modalOverlay}>
          <Animated.View
            style={[
              estilos.modalContenedor,
              {
                opacity: animModalFade,
                transform: [{ scale: animModalScale }],
              },
            ]}
          >
            {/* Header del modal */}
            <View style={estilos.modalHeader}>
              <View style={estilos.modalIconoContenedor}>
                <Ionicons
                  name={
                    pasoModal === "exito"
                      ? "checkmark-circle"
                      : pasoModal === "checkout"
                      ? "card"
                      : pasoModal === "carrito"
                      ? "cart"
                      : "bag-check"
                  }
                  size={30}
                  color={
                    pasoModal === "exito"
                      ? "#00a650"
                      : pasoModal === "checkout"
                      ? "#3483fa"
                      : pasoModal === "carrito"
                      ? "#3483fa"
                      : "#00a650"
                  }
                />
              </View>
              <Pressable style={estilos.modalBotonCerrar} onPress={cerrarModal}>
                <Ionicons name="close" size={24} color="#777" />
              </Pressable>
            </View>

            {/* CASO 1: AGREGADO AL CARRITO */}
            {pasoModal === "carrito" && (
              <View>
                <Text style={estilos.modalTitulo}>¡Agregado a tu carrito!</Text>
                <Text style={estilos.modalSubtitulo}>
                  Ya guardamos este artículo en tu compra:
                </Text>

                <View style={estilos.modalProductoCard}>
                  <Image
                    source={{ uri: producto.imagen }}
                    style={estilos.modalProductoImg}
                    resizeMode="cover"
                  />
                  <View style={estilos.modalProductoInfo}>
                    <Text style={estilos.modalProductoNombre} numberOfLines={2}>
                      {producto.nombre}
                    </Text>
                    <Text style={estilos.modalProductoPrecio}>
                      ${producto.precio.toLocaleString()}
                    </Text>
                    {producto.envioGratis && (
                      <Text style={estilos.modalEnvioGratis}>Envío gratis</Text>
                    )}
                  </View>
                </View>

                {/* Selector de cantidad */}
                <View style={estilos.modalFilaCantidad}>
                  <Text style={estilos.modalCantidadLabel}>Cantidad:</Text>
                  <View style={estilos.modalControlesCantidad}>
                    <Pressable
                      style={estilos.modalBtnCantidad}
                      onPress={() => setCantidad((prev) => Math.max(1, prev - 1))}
                    >
                      <Ionicons name="remove" size={18} color="#2b2d42" />
                    </Pressable>
                    <Text style={estilos.modalCantidadNumero}>{cantidad}</Text>
                    <Pressable
                      style={estilos.modalBtnCantidad}
                      onPress={() =>
                        setCantidad((prev) =>
                          Math.min(producto.stock || 10, prev + 1)
                        )
                      }
                    >
                      <Ionicons name="add" size={18} color="#2b2d42" />
                    </Pressable>
                  </View>
                </View>

                <View style={estilos.modalTotalFila}>
                  <Text style={estilos.modalTotalLabel}>Subtotal:</Text>
                  <Text style={estilos.modalTotalValor}>${precioTotal}</Text>
                </View>

                {/* Ir a pagar abre el Modal de Checkout */}
                <Pressable
                  style={estilos.modalBotonConfirmar}
                  onPress={() => cambiarPasoModal("checkout")}
                >
                  <Text style={estilos.modalBotonConfirmarTexto}>
                    Ir a pagar (${precioTotal})
                  </Text>
                </Pressable>

                <Pressable
                  style={estilos.modalBotonSecundario}
                  onPress={cerrarModal}
                >
                  <Text style={estilos.modalBotonSecundarioTexto}>
                    Seguir comprando
                  </Text>
                </Pressable>
              </View>
            )}

            {/* CASO 2: COMPRAR AHORA */}
            {pasoModal === "compra" && (
              <View>
                <Text style={estilos.modalTitulo}>Confirmar Pedido</Text>
                <Text style={estilos.modalSubtitulo}>
                  Revisá las unidades que querés comprar:
                </Text>

                <View style={estilos.modalProductoCard}>
                  <Image
                    source={{ uri: producto.imagen }}
                    style={estilos.modalProductoImg}
                    resizeMode="cover"
                  />
                  <View style={estilos.modalProductoInfo}>
                    <Text style={estilos.modalProductoNombre} numberOfLines={2}>
                      {producto.nombre}
                    </Text>
                    <Text style={estilos.modalProductoPrecio}>
                      ${producto.precio.toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Selector de cantidad */}
                <View style={estilos.modalFilaCantidad}>
                  <Text style={estilos.modalCantidadLabel}>Cantidad:</Text>
                  <View style={estilos.modalControlesCantidad}>
                    <Pressable
                      style={estilos.modalBtnCantidad}
                      onPress={() => setCantidad((prev) => Math.max(1, prev - 1))}
                    >
                      <Ionicons name="remove" size={18} color="#2b2d42" />
                    </Pressable>
                    <Text style={estilos.modalCantidadNumero}>{cantidad}</Text>
                    <Pressable
                      style={estilos.modalBtnCantidad}
                      onPress={() =>
                        setCantidad((prev) =>
                          Math.min(producto.stock || 10, prev + 1)
                        )
                      }
                    >
                      <Ionicons name="add" size={18} color="#2b2d42" />
                    </Pressable>
                  </View>
                </View>

                <View style={estilos.modalTotalFila}>
                  <Text style={estilos.modalTotalLabel}>Total:</Text>
                  <Text style={estilos.modalTotalValor}>${precioTotal}</Text>
                </View>

                <Pressable
                  style={estilos.modalBotonConfirmar}
                  onPress={() => cambiarPasoModal("checkout")}
                >
                  <Text style={estilos.modalBotonConfirmarTexto}>
                    Continuar al pago
                  </Text>
                </Pressable>

                <Pressable
                  style={estilos.modalBotonSecundario}
                  onPress={cerrarModal}
                >
                  <Text style={estilos.modalBotonSecundarioTexto}>Cancelar</Text>
                </Pressable>
              </View>
            )}

            {/* CASO 3: MODAL DE PAGO / CHECKOUT */}
            {pasoModal === "checkout" && (
              <View>
                <Text style={estilos.modalTitulo}>¿Cómo querés pagar?</Text>
                <Text style={estilos.modalSubtitulo}>
                  Total a pagar: <Text style={{ fontWeight: "bold", color: "#3483fa" }}>${precioTotal}</Text>
                </Text>

                <View style={estilos.opcionesPago}>
                  <Pressable
                    style={[
                      estilos.opcionPagoItem,
                      metodoPago === "tarjeta" && estilos.opcionPagoSeleccionada,
                    ]}
                    onPress={() => setMetodoPago("tarjeta")}
                  >
                    <Ionicons
                      name="card-outline"
                      size={22}
                      color={metodoPago === "tarjeta" ? "#3483fa" : "#555"}
                    />
                    <View style={estilos.opcionPagoTextoCont}>
                      <Text style={estilos.opcionPagoTitulo}>Tarjeta de crédito o débito</Text>
                      <Text style={estilos.opcionPagoDesc}>Hasta 6 cuotas fijas</Text>
                    </View>
                    <Ionicons
                      name={
                        metodoPago === "tarjeta"
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={20}
                      color={metodoPago === "tarjeta" ? "#3483fa" : "#aaa"}
                    />
                  </Pressable>

                  <Pressable
                    style={[
                      estilos.opcionPagoItem,
                      metodoPago === "mp" && estilos.opcionPagoSeleccionada,
                    ]}
                    onPress={() => setMetodoPago("mp")}
                  >
                    <Ionicons
                      name="wallet-outline"
                      size={22}
                      color={metodoPago === "mp" ? "#00a650" : "#555"}
                    />
                    <View style={estilos.opcionPagoTextoCont}>
                      <Text style={estilos.opcionPagoTitulo}>Mercado Pago</Text>
                      <Text style={estilos.opcionPagoDesc}>Dinero en cuenta disponible</Text>
                    </View>
                    <Ionicons
                      name={
                        metodoPago === "mp"
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={20}
                      color={metodoPago === "mp" ? "#00a650" : "#aaa"}
                    />
                  </Pressable>
                </View>

                <Pressable
                  style={[estilos.modalBotonConfirmar, { backgroundColor: "#00a650" }]}
                  onPress={confirmarPagoFinal}
                >
                  <Text style={estilos.modalBotonConfirmarTexto}>
                    Pagar ${precioTotal}
                  </Text>
                </Pressable>

                <Pressable
                  style={estilos.modalBotonSecundario}
                  onPress={() => cambiarPasoModal("carrito")}
                >
                  <Text style={estilos.modalBotonSecundarioTexto}>Volver atrás</Text>
                </Pressable>
              </View>
            )}

            {/* CASO 4: MODAL DE MENSAJE DE ÉXITO */}
            {pasoModal === "exito" && (
              <View style={{ alignItems: "center", paddingVertical: 10 }}>
                <View style={estilos.circuloExito}>
                  <Ionicons name="checkmark" size={42} color="#fff" />
                </View>
                <Text style={estilos.modalTitulo}>¡Operación exitosa!</Text>
                <Text style={estilos.modalMensajeExito}>{mensajeExito}</Text>
                <Text style={estilos.modalSubtituloExito}>
                  Te enviamos el comprobante y el código de seguimiento a tu e-mail.
                </Text>

                <Pressable
                  style={[estilos.modalBotonConfirmar, { width: "100%", marginTop: 14 }]}
                  onPress={cerrarModal}
                >
                  <Text style={estilos.modalBotonConfirmarTexto}>Entendido</Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  headerDetalle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 6,
  },
  condicion: {
    fontSize: 12,
    color: "#888",
  },
  ratingContenedor: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3483fa",
    marginLeft: 3,
  },
  opinionesTexto: {
    fontSize: 12,
    color: "#888",
    marginLeft: 3,
  },
  titulo: {
    fontSize: 19,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 14,
    lineHeight: 24,
  },
  contenedorImagen: {
    width: "100%",
    height: 320,
    backgroundColor: "#fcfcfc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  imagen: {
    width: "90%",
    height: "90%",
  },
  badgeFull: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  badgeFullTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#00a650",
    fontStyle: "italic",
    marginLeft: 3,
  },
  seccionPrecio: {
    marginTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  precioOriginal: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  filaPrecioPrincipal: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  precio: {
    fontSize: 32,
    fontWeight: "300",
    color: "#222",
  },
  descuento: {
    fontSize: 16,
    color: "#00a650",
    fontWeight: "600",
    marginLeft: 10,
  },
  cuotas: {
    fontSize: 14,
    color: "#00a650",
    fontWeight: "500",
    marginTop: 4,
  },
  tarjetaBeneficios: {
    marginVertical: 14,
    backgroundColor: "#fdfdfd",
  },
  filaBeneficio: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  textoBeneficio: {
    marginLeft: 12,
    flex: 1,
  },
  beneficioTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00a650",
  },
  beneficioSubtitulo: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  seccionStock: {
    marginVertical: 6,
  },
  stockTitulo: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },
  stockCantidad: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  botonesContenedor: {
    marginTop: 16,
    marginBottom: 20,
  },
  botonComprar: {
    backgroundColor: "#3483fa",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  botonComprarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botonCarrito: {
    backgroundColor: "rgba(65, 137, 230, 0.15)",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  botonCarritoTexto: {
    color: "#3483fa",
    fontSize: 16,
    fontWeight: "bold",
  },
  seccionDetalles: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  seccionTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
  },
  tablaCaracteristicas: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 6,
    overflow: "hidden",
  },
  filaCaracteristica: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  caracteristicaClave: {
    width: "45%",
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },
  caracteristicaValor: {
    flex: 1,
    fontSize: 13,
    color: "#222",
  },
  descripcionTexto: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  botonVolver: {
    marginVertical: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  botonVolverTexto: {
    color: "#3483fa",
    fontSize: 15,
    fontWeight: "600",
  },

  /* ESTILOS DEL MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContenedor: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalIconoContenedor: {
    padding: 4,
  },
  modalBotonCerrar: {
    padding: 6,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2b2d42",
    marginBottom: 4,
  },
  modalSubtitulo: {
    fontSize: 13,
    color: "#666",
    marginBottom: 16,
    lineHeight: 18,
  },
  modalProductoCard: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  modalProductoImg: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  modalProductoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  modalProductoNombre: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  modalProductoPrecio: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2b2d42",
    marginTop: 2,
  },
  modalEnvioGratis: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#00a650",
    marginTop: 2,
  },
  modalFilaCantidad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  modalCantidadLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  modalControlesCantidad: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  modalBtnCantidad: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  modalCantidadNumero: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2b2d42",
    minWidth: 24,
    textAlign: "center",
  },
  modalTotalFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2b2d42",
  },
  modalTotalValor: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3483fa",
  },
  modalBotonConfirmar: {
    backgroundColor: "#3483fa",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  modalBotonConfirmarTexto: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
  modalBotonSecundario: {
    paddingVertical: 10,
    alignItems: "center",
  },
  modalBotonSecundarioTexto: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },

  /* PASO CHECKOUT */
  opcionesPago: {
    marginBottom: 16,
  },
  opcionPagoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  opcionPagoSeleccionada: {
    borderColor: "#3483fa",
    backgroundColor: "#f0f7ff",
  },
  opcionPagoTextoCont: {
    flex: 1,
    marginLeft: 12,
  },
  opcionPagoTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2b2d42",
  },
  opcionPagoDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  /* PASO ÉXITO */
  circuloExito: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#00a650",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
  },
  modalMensajeExito: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    lineHeight: 20,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  modalSubtituloExito: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    marginBottom: 16,
  },
});