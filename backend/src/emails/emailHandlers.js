import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const fromAddress = sender.email.includes("<")
    ? sender.email
    : sender.name
    ? `${sender.name} <${sender.email}>`
    : sender.email;

  const { data, error } = await resendClient.emails.send({
    from: fromAddress,
    to: email,
    subject: "Welcome to Chatify!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    if (error.statusCode === 403 && error.message?.includes("only send testing emails to your own email address")) {
      console.warn(
        `[Resend Sandbox Notice]: Welcome email was not sent because '${email}' is not your registered Resend email. (To send to all emails, verify a custom domain at resend.com/domains)`
      );
      return;
    }
    console.error("Error sending welcome email:", error);
    return;
  }

  console.log("Welcome Email sent successfully", data);
};
