"use client"

import {cn } from "@/lib/utils"
import {Form,FormControl,FormField,FormItem,FormLabel, FormMessage} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {Input } from "@/components/ui/input"

import {useState} from "react"
import {Loader2} from "lucide-react"
import Link from 'next/link'
import {Button } from "@/components/ui/button"
import { toast} from "sonner"

import {z} from "zod"
import {useForm} from "react-hook-form"
import type {Control, FieldPath} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { authClient } from "@/lib/auth-client"

//form schema
const formSchema = z.object({
    email: z.email(),
})

interface SignupFormFieldProps{
    name: FieldPath<z.infer<typeof formSchema>>;
    label: string;
    placeholder: string;
    description?: string;
    inputType?: string;
    formControl: Control<z.infer<typeof formSchema>, any>;
}

const SignupFormField: React.FC<SignupFormFieldProps> = ({
    name, label, placeholder, description, inputType,formControl,
})=>{
    return (
        <FormField
            control={formControl}
            name={name}
            render={ ({field}) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type={inputType || "text"}
                            {...field}
                        />
                    </FormControl>

                </FormItem>
            )}
        />

    )
}

export function ForgotPasswordForm({className, ...props}:React.ComponentProps<"div">){

    const [isLoading, setIsLoading] = useState(false)
    //Define form using react hook form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            email: "",
        }
    })

    //submit handler
    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            setIsLoading(true)

            const {error } = await authClient.forgetPassword({
                email: values.email,
                redirectTo: "/reset-password"
            })

            if (!error) {
                toast.success("Please check your email for a password reset link.")
            }else{
                toast.error(error.message)
            }
        }catch(error){
            console.error(error)
        }finally{
            setIsLoading(false)

        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Forgot password</CardTitle>
                    <CardDescription>
                        Please Enter your email to reset your password
                    </CardDescription>

                </CardHeader>

                <CardContent>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className= "flex flex-col gap-6">
                            <div className="grid gap-3">
                                <SignupFormField
                                    name="email"
                                    label="Email"
                                    placeholder="m@example.com"
                                    inputType="email"
                                    formControl={form.control}
                                />
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (<Loader2 className="size-4 animate-spin" />) : ("Reset Password")}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="underline underline-offset-4">Sign up</Link>
                        </div>
                        </form>

                    </Form>

                </CardContent>

            </Card>
        </div>
    )

}