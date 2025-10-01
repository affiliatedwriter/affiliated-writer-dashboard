"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (!params?.id) return;
    api.get(`/api/article/render/${params.id}`).then(setArticle);
  }, [params?.id]);

  if (!article) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">{article.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: article.html }} />
    </div>
  );
}
