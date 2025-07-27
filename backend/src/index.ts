import express from 'express';
import cors from 'cors';
import { doSQL } from "@freckleface/golembase-tables";

const app = express();
const port = 3000;

app.use(express.text());

const corsOptions = {
  origin: 'http://localhost:4200' 
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello from Golem-base!');
});

// Pre-load sample data
app.post('/api/dosql', async (req, res) => {
	console.log(req.body);
    const result: any = await doSQL("GOLEM-SQLTEST-v0.2", req.body)
	console.log('RESULT:');
	console.log(result);
    res.send(result);
});


// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

