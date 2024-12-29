import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
    date: {type: Date, required: true},
    physicalActivity: {type: Boolean, required: true},
    reading: { type: Boolean, default: false },
    codingLearning: { type: Boolean, default: false },
    writingTweeting: { type: Boolean, default: false },
});

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
