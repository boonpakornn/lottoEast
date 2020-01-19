var mongoose = require('mongoose')

var LottoSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    bookNumber: {type: String, require: true},
    countNumber:{type: String, require: true},
    groupNumber: {type: String, require: true},
    sender:{type: String, require: true},
    status:{type: String}
})

var LottoModel = mongoose.model('lottos', LottoSchema);
module.exports = LottoModel;