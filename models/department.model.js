const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task' 
    },
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }]
});

module.exports = mongoose.model('Department', departmentSchema);
