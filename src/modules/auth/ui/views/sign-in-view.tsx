"use client";
import z from "zod";
import { Card, CardContent } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { OctagonAlertIcon } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});


export const SignInView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);
        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        },
            {
                onError: ({ error }) => {
                    setError(error.message);
                },
                onSuccess: () => {
                    router.push("/");
                }
            });
            setLoading(false);
    }

    return (
        <div className="flex flex-col gap-6 font-sans">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold ">Welcome Back</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="**********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {
                                    !!error && (
                                        <Alert className="bg-destructive/10 border-none">
                                            <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                            <AlertTitle className="font-semibold">{error}</AlertTitle>
                                        </Alert>
                                    )
                                }
                                <Button type="submit" className="w-full cursor-pointer" disabled={loading}>Signin</Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card relative z-10 px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button type="button" variant="outline" className="w-full" disabled={loading}>
                                        {/* <img src="/google.svg" alt="Google Logo" className="w-4 h-4 mr-2" /> */}
                                        Google
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full" disabled={loading} >
                                        {/* <img src="/github.svg" alt="GitHub Logo" className="w-4 h-4 mr-2" /> */}
                                        GitHub
                                    </Button>
                                </div>
                                <div className="text-sm text-center">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/sign-up" className="text-primary hover:underline">
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-radial from-green-500 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                        <div>
                            <span>
                                <svg width="51" height="40" viewBox="0 0 51 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.446 0L22.7801 8.82887C23.3936 9.35302 23.7473 10.1222 23.7473 10.9323V17.5862L13.4131 8.75734C12.7996 8.23319 12.446 7.464 12.446 6.65386V0Z" fill="#7B19D8"></path>
                                    <path d="M12.446 40L22.7801 31.1711C23.3936 30.647 23.7473 29.8778 23.7473 29.0677V22.4138L13.4131 31.2427C12.7996 31.7668 12.446 32.536 12.446 33.3461V40Z" fill="#7B19D8"></path>
                                    <path d="M0.117188 9.31034L10.3108 17.9705C10.805 18.3904 11.4308 18.6207 12.0775 18.6207H20.2982L10.1297 9.96253C9.63514 9.54141 9.00837 9.31034 8.36065 9.31034H0.117188Z" fill="#7B19D8"></path>
                                    <path d="M0.117188 30.6897L10.2481 22.0345C10.7432 21.6115 11.3713 21.3793 12.0206 21.3793H20.3227L10.1291 30.0394C9.63487 30.4593 9.00904 30.6897 8.36236 30.6897H0.117188Z" fill="#7B19D8"></path>
                                    <path d="M37.7884 0L27.4542 8.82887C26.8407 9.35302 26.4871 10.1222 26.4871 10.9323V17.5862L36.8212 8.75734C37.4347 8.23319 37.7884 7.464 37.7884 6.65386V0Z" fill="#7B19D8"></path>
                                    <path d="M37.7884 40L27.4542 31.1711C26.8407 30.647 26.4871 29.8778 26.4871 29.0677V22.4138L36.8212 31.2427C37.4347 31.7668 37.7884 32.536 37.7884 33.3461V40Z" fill="#7B19D8"></path>
                                    <path d="M50.1172 9.31034L39.9236 17.9705C39.4294 18.3904 38.8035 18.6207 38.1569 18.6207H29.9361L40.1047 9.96253C40.5992 9.54141 41.226 9.31034 41.8737 9.31034H50.1172Z" fill="#7B19D8"></path>
                                    <path d="M50.1172 30.6897L39.9863 22.0345C39.4912 21.6115 38.863 21.3793 38.2137 21.3793H29.9117L40.1052 30.0394C40.5995 30.4593 41.2253 30.6897 41.872 30.6897H50.1172Z" fill="#7B19D8"></path>
                                </svg>
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-white">Agentix</p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                <p>
                    By signing in, you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>.
                </p>
            </div>
        </div>
    )
}

export default SignInView;