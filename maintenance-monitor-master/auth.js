const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const gmail = google.gmail('v1');
const db = require('./queries');



oauth2Client = new OAuth2(
    "777649923671-apint5r7d65asih56l0h8fmh5pg2bhbf.apps.googleusercontent.com",
    "2mbHvsTbBH-8MB_IwljMdaC1",
    "http://localhost:3000/oauth2callback"
);



const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send'
];

function getAuthUrl(req,res) {
    let url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.status(302)
        .redirect(url);
}

function getTokens(req,res) {
    let session = req.session;
    let code = req.param('code');
    oauth2Client.getToken(code,(err,tokens) => {
        if (!err) {
        oauth2Client.setCredentials(tokens);
        session["tokens"]=tokens;
        return validateUser(req,res);
    }
    });
}

function validateUser(req,res) {
    gmail.users.getProfile({
        userId: 'me',
        auth: oauth2Client
    }, function (err, response) {
        if(err) return handleError(res,err);
        return db.lookupUser(response.emailAddress, (valid, name) => {
            if (valid) res.redirect(302,('default/?user='+name));
            if (!valid) res.redirect(302,('default'));
        });
    });
}

function handleError(res, err) {
    return res.status(500).json({ error: err.message });
}

function sendEmail(req,res) {
    let cId = req.param('cId');
    let id = req.param('id');
    db.getContractorEmail(cId,(err,email) => {
        db.getJobDescription(id,(err,des) => {
            msg = des+'\nyes link: http://localhost:3000/update-jobs?id='+id+'&status=accepted'+'&cId='+cId+
                '\n no link: http://localhost:3000/update-jobs?id='+id+'&status=denied'+'&cId='+cId;
            oauth2Client.setCredentials(req.session["tokens"]);
            let raw = makeBody(email, des, msg);
            gmail.users.messages.send({
                auth: oauth2Client,
                userId: 'me',
                resource: {
                    raw: raw
                }
            }, function(err, response) {
                if(err) return handleError(res,err);
                return res.status(200)
                    .json({
                        status: 'success',
                        message: 'Thank You'
                    });
            });
        });
    });

}

function makeBody(to, subject, message) {
    let str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');
    return new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
}

module.exports= {
    getAuthUrl: getAuthUrl,
    getTokens: getTokens,
    sendEmail: sendEmail
};