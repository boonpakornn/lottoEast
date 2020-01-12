var mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    username: {type: String, require: true},
    password: {type: String, require: true},
    name: {type: String ,require: true},
    surname: {type: String},
    telno: {type: String},
    remark: {type: String}
})

var UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;