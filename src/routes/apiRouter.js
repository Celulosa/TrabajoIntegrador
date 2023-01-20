const express = require("express");
const router = express.Router();

const controller = require("../controllers/apiController");

//*** CARRITO Y ORDENES ***/
router.get("/product/:id", controller.product);
router.post("/checkout",controller.checkout);

//*** TOTAL VENTAS Y ORDENES  ***/
router.get("/totalventas",controller.totalVentas);
router.get("/totalordenes",controller.totalOrdenes);
router.get("/ordenespormes",controller.ordenesPorMes);
router.get("/ventaspormes",controller.ventasPorMes);
router.get("/ventaspordia",controller.ventasPorDia);

//*** USUARIOS REGISTRADOS POR MES Y TOTAL ***/
router.get("/usuariospormes",controller.usuariosPorMes);
router.get("/totalusuarios",controller.totalUsuarios);

//*** PRODUCTOS MAS Y MENOS VENDIDOS ***/
router.get("/productomasvendido",controller.productoMasVendido);
router.get("/productomasvendidopormes",controller.productoMasVendidoPorMes);
router.get("/totalproductos",controller.totalProductos);


module.exports = router;
