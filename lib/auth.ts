import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { schema } from "@/db/schema"
import { nextCookies } from "better-auth/next-js";

import {Resend} from "resend"
import VerificationEmail from "@/components/emails/verification-email";

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema
    }),
    emailAndPassword : {
        enabled: true,
        requireEmailVerification: true,

    },
    plugins: [nextCookies()],
    emailVerification: {
        sendVerificationEmail: async({user,url,token}, request) => {
            const {data,error} = await resend.emails.send({
                from:'onboarding@resend.dev',
                to: [user.email],
                subject: "Verify your email address",
                react: VerificationEmail({userName: user.name, verificationUrl: url})
            })
        },
        sendOnSignUp: true,
    }
});