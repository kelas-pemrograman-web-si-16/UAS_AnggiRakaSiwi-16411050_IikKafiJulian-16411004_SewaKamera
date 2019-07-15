var express = require('express');
var crypto = require('crypto')
var multer  = require('multer')

var User = require('../model/user')
var sewakamera = require('../model/sewakamera')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
})

var upload = multer({ storage: storage })


/* GET users listing. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('users/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/datakamera', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    sewakamera.find({}, function(err, kamera) {
        //console.log(sewa);
        res.render('users/sewa/tablekamera', { session_store: session_store, sewakameras: kamera })
    }).select('_id idbarang jenisbarang merk tipe harga foto')
});

/* GET users listing. */
router.get('/inputkamera', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('users/sewa/inputdatakamera', { session_store: session_store})
});

//input data sewa
router.post('/inputkamera', Auth_middleware.check_login, Auth_middleware.is_admin, upload.single('foto'), function(req, res, next) {
    session_store = req.session

    sewakamera.find({ idbarang: req.body.idbarang }, function(err, kamera) {
        if (kamera.length == 0) {
            var datasewakamera = new sewakamera({
                idbarang: req.body.idbarang,
                jenisbarang: req.body.jenisbarang,
                merk: req.body.merk,
                tipe: req.body.tipe,
                harga: req.body.harga,
                foto: req.file.filename
            })
            datasewakamera.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datakamera')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datakamera')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode sewa sudah ada....')
            res.render('users/sewa/inputdatakamera', {
                session_store: session_store,
                idbarang: req.body.idbarang,
                jenisbarang: req.body.jenisbarang,
                merk: req.body.merk,
                tipe: req.body.tipe,
                harga: req.body.harga,
                foto: req.file.filename
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editkamera', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    sewakamera.findOne({ _id: req.params.id }, function(err, kamera) {
        if (kamera) {
            console.log("kamerasss"+kamera);
            res.render('users/sewa/editdatakamera', { session_store: session_store, sewakameras: kamera })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datakamera')
        }
    })
})

router.post('/:id/editkamera' +
    '', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    sewakamera.findById(req.params.id, function(err, kamera) {
        kamera.idbarang = req.body.idbarang;
        kamera.jenisbarang = req.body.jenisbarang;
        kamera.merk = req.body.merk;
        kamera.tipe = req.body.tipe;
        kamera.harga = req.body.harga;

        kamera.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datakamera');

        });
    });
})

router.post('/:id/editgambarkamera', Auth_middleware.check_login, Auth_middleware.is_admin, upload.single('foto'), function(req, res, next) {
    session_store = req.session

    sewakamera.findById(req.params.id, function(err, kamera) {
        kamera.foto = req.file.filename

        kamera.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datakamera');

        });
    });
})

router.post('/:id/deletekamera', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    sewakamera.findById(req.params.id, function(err, kamera){
        kamera.remove(function(err, kamera){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data sewa berhasil dihapus!');
            }
            res.redirect('/datakamera');
        })
    })
})

module.exports = router;
