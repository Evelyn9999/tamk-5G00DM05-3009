import express from 'express';
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from '../controllers/eventController.js';

import { validateEvent } from '../validators/eventValidator.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public (but in assignment: “authenticated users”; you can decide)
// I suggest: authenticated users only
router.get('/', requireAuth, getEvents);
router.get('/:id', requireAuth, getEventById);

// Admin-only
router.post('/', requireAuth, requireAdmin, validateEvent, createEvent);
router.put('/:id', requireAuth, requireAdmin, validateEvent, updateEvent);
router.delete('/:id', requireAuth, requireAdmin, deleteEvent);

export default router;
