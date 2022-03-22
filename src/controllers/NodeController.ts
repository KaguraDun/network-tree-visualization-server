import { Request, Response } from 'express';

import db from '../db/connectDB';

class NodeController {
  static async createNodesTable() {
    await db.query(
      `create TABLE IF NOT EXISTS nodes(
        id SERIAL PRIMARY KEY,
        parent_id INTEGER ,
        name VARCHAR(255) NOT NULL,
        ip varchar(15) NOT NULL,
        port SMALLINT NOT NULL,
        FOREIGN KEY (parent_id) 
        REFERENCES nodes (id) 
        ON DELETE CASCADE
      )`
    );
  }

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

      if (!rootNode[0]) {
        res.status(404).send({ status: 404, message: 'Nodes not found' });
        return;
      }

      const hasChildren = await NodeController.hasChildren(rootNode[0].id);

      const nodeWithHasChildren = rootNode.map((node) => ({
        ...node,
        hasChildren,
      }));

      res.json(nodeWithHasChildren);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ status: 500, message: error });
    }
  }

  static async getChildNodes(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const children = await NodeController.getChildren(id);

      const withHasChildren = await Promise.all(
        children.map(async (child) => {
          const hasChildren = await NodeController.hasChildren(child.id);
          return { ...child, hasChildren };
        })
      );

      res.json(withHasChildren);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ status: 500, message: error });
    }
  }

  static async getIsRootNodeExist() {
    const { rows: rootNode } = await db.query(
      'SELECT * from nodes where parent_id IS NULL'
    );

    return rootNode.length === 1;
  }

  static async addNode(req: Request, res: Response) {
    try {
      const { parentID, name, ip, port } = req.body;

      if (!name || !ip || !port) {
        console.log(name, ip, port);
        throw Error('All fields: name, ip and port required!');
      }

      if (parentID === null) {
        const isRootNodeExist = await NodeController.getIsRootNodeExist();
        if (isRootNodeExist) {
          res
            .status(204)
            .send({ status: 204, message: 'Root node already exist' });
          return;
        }
      }

      const { rows: newNode } = await db.query(
        'INSERT INTO nodes (parent_id, name, ip, port) VALUES ($1, $2, $3, $4) RETURNING *',
        [parentID, name, ip, port]
      );

      const combinedArray = newNode.map((node) => ({
        ...node,
        hasChildren: false,
      }));

      res.json(combinedArray);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ status: 500, message: error });
    }
  }

  static async removeNode(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await db.query('DELETE from nodes where id=$1', [id]);

      res.status(200).send({ status: 200, message: 'Node deleted' });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ status: 500, message: error });
    }
  }

  static async updateNodeData(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, ip, port } = req.body;

      await db.query(
        'UPDATE nodes SET name = $1, ip = $2, port = $3 where id = $4',
        [name, ip, port, id]
      );

      res.status(201).send({ status: 201, message: 'Node info updated' });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).send({ status: 500, message: error });
    }
  }
}

export default NodeController;
