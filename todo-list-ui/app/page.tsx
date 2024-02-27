import Image from "next/image";
import SignInForm from "./components/SignInForm";

export default function Home() {
  return (
    <div className="w-[800px] h-[400px] flex">
      <div className="w-[100%] flex justify-center items-center bg-white shadow-lg py-3 rounded-tl rounded-bl">
        <SignInForm />
      </div>
      <div className="w-[100%]">
        <Image
          src={"/todo-image.png"}
          width={600}
          height={800}
          alt="Todo Image"
          className="object-cover rounded-tr rounded-br"
        />
      </div>
    </div>
  );
}
