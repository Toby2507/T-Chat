import config from 'config';
import nodemailer, { SendMailOptions } from 'nodemailer';
import log from './logger';

interface smtpInterface {
    user: string;
    pass: string;
    host: string;
    port: number;
    secure: boolean;
}
const smtp = config.get<smtpInterface>('smtp');
const transport = nodemailer.createTransport({
    ...smtp,
    auth: { user: smtp.user, pass: smtp.pass }
})

const sendEmail = async (payload: SendMailOptions) => {
    transport.sendMail(payload, (err, info) => {
        if (err) return log.error(err, "Error sending email");
        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    })
}

export default sendEmail;