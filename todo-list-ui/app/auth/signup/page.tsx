"use client";
import Spinner from "@/components/spinner";
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
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";

const SignupForm = () => {
  const formSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long.",
    }),
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
        setLoading(true);
        const res = await axios.post("/auth/register", values)
        setLoading(false);
        toast.success("Sign-up success. Please sign-in");
        setTimeout(() => {
            router.push("/auth/signin");
        }, 1000);
    } catch(error){
        toast.error("Error during sign-up");
    }
  };

  return (
    <div>
      <div className="text-center mb-3">
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Please enter your detials
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-[350px]"
        >
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Firstname</FormLabel>
                  <FormControl>
                    <Input placeholder="Firstname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">Lastname</FormLabel>
                  <FormControl>
                    <Input placeholder="Lastname" {...field} />
                  </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Email</FormLabel>
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
                <FormLabel className="text-xs text-muted-foreground">Password</FormLabel>
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
            {loading ? <Spinner size="default" /> : "Sign Up"}
          </Button>
        </form>
      </Form>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mt-5">
          You already have account? <Link className="underline" href={"/auth/signin"}>signin</Link>
        </p>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default SignupForm;
