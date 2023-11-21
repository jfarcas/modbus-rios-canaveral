"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = require("./service/service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const modbusUrl = process.env.PLC_ADDRESS ? process.env.PLC_ADDRESS : 'localhost:4321';
const modbusPort = process.env.PLC_PORT ? parseInt(process.env.PLC_PORT, 10) : 502;
const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 4321;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', async (_req, res) => {
    try {
        const result = await (0, service_1.readData)(modbusUrl, modbusPort);
        res.json(result); // Assuming BoilerData is JSON-serializable
    }
    catch (error) {
        // save data to ekl error read modbus data
        // todo si no se puede leer devolver otro mensaje diferente, no devolver 500
        console.error("Error reading data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
