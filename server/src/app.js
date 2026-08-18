import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import geocodingRoutes from "./routes/geocoding.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", routes);

app.get("/", (req, res) => {
    res.json({
        message: "Coorg Agri-Tech API is running succesfully"
    });
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/geocoding", geocodingRoutes);

app.use(errorHandler);

export default app;