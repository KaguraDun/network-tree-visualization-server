import { Request, Response } from 'express';

import db from '../db/connectDB';

class NodeController {

  static async addNode(req: Request, res: Response) {
    try {
      const { parentID, name, ip, port } = req.body;

      await db.query(
        'INSERT INTO nodes (parentID, name, ip, port) VALUES ($1, $2, $3, $4)',
        [parentID, name, ip, port]
      );

      res.status(201).send({ message: 'Node created' });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ message: error });
}

export default NodeController;