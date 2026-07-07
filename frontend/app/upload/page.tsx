"use client";

import Header from "@/components/Header";
import { API_BASE_URL } from "@/lib/api";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file) {
      setMessage("Please choose a CSV file first.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    setMessage("Uploading...");
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: form
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.detail || "Upload failed");
      return;
    }
    setMessage(`${data.message}. Rows inserted: ${data.rows_inserted}`);
  }

  return (
    <>
      <Header title="Upload" subtitle="Upload inventory CSV to generate product, risk, and reorder intelligence." />
      <div className="card">
        <input className="input" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div style={{ height: 16 }} />
        <button className="button" onClick={upload}>Upload CSV</button>
        {message && <p>{message}</p>}
        <p className="label">Use sample_data/inventory_sample.csv from this repo for the demo.</p>
      </div>
    </>
  );
}
