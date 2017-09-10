const promise = require('bluebird');
const options = {
    promiseLib: promise
};
const _ = require('lodash');
const pgp = require('pg-promise')(options);
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'maintenance',
    user: 'ravi',
    password: 'mekshow',
};

const db = pgp(cn);

function lookupUser(email, cb) {
    db.oneOrNone('select * from employeess where email = $1', email)
        .then(function (data) {
            if (! _.isEmpty(data)){
                return cb(true, data.name);
            }
            return cb(false,null);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function getContractorEmail(id, cb) {
    db.one('select * from contractor where id=$1',id)
        .then(function(data){
            return cb(null,data.email)
        })
}
function getJobDescription(id,cb){
    db.one('select * from job where id=$1',id)
        .then(function(data){
            return cb(null,data.des)
        })
}

function getAllJobs(cb) {
    db.any('select * from job')
        .then(function(data) {
            return cb(null,data);
        })
        .catch(function (err) {
            console.log(err);
            return cb(err, null);
        });
}

function updateJobs(req,res) {
    let id = req.param('id');
    let status = req.param('status');
    let cId = req.param('cId');
    db.none('update job set status=$1, contratorid=$2 where id=$3',[status,cId,id])
        .then(function(){
            return res.status(200)
                .json({
                    status: 'success',
                    message: 'database Updated'
                });
        })
        .catch(function (err) {
            console.log(err);
            return handleError(res,err);
        });
}

function createJob(req,res) {
    des = req.param('des');
    db.none('insert into job(des)' +
        'values($1)',
        des)
        .then(function(){
            return res.status(200)
                .json({
                    status: 'success',
                    message: 'database Updated'
                });
        })
        .catch(function (err) {
            console.log(err);
            return handleError(res,err);
        });
}

function handleError(res, err) {
    return res.status(500).json({ error: err.message });
}

module.exports = {
    lookupUser: lookupUser,
    getAllJobs: getAllJobs,
    updateJobs: updateJobs,
    getContractorEmail: getContractorEmail,
    createJob: createJob,
    getJobDescription: getJobDescription
};
