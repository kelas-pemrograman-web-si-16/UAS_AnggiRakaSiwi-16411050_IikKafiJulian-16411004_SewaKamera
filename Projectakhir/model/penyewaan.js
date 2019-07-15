const mongoose = require('mongoose');
const penyewaanSchema = mongoose.Schema({
    idpenyewaan     : {type: String, unique: true},
    idbarang    	: String,
    qty             : String,
    total           : String,
    created_at		: String
});
module.exports = mongoose.model('penyewaan', penyewaanSchema);
