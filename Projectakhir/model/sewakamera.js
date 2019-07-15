const mongoose = require('mongoose');
const sewakameraSchema = mongoose.Schema({
    idbarang        : {type: String, unique: true},
    jenisbarang   	: String,
    merk        	: String,
    tipe 	        : String,
    harga	        : String,
    foto	        : String,
    created_at		: String
});
module.exports = mongoose.model('sewakamera', sewakameraSchema);
