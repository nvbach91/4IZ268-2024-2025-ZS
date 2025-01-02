import ILookup from "@/models/ILookup";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { getAvailabilityLookups } from "@/services/lookupService";

const useAvailabilityLookups = () => {
  const { sendRequest } = useFetch();
  const [availabilities, setAvailabilities] = useState<ILookup[]>();

  const fetchLookups = async () => {
    const resConditions = await sendRequest(getAvailabilityLookups);
    if (resConditions.success) {
      setAvailabilities(resConditions.data);
    }
  };

  useEffect(() => {
    fetchLookups();
  }, []);

  return { availabilities };
};

export default useAvailabilityLookups;
