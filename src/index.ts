import express from 'express';
import cors from 'cors';

import path from 'path';
import morgan from 'morgan';

const port = process.env.PORT || 3000;
const app = express();

app
  .use('/static', express.static(path.resolve(__dirname, 'public')))
  .use(cors())
  .use(morgan('dev'));

const server = app.listen(port, () => {
  console.log('Server run at ' + port);
});
