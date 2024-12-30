import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: true, 
        unique: true,
        set: (date: Date) => {
            const localDate = new Date(date);
            localDate.setHours(0, 0, 0, 0);
            return localDate;
        }
    },
    physicalActivity: { type: Boolean, required: true },
    reading: { type: Boolean, default: false },
    codingLearning: { type: Boolean, default: false },
    writingTweeting: { type: Boolean, default: false },
    protein: { type: Boolean, default: false }
});

export interface IActivityLog {
    _id: string;
    date: Date;
    physicalActivity: boolean;
    reading: boolean;
    codingLearning: boolean;
    writingTweeting: boolean;
    protein: boolean;
}

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
