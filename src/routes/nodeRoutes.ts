import express from 'express';

import NodeController from '../controllers/NodeController';

const router = express.Router();

router.get('/node', NodeController.getRootNode);
router.post('/node', NodeController.addNode);
export default router;
