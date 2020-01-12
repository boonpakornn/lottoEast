var mongoose = require('mongoose')

var LottoSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    number: {type: String, require: true},
    period:{type: String, require: true},
    set: {type: String, require: true},
    sender:{type: String, require: true}
})

var LottoModel = mongoose.model('lottos', LottoSchema);
module.exports = LottoModel;