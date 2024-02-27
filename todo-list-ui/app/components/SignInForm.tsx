"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Lock, Mail } from "lucide-react";
import { Noto_Sans_Cham } from "next/font/google";

const notoSansCham = Noto_Sans_Cham({ subsets: ["latin"] });

const SignInForm = () => {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
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
            Sign In
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
