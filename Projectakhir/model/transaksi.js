const mongoose = require('mongoose');
const transaksiSchema = mongoose.Schema({
    idtransaksi     : {type: Date, unique: true},
    tanggalpinjam   : Date,
    tanggalkembali  : Date,
    totalharga      : String

});
module.exports = mongoose.model('transaksi', transaksiSchema);
