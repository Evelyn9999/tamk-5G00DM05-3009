import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        type: {
            type: String,
            enum: ['meeting', 'birthday', 'exam', 'other'],
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
