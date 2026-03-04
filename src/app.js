import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import errorHandler from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";
import "./models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan('dev'));

app.get("/", (_req, res) => {
    res.status(200).json({ message: "API Running Successfully" });
});

app.use("/api/v1", routes);


// Page Not Found   
app.use((_req, res) => {
    res
        .status(404)
        .sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

export default app;
