var express = require('express');
var router = express.Router();
var penyewaan = require('../model/penyewaan');
var sewakamera = require('../model/sewakamera');
var transaksi = require('../model/transaksi');
var User = require('../model/user')
var Auth_mdw = require('../middlewares/auth');

router.get('/member', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('users/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/datapenyewaan', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    session_store = req.session
    penyewaan.aggregate([{
        $lookup: {
            from: "sewakameras",
            localField: "idbarang",
            foreignField: "idbarang",
            as: "data"
        }
    }], function(err, sewa) {
        res.render('users/sewa/tablepenyewaan', { session_store: session_store, penyewaans: sewa })
        console.log("Dataks" + sewa.idpenyewaan)
    })
});

router.get('/datatransaksi', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    session_store = req.session
    transaksi.aggregate([{
        $lookup: {
            from: "sewakameras",
            localField: "idbarang",
            foreignField: "idbarang",
            as: "data"
        }
    }], function(err, sewa) {
        res.render('users/sewa/transaksi', { session_store: session_store, transaksis: ts })
        console.log("Dataks" + ts.idtransaksi)
    })
});
// /* GET users listing. */
// router.get('/inputtransaksi', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
//     session_store = req.session
//     res.render('users/sewa/inputtransaksi', { session_store: session_store})
// });
//menampilkan data berdasarkan id
router.get('/:id/inputtransaksi', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    session_store = req.session

    sewakamera.findOne({ _id: req.params.id }, function(err, kamera) {
        if (kamera) {
            console.log("kamerasss"+kamera);
            res.render('users/sewa/inputtransaksi', { session_store: session_store, sewakameras: kamera })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/inputtransaksi')
        }
    })
})

//input data sewa
router.post('/:id/inputtransaksi', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    session_store = req.session

    transaksi.findById(req.params.id, function(err, ts) {
        if (ts.length == 0) {
            var datatransaksi = new transaksi({
                tanggalpinjam: req.body.tanggalpinjam,
                tanggalkembali: req.body.tanggalkembali,
                totalharga: req.body.totalharga
            })
            datatransaksi.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/inputpenyewaan')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/inputpenyewaan')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode sewa sudah ada....')
            res.render('users/sewa/inputpenyewaan', {
                session_store: session_store,
                tanggalpinjam: req.body.tanggalpinjam,
                tanggalkembali: req.body.tanggalkembali,
                totalharga: req.body.totalharga
            })
        }
    })
})


router.get('/inputpenyewaan', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    session_store = req.session

    sewakamera.find({}, function(err, kamera) {
        //console.log(sewa);
        res.render('users/sewa/inputpenyewaan', { session_store: session_store, sewakameras: kamera })
    }).select('_id idbarang jenisbarang merk tipe harga foto')
});

router.post('/:id/deletepenyewaan', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    console.log("Soiiiiii"+req.params.id)
    penyewaan.findById(req.params.id, function(err, sewa){
        sewa.remove(function(err, sewa){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data pemesanan berhasil dihapus!');
            }
            res.redirect('/datapenyewaan');
        })
    })
})
//menampilkan data berdasarkan id
router.get('/:id/editpenyewaan', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    session_store = req.session

    penyewaan.findOne({ _id: req.params.id }, function(err, sewa) {
        if (sewa) {
            console.log("sewakamerasss"+sewa);
            res.render('users/sewa/editpenyewaan', { session_store: session_store, penyewaans: sewa})
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datapenyewaan')
        }
    })
    penyewaan.aggregate([
        { $match : { _id : req.params.id } },
        {
            $lookup: {
                from: "sewakameras",
                localField: "idbarang",
                foreignField: "idbarang",
                as: "data"
            }
        }], function(err, sewa) {
        console.log("anggi" + sewa)
        res.render('users/sewa/editpenyewaan', { session_store: session_store, penyewaans: sewa })
    })
})

router.post('/:id/editpenyewaan', Auth_mdw.check_login, Auth_mdw.is_member, function(req, res, next) {
    session_store = req.session

    penyewaan.findById(req.params.id, function(err, sewa) {
        sewa.idpenyewaan = req.body.idpenyewaan;
        sewa.idbarang = req.body.idbarang;
        sewa.qty = req.body.qty;
        sewa.total = req.body.total;

        sewa.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datapenyewaan');

        });
    });
})



module.exports = router;

