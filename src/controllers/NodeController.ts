import { Request, Response } from 'express';

import db from '../db/connectDB';

class NodeController {
  static async hasChildren(id: string) {
    const children = await NodeController.getChildren(id);
    return children.length > 0;
  }

  static async getChildren(id: string) {
    const { rows: children } = await db.query(
      'SELECT * from nodes where parent_id = $1',
      [id]
    );

    return children;
  }

  static async getRootNode(req: Request, res: Response) {
    try {
      const { rows: rootNode } = await db.query(
        'SELECT * from nodes where parent_id IS NULL'
      );
      const hasChildren = await NodeController.hasChildren(rootNode[0].id);
      const nodeWithHasChildren = rootNode.map((node) => ({
        ...node,
        hasChildren,
      }));

      res.json(nodeWithHasChildren);
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

  static async getParentLevel(parentID: number) {
    const { rows: parentLevel } = await db.query(
      'SELECT level FROM nodes WHERE id = $1',
      [parentID]
    );
    const { level } = parentLevel[0];

    return level;
  }

  static async addNode(req: Request, res: Response) {
    try {
      const { parentID, name, ip, port } = req.body;

      if (!name || !ip || !port) {
        console.log(name, ip, port);
        throw Error('All fields: name, ip and port required!');
      }
      let level;
      if (parentID === null) {
        level = 0;
      } else {
        const parentLevel = await NodeController.getParentLevel(parentID);
        console.log(parentID, parentLevel);
        if (typeof parentLevel === 'number') {
          level = parentLevel + 1;
        }
      }

      const { rows: newNode } = await db.query(
        'INSERT INTO nodes (parent_id, name, ip, port, level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [parentID, name, ip, port, level]
      );

      const combinedArray = newNode.map((node) => ({
        ...node,
        hasChildren: false,
      }));

      res.json(combinedArray);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ message: error });
    }
  }

  static async removeNode(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { rows: removedNodes } = await db.query(
        'DELETE from nodes where id=$1 RETURNING *',
        [id]
      );

      res.json(removedNodes);
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
