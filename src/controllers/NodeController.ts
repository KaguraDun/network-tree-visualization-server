import { Request, Response } from 'express';

import db from '../db/connectDB';

class NodeController {
  static async getChildren(id: string) {
    const { rows: children } = await db.query(
      'SELECT * from nodes where parentID = $1',
      [id]
    );

    return children;
  }

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
      const children = NodeController.getChildren(id);

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
  }
  static async changeNodeName(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await db.query('UPDATE nodes set name = $1 where id = $2', [name, id]);

      res.status(201).send({ message: 'Node renamed' });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ message: error });
    }
  }

  static async changeNodeIP(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { ip } = req.body;

      await db.query('UPDATE nodes set ip = $1 where id = $2', [ip, id]);

      res.status(201).send({ message: 'Node ip changed' });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ message: error });
    }
  }

  static async changeNodePort(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { port } = req.body;

      await db.query('UPDATE nodes set port = $1 where id = $2', [port, id]);

      res.status(201).send({ message: 'Node port changed' });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ message: error });
    }
  }
}

export default NodeController;
