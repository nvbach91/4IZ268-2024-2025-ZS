import ILookup from "@/models/ILookup";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { getConditionLookups } from "@/services/lookupService";

const useConditionLookups = () => {
  const { sendRequest } = useFetch();
  const [conditions, setConditions] = useState<ILookup[]>();

  const fetchLookups = async () => {
    const resConditions = await sendRequest(getConditionLookups);
    if (resConditions.success) {
      setConditions(resConditions.data);
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  return { conditions };
};

export default useConditionLookups;
