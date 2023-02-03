import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import Email, {
  type ForgotPasswordEmailProps,
} from "@/components/emails/forgot-password-email";

import { env } from "@/env/server.mjs";

export const SendEmail = (emailProps: ForgotPasswordEmailProps) => {
  const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false,
    // auth: {
    //   user: "my_user",
    //   pass: "my_password",
    // },
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    auth: {
      user: env.MAIL_USERNAME,
      pass: env.MAIL_PASSWORD,
    },
  });

  const emailHtml = render(<Email {...emailProps} />);

  const options = {
    from: "you@example.com",
    to: "user@gmail.com",
    subject: "hello world",
    html: emailHtml,
  };

  return transporter.sendMail(options);
};
