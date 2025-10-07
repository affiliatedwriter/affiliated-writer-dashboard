const base = process.env.NEXT_PUBLIC_API_BASE;

export const api = {
  async apiPost(path: string, data: any) {
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to connect to server");
    return res.json();
  },
};
