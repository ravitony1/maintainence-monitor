const express = require('express');
const router = express.Router();

const auth = require('../auth');
const db = require('../queries');

router.get('/',function(req,res){
    res.status(200).render('index')
});

router.get('/create-job',db.createJob)
router.get('/update-jobs', db.updateJobs)
router.get('/send-request', auth.sendEmail)
router.get('/getAuthURL', auth.getAuthUrl);
router.get('/oauth2callback',auth.getTokens);

router.get('/default', loadDefaultPage);

function loadDefaultPage(req,res) {
    return db.getAllJobs((err, data) => {
        context = {
            user: req.param('user'),
            jobs: data
        };
        if (err) handleError(res,err);
        res.status(200).render('default',context);
    });
}

function handleError(res, err) {
    consile.log(err);
    return res.status(500).json({ error: err.message });
}

module.exports = router;
