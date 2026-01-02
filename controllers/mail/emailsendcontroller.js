// Express Route module import
const ejs = require("ejs");
const nodemailer = require("nodemailer");

// Config import
const config = require("../../config/config.json");

// Mail transporter setup
const transporter = nodemailer.createTransport({
    host: config.Gamil.SmtpServer,
    port: config.Gamil.SmtpPort,
    secure: true,
    auth: {
        user: config.Gamil.EmailFrom,
        pass: config.Gamil.Email_Password
    }
});




class EmailSent {
    // 1️⃣ Send email to Admin
    async sendemailtous(formData) { 
        try {
            const html = await ejs.renderFile("./views/email/thanks_me.ejs", { data: formData });
            const mailOptions = {
                from: `"${config.Gamil.Email_Title}" <${config.Gamil.EmailFrom}>`,
                to: config.Gamil.EmailFrom,
                bcc: config.Gamil.Email_BCC,
                subject: "Someone is trying to connect with us | TMTrip",
                html
            };

            await transporter.sendMail(mailOptions);
            return { Status: "Suc", Msg: "Admin email sent successfully" };

        } catch (error) {
            console.error("Admin Email Error:", error);
            return { Status: "err", Msg: "Admin email failed" };
        }
    }

    // 2️⃣ Send thank-you email to Client + Admin
    async sendemailfromcontactus(formData) {
        try {
            // First send admin email
            await this.sendemailtous(formData);

            // Render client template
            const html = await ejs.renderFile("./views/email/thanks_email_client.ejs", { Udata: formData });
            const mailOptions = {
                from: `"${config.Gamil.Email_Title}" <${config.Gamil.EmailFrom}>`,
                to: formData.email,
                bcc: config.Gamil.Email_BCC,
                subject: "Thanks for reaching TMTrip",
                html
            };

            await transporter.sendMail(mailOptions);
            return { Status: "Suc", Msg: "Admin & Client emails sent successfully" };

        } catch (error) {
            console.error("Client Email Error:", error);
            return { Status: "err", Msg: "Email sending failed" };
        }
    }
}




module.exports = EmailSent;
