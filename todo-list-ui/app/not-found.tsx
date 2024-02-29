import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 text-center">
      <Image
        src={"/not-found-404.png"}
        width={600}
        height={600}
        alt="Not Found"
        className="h-full object-cover"
      />
      <Button>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
