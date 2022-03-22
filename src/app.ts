import cors from 'cors';
import express, { Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import morgan from 'morgan';

import NodeController from './controllers/NodeController';
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

router.get('', (req: Request, res: Response) => res.json(listEndpoints(app)));

NodeController.createNodesTable();
