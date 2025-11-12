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
import { signUpUser } from "@/server/users"
import { authClient } from "@/lib/auth-client"

import { useRouter, useSearchParams } from "next/navigation"

//form schema
const formSchema = z.object({
    password : z.string().min(8),
    confirmPassword: z.string().min(8)
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

export function ResetPasswordForm({className, ...props}:React.ComponentProps<"div">){
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    //Define form using react hook form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            password: "",
            confirmPassword: ""
        }
    })

    //submit handler
    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            setIsLoading(true)
            //confirm password
            if (values.password !== values.confirmPassword){
                toast.error("Password does not match")
                return
            }

            const {error} = await authClient.resetPassword({
                newPassword: values.password,
                token: token ?? "",
            })
            if (!error) {
                toast.success("Password reset successfully")
                router.push("/login")
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
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Enter information to create an account

                    </CardDescription>

                </CardHeader>

                <CardContent>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className= "flex flex-col gap-6">
          
                            <div className="grid gap-3">
                                <SignupFormField
                                    name="password"
                                    label="New Password"
                                    placeholder="Password"
                                    inputType="password"
                                    formControl={form.control}
                                />
                            </div>
                            <div className="grid gap-3">
                                <SignupFormField
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="Password"
                                    inputType="password"
                                    formControl={form.control}
                                />
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (<Loader2 className="size-4 animate-spin" />) : ("Submit")}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            Already have an Account?{" "}
                            <Link href="/login" className="underline underline-offset-4">Sign In</Link>

                        </div>
                        </form>

                    </Form>

                </CardContent>

            </Card>
        </div>
    )

}