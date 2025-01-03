import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { deleteProduct } from "@/services/productsService";
import { FaTrash } from "react-icons/fa";

export default function ProductDeleteDialogButton({
  productId,
  refreshProducts,
}: {
  productId: string;
  refreshProducts: () => Promise<void>;
}) {
  const { sendAuditableRequest } = useFetch();

  const handleDeleteProduct = async (id: string) => {
    const res = await sendAuditableRequest(deleteProduct, id);
    if (res.success) {
      await refreshProducts();
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-red-500 hover:bg-red-600">
            <FaTrash />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat produkt?</AlertDialogTitle>
            <AlertDialogDescription>
              Produkt bude smazán a nelze ho obnovit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteProduct(productId)}>
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
