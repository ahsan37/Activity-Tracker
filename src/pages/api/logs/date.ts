import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import { ActivityLog } from '@/models/ActivityLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();
    const date = req.query.date as string;

    try {
        const log = await ActivityLog.findOne({
            date: new Date(date)
        });

        return res.status(200).json(log);
    } catch (error) {
        console.error('Error fetching log:', error);
        return res.status(500).json({ message: 'Error fetching log' });
    }
}