var mongoose = require('mongoose')

var TimeSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    startHour: {type: Number, require: true},
    startMinute: {type: Number, require: true},
    endHour: {type: Number, require: true},
    endMinute: {type: Number, require: true}
})

var TimeModel = mongoose.model('times', TimeSchema);
module.exports = TimeModel;