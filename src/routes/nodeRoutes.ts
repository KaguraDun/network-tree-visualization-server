import express from 'express';

import NodeController from '../controllers/NodeController';

const router = express.Router();

router.get('/node', NodeController.getRootNode);
router.get('/node/:id/children', NodeController.getChildNodes);

router.post('/node', NodeController.addNode);

router.delete('/node/:id', NodeController.removeNode);

router.put('/node/:id/change_name', NodeController.changeNodeName);
router.put('/node/:id/change_ip', NodeController.changeNodeIP);
router.put('/node/:id/change_port', NodeController.changeNodePort);

export default router;
