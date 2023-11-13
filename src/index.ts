import express from 'express';
import {readData} from './service/service'

import dotenv from 'dotenv';
dotenv.config();

const port: number | undefined = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 4321;

const app = express();
app.use(express.json());

app.get('/', async (_req, res) => {

  try {
    const result = await readData();
    res.json(result); // Assuming BoilerData is JSON-serializable
  } catch (error) {
    console.error("Error reading data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port + 1}`);
});
