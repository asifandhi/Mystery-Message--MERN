import resend, { Resend } from "resend"
import { verificationEmailHTML } from "../email/verificationEmail.js"
const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email,username,verifyCode)=>{
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to:email,
            subject: "Mystery Message – Verify your account",
            html:verificationEmailHTML(username,verifyCode)
        });
    } catch (error) {
        console.error("Email send error:", error);
    return { success: false, message: "Failed to send verification email." };
    }
}

