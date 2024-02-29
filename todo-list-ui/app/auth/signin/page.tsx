"use client";
import SignInForm from "@/app/components/SignInForm";
import { useSession } from "next-auth/react";
import Image from "next/image";

const SignIn = () => {
  const { data: session, status } = useSession();
  console.log("session: ", { session });
  return (
    <div className="w-[820px] h-[500px] flex">
      <div className="w-[100%] flex justify-center items-center sm:p-4 bg-white shadow-lg py-3 rounded-tl rounded-bl">
        <SignInForm />
      </div>
      <div className="w-[100%] hidden md:block">
        <Image
          src={"/todo-image.png"}
          width={600}
          height={1000}
          alt="Todo Image"
          className="h-full object-cover rounded-tr rounded-br"
        />
      </div>
    </div>
  );
};

export default SignIn;
