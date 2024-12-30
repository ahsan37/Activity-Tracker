import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "@/utils/db";
import { ActivityLog } from "@/models/ActivityLog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'POST') {
        const { date, physicalActivity, reading, codingLearning, writingTweeting, protein } = req.body;

        try {
            const inputDate = new Date(date);
            const startOfDay = new Date(
                inputDate.getFullYear(),
                inputDate.getMonth(),
                inputDate.getDate(),
                0, 0, 0, 0
            );

            const existingLog = await ActivityLog.findOne({
                date: {
                    $gte: startOfDay,
                    $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
                }
            });

            let log;
            if (existingLog) {
                log = await ActivityLog.findByIdAndUpdate(
                    existingLog._id,
                    {
                        physicalActivity,
                        reading,
                        codingLearning,
                        writingTweeting,
                        protein: protein || false
                    },
                    { new: true }
                );
            } else {
                log = await ActivityLog.create({
                    date: startOfDay,
                    physicalActivity,
                    reading,
                    codingLearning,
                    writingTweeting,
                    protein: protein || false
                });
            }

            res.status(existingLog ? 200 : 201).json({
                message: `Activity log ${existingLog ? 'updated' : 'created'} successfully`,
                log
            });
        } catch (error) {
            console.error('Error saving activity log:', error);
            res.status(500).json({ message: 'Error saving activity log', error });
        }
    } else if (req.method === 'GET') {
        try {
          const logs = await ActivityLog.find({});
          res.status(200).json(logs);
        } catch (error) {
          console.error('Failed to fetch activity logs:', error);
          res.status(500).json({ error: 'Failed to fetch activity logs' });
        }
      } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
    }
    