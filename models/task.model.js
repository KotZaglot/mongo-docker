// task.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
});

module.exports = mongoose.model('Task', taskSchema);
