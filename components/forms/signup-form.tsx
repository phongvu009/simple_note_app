"use client"

import {cn } from "@/lib/utils"

import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"

//form schema
const formSchema = z.object({
    email: z.email(),
    username: z.string().min(3).max(50),
    password : z.string().min(8)

})

export function SignupForm({className, ...props}:React.ComponentProps<"div">){
    //Define form using react hook form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            email: "",
            username: "",
            password: ""
        }
    })
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>

        </div>
    )

}