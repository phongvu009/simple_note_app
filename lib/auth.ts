import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle"; // your drizzle instance
import { schema } from "@/db/schema"
import { nextCookies } from "better-auth/next-js";

import {Resend} from "resend"

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
            await sendEmail({
                to: user.email,
                subject: "Verify your email address",
                text: `Click the link to verify your email: ${url}`
            })
        }
    }
});