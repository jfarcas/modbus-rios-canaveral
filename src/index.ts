import express from 'express';
import {readData} from './service/service'

const app = express();
app.use(express.json());
const port  = 3000;
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
