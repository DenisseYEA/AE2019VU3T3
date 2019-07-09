const sgMail = require('@sendgrid/mail');
const config = require('../_config');

sgMail.setApiKey(config.SENGRID_APIKEY);

function enviar(msg) {
    
    msg["from"] = config.sender_email;

    sgMail.send(msg)
        .then((data) => {
            console.log("Éxito");
            console.log(data);
        })
        .catch((err) => {
            console.log("Falla");
            console.log(err["response"]["body"]);
        });
}

module.exports.send = enviar;