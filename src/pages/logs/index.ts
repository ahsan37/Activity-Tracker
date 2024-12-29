import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "@/utils/db";
import { ActivityLog } from "@/models/ActivityLog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        const { date, physicalActivity, reading, codingLearning, writingTweeting } = req.body;

        try{
            const log = await ActivityLog.create({ date, physicalActivity, reading, codingLearning, writingTweeting });
            res.status(201).json({ message: 'Activity log created successfully', log });
        } catch (error) {
            res.status(500).json({ message: 'Error creating activity log', error });
        }
    } else if (req.method === 'GET') {
        try {
          const logs = await ActivityLog.find({});
          res.status(200).json(logs);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch activity logs' });
        }
      } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
    