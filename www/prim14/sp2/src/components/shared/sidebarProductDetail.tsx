import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import "./sidebar.css";

export default function SidebarProductDetail() {
  const router = useRouter();
  return (
    <>
      <aside>
        <div className="flex gap-3 items-center">
          <Button onClick={() => router.push("/")}>Zpět</Button>
        </div>
      </aside>
    </>
  );
}
