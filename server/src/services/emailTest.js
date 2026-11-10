
import "dotenv/config";
import { sendEmail } from "./email.service.js";

const testEmail = async () => {
  try {
    await sendEmail({
      to: "dhyanponnanna2003@gmail.com",
      subject: "Coorg Agri-Tech - Test Email",
      html: `
        <h2>Welcome to Coorg Agri-Tech!</h2>
        <p>Your Resend email integration is working.</p>
        <p>Weather alerts will be delivered to subscribed farmers.</p>
      `,
    });

    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test email failed:", error.message);
  }
};

testEmail();
