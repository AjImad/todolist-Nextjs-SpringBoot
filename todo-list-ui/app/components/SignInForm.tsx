"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { Noto_Sans_Cham } from "next/font/google";
import { useRouter } from "next/navigation";
import { set, useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import Spinner from "@/components/spinner";
import { useState } from "react";

const notoSansCham = Noto_Sans_Cham({ subsets: ["latin"] });

const SignInForm = () => {
  const router = useRouter();
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  });

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      setLoading(true);
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if(res?.error){
        setLoading(false);
        toast.error(res.error);
      } else {
        setLoading(false);
        toast.success("Sign-in success");
        router.push("/");
      }
    } catch(error){
      toast.error("Error during sign-in");
    }
  };

  return (
    <div className={notoSansCham.className}>
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Please enter your detials
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[350px]"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    icon={<Mail size={20} className="text-muted-foreground" />}
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {/* <p className="h-4"> {form.formState.errors.email?.message} </p> */}
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
                  <Input
                    type="password"
                    icon={<Lock size={20} className="text-muted-foreground" />}
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-[100%]">
            {
              loading ? <Spinner size="default" /> : "Sign In"
            }
          </Button>
        </form>
      </Form>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default SignInForm;
