// src/lib/usePublishOptions.ts
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export function usePublishOptions() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const res = await apiGet("/api/publish/wordpress"); // উদাহরণ
        if (ok) setData(res);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  return { data, loading };
}
