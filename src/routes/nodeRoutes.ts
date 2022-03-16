import express from 'express';

import NodeController from '../controllers/NodeController';

const router = express.Router();

router.post('/node', NodeController.addNode);
export default router;
