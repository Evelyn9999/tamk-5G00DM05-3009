import Event from '../models/Event.js';

// GET /items?type=meeting&date=2024-12-01
export const getEvents = async (req, res) => {
    try {
        const { type, date, title } = req.query;
        const filter = {};

        if (type) filter.type = type;
        if (title) filter.title = { $regex: title, $options: 'i' };

        if (date) {
            // treat as day
            const dayStart = new Date(date);
            const dayEnd = new Date(date);
            dayEnd.setDate(dayEnd.getDate() + 1);

            filter.date = { $gte: dayStart, $lt: dayEnd };
        }

        const events = await Event.find(filter).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error('getEvents error', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /items/:id
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        console.error('getEventById error', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /items  (admin only, validated by Joi before here)
export const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (err) {
        console.error('createEvent error', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// PUT /items/:id
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        console.error('updateEvent error', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// DELETE /items/:id
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.status(204).end();
    } catch (err) {
        console.error('deleteEvent error', err);
        res.status(500).json({ error: 'Server error' });
    }
};
