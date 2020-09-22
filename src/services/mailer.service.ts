import { injectable } from "inversify";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { CONFIG } from "../constants/configs";

@injectable()
export class MailerService {
    private transporter: Mail;
    constructor() {
		this.transporter = nodemailer.createTransport({
			service: CONFIG.MAILER.TRANSPORT,
			host: CONFIG.MAILER.HOST,
			port: CONFIG.MAILER.PORT,
			auth: {
					user: CONFIG.MAILER.USER,
					pass: CONFIG.MAILER.PASSWORD
			}
		});
    }

    public sendMail(mailOptions: Mail.Options) {
		this.transporter.sendMail({
            from: CONFIG.MAILER.FROM,
            ...mailOptions
        }, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
    }
}