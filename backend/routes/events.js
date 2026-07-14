const express = require('express');
const router = express.Router();
const Event = require('../models/Event');


const calculateStatus = (dateStr) => {
    if (!dateStr) return 'past';
    const parsed = Date.parse(dateStr);
    if (isNaN(parsed)) return 'past';
    
    const eventDate = new Date(parsed);
    const now = new Date();
    // End of the event month
    const endOfMonth = new Date(eventDate.getFullYear(), eventDate.getMonth() + 1, 0, 23, 59, 59, 999);
    return endOfMonth < now ? 'past' : 'upcoming';
};

router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        const updatedEvents = events.map(event => {
            const eventObj = event.toObject();
            eventObj.status = calculateStatus(event.date);
            return eventObj;
        });
        res.json(updatedEvents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const status = req.body.status || calculateStatus(req.body.date);
    const event = new Event({
        url: req.body.url,
        event_name: req.body.event_name,
        status: status,
        category: req.body.category,
        date: req.body.date,
        registrationLink: req.body.registrationLink
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
