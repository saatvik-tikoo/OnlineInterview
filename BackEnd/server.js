let express = require('express');
let app = express();
let nodemailer = require('nodemailer');
let router = express.Router();
let cors = require('cors')
let bodyParser = require('body-parser')

app.use(cors());
app.use('/', router);

let jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));

let transporter, email, password;

router.post('/credentials', cors(), jsonParser, (req, res) => {
    email = req.body.email;
    password = req.body.password;

    transporter = nodemailer.createTransport("smtps://" + email + ":" + password + "@smtp.mail.com");

    transporter.verify((err, success) => {
        if (err) {
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })
        }
    })
})

router.post('/access', cors(), jsonParser, (req, res) => {
    let subject = req.body.subject;
    let message = req.body.message;

    let mailOptions = {
        from: email,
        to: 'st10112@mail.com',
        subject: subject,
        text: message
    };
    
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log("The error is: ", err)
            res.json({
                status: 'fail'
            })
        } else {
            res.json({
                status: 'success'
            })
        }
    })
})

app.listen(8000, () => console.info(`Server has started on port 8000`))