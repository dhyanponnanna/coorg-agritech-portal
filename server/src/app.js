import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";

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

export default app;