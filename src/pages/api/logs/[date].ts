import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/db';
import { ActivityLog } from '@/models/ActivityLog';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    await dbConnect();
    const { date } = req.query;

    try {
        const queryDate = new Date(date as string);
        const startOfDay = new Date(
            queryDate.getFullYear(),
            queryDate.getMonth(),
            queryDate.getDate(),
            0, 0, 0, 0
        );
        
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const log = await ActivityLog.findOne({
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        return res.status(200).json(log);
    } catch (error) {
        console.error('Error fetching log:', error);
        return res.status(500).json({ message: 'Error fetching log' });
    }
} 