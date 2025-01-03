import { BaseApiResponse } from "@/models/BaseApiResponse";
import { useToast } from "./use-toast";
import { FunctionType } from "@/types/FunctionType";

const useFetch = () => {
  const { toast } = useToast();

  const handleError = (error: Error) => {
    toast({
      title: "Chyba",
      description: error.message,
    });
  };

  async function sendRequest<
    T extends unknown[],
    R extends Promise<BaseApiResponse>
  >(req: FunctionType<T, R>, ...args: T): Promise<R> {
    try {
      return await req(...args);
    } catch (error) {
      const err = error as Error;
      handleError(err as Error);
      return {
        success: false,
        message: err.message,
      } as unknown as R;
    }
  }

  async function sendAuditableRequest<
    T extends unknown[],
    R extends Promise<BaseApiResponse>
  >(req: FunctionType<T, R>, ...args: T): Promise<R> {
    try {
      const res = await req(...args);
      toast({
        title: res.success ? "Úspěch" : "Chyba",
        description: res.message,
      });
      return res;
    } catch (error) {
      const err = error as Error;
      handleError(err as Error);
      return {
        success: false,
        message: err.message,
      } as unknown as R;
    }
  }

  return { sendRequest, sendAuditableRequest };
};

export default useFetch;
