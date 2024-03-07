import Image from "next/image";
import { Noto_Sans_Cham } from "next/font/google";
import { cn } from "@/lib/utils";

const notoSansCham = Noto_Sans_Cham({ subsets: ["latin"] });

const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className={cn("w-[820px] h-[500px] flex", notoSansCham.className)}>
        <div className="w-[100%] flex justify-center items-center sm:p-4 bg-white shadow-lg py-3 rounded-tl rounded-bl">
          {children}
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

export default AuthLayout;