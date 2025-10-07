import { useEffect, useState } from "react";
import { apiGet } from "./api";

export interface PublishOption {
  id: string;
  name: string;
}

export const asOptions = (data: any[]): PublishOption[] =>
  data.map((d) => ({ id: d.id, name: d.name }));

export const usePublishOptions = (endpoint: string) => {
  const [options, setOptions] = useState<PublishOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const res = await apiGet(endpoint);
        setOptions(asOptions(res));
      } catch (err) {
        console.error("Failed to fetch options:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [endpoint]);

  return { options, loading };
};

export default usePublishOptions;
