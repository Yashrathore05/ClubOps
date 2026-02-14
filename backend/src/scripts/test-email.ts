import "dotenv/config";
import { resend } from "../lib/email";

async function main() {
  const result = await resend.emails.send({
    from: "ClubOps <updates@clubops.in>",
    to: "yashrathore0418@gmail.com",
    subject: "ClubOps Test Email",
    html: "<p>Email system is working ✅</p>",
  });

  console.log("Email sent:", result);
}

main().catch(console.error);
