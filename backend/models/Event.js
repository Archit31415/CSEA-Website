const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    event_name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'past'
    },
    category: {
        type: String,
        default: 'academic'
    },
    date: {
        type: String
    },
    registrationLink: {
        type: String
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
