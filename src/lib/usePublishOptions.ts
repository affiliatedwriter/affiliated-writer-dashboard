import { useEffect, useState } from "react";
import { apiGet } from "./api";

export interface PublishOption {
  id: string;
  name: string;
}

/**
 * Convert raw API data to standardized PublishOption[]
 */
export const asOptions = (data: any[]): PublishOption[] =>
  Array.isArray(data)
    ? data.map((d) => ({
        id: d?.id?.toString() ?? "",
        name: d?.name ?? "Unnamed",
      }))
    : [];

/**
 * React hook to fetch publishing options dynamically
 */
export const usePublishOptions = (endpoint: string) => {
  const [options, setOptions] = useState<PublishOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!endpoint) return;

    const fetchOptions = async () => {
      try {
        setLoading(true);
        const res = await apiGet(endpoint);
        const parsed = Array.isArray(res) ? res : [];
        setOptions(asOptions(parsed));
      } catch (err) {
        console.error("❌ Failed to fetch options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint]);

  return { options, loading };
};

/**
 * Default export for convenience
 */
export default usePublishOptions;
