import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/routes.mjs';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});