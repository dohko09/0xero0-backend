import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import auth from "./src/routes/auth.route.js";
import parking_place from "./src/routes/parking_place.route.js";
import parking from "./src/routes/parking.route.js";
import user from "./src/routes/user.route.js";
import metrics from "./src/routes/metrics.route.js";

const app = express();
const routeBase = "/api/v1";
const port = process.env.PORT || 3000;

// Configuración CORS
const corsOptions = {
  origin: "*", // Reemplaza con el dominio permitido
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.json({ limit: "20mb" }));
app.use(express.static("public"));

// Rutas
app.use(`${routeBase}/auth`, auth);
app.use(`${routeBase}/parking_place`, parking_place);
app.use(`${routeBase}/parking`, parking);
app.use(`${routeBase}/users`, user);
app.use(`${routeBase}/metrics`, metrics);


app.listen(port, () => {
  console.log(`Servidor iniciado exitosamente en el puerto ${port}`);
});
