var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate-v2');

var UserSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    userName: {type: String, require: true},
    password: {type: String, require: true},
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    telNo: {type: String, require: true},
    remark: {type: String}
})
UserSchema.plugin(mongoosePaginate);
var UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;