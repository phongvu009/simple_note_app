"use client"

import {cn } from "@/lib/utils"
import {Form,FormControl,FormField,FormItem,FormLabel, FormMessage} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {Input } from "@/components/ui/input"

import {useState} from "react"
import {Loader2} from "lucide-react"
import {Button } from "@/components/ui/button"
import { toast} from "sonner"

import {z} from "zod"
import {useForm} from "react-hook-form"
import type {Control, FieldPath} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { signUpUser } from "@/server/users"
//form schema
const formSchema = z.object({
    email: z.email(),
    username: z.string().min(3).max(50),
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

export function SignupForm({className, ...props}:React.ComponentProps<"div">){

    const [isLoading, setIsLoading] = useState(false)
    //Define form using react hook form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues : {
            email: "",
            username: "",
            password: "",
            confirmPassword: ""
        }
    })

    //submit handler
    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            setIsLoading(true)

            const response = await signUpUser(values.email, values.password, values.username )

            if (response.success) {
                toast.success("Please check your email for verification.")
            }else{
                toast.error(response.message)
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
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>
                        Enter information to create an account

                    </CardDescription>

                </CardHeader>

                <CardContent>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-3">
                                <SignupFormField
                                    name="email"
                                    label="Email"
                                    placeholder="Email"
                                    inputType="email"
                                    formControl={form.control}
                                />
                            </div>
                            <div className="grid gap-3">
                                <SignupFormField
                                    name="username"
                                    label="Username"
                                    placeholder="Username"
                                    formControl={form.control}
                                />
                            </div>
                            <div className="grid gap-3">
                                <SignupFormField
                                    name="password"
                                    label="Password"
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
                                    {isLoading ? (<Loader2 className="size-4 animate-spin" />) : ("Sign Up")}
                                </Button>
                                <Button variant="outline" className="w-full" >
                                    Sign Up with Google

                                </Button>
                            </div>
                        </form>

                    </Form>

                </CardContent>

            </Card>
        </div>
    )

}