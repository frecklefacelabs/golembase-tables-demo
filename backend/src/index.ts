import express from 'express';
import cors from 'cors';
import { doSQL } from "@freckleface/golembase-tables";

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:4200' 
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello from Golem-base!');
});

// Pre-load sample data
app.get('/dosql', async (req, res) => {
    const result: any = await doSQL("GOLEM-SQLTEST-v0.2", req.body)
    res.send(result);
});


// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

