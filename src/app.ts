import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import router from './routes/nodeRoutes';

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server run at ${port}`);
});
