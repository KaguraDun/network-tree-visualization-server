import { Request, Response } from 'express';

import db from '../db/connectDB';

class NodeController {
  static async getRootNode(req: Request, res: Response) {
    try {
      const { rows: rootNode } = await db.query(
        'SELECT * from nodes where parentID IS NULL'
      );

      res.json(rootNode);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ message: error });
    }
  }

  static async getChildNodes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rows: children } = await db.query(
        'SELECT * from nodes where parentID = $1',
        [id]
      );

      res.json(children);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ message: error });
    }
  }

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
