const { Schema, model } = require('mongoose');
const eventSchema = new Schema({
    _id: Schema.Types.ObjectId,
    eventId: String,
    threadId: String,
    gcalId: String,
    organizers: [String]
});

module.exports = model("Event", eventSchema, "events");