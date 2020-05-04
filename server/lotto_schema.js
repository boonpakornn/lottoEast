var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate-v2');

var LottoSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    bookNumber: {type: Number, require: true},
    countNumber:{type: Number, require: true},
    groupNumber: {type: Number, require: true},
    group: {type: Number, require: true},
    sender:{type: String, require: true},
    status:{type: String}
})
LottoSchema.plugin(mongoosePaginate);
var LottoModel = mongoose.model('lottos', LottoSchema);
module.exports = LottoModel;