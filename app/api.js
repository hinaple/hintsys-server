const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    console.log(req.headers);
    next();
});

router
    .route("/theme")
    .get((req, res) => {
        console.log(req.params);
    })
    .post((req, res) => {});

router
    .route("/theme/:tidx(\\d+)")
    .get((req, res) => {
        console.log(req.params);
        res.send("hello, world!");
    })
    .delete((req, res) => {})
    .put((req, res) => {});

router
    .route("/theme/:tidx(\\d+)/hint")
    .post((req, res) => {})
    .get((req, res) => {});

router
    .route("/theme/:tidx(\\d+)/hint/:hidx(\\d+)")
    .put((req, res) => {})
    .delete((req, res) => {});

router
    .route("/setting")
    .get((req, res) => {})
    .put((req, res) => {});

module.exports = router;
