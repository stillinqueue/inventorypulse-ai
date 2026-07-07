"use client";

import Header from "@/components/Header";
import { apiPost } from "@/lib/api";
import { useState } from "react";

const examples = [
  "Which products should be reordered?",
  "Which products are high stockout risk?",
  "Give me supplier overview",
  "Summarize inventory health"
];

export default function AssistantPage() {
  const [question, setQuestion] = useState("Which products should be reordered?");
  const [answer, setAnswer] = useState("");

  async function ask() {
    setAnswer("Thinking...");
    const data = await apiPost("/assistant", { question });
    setAnswer(data.answer);
  }

  return (
    <>
      <Header title="AI Assistant" subtitle="Ask inventory questions in plain English. MVP uses rule-based retrieval; OpenAI/RAG can be plugged in next." />
      <div className="card">
        <textarea rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} />
        <div style={{ height: 12 }} />
        <button className="button" onClick={ask}>Ask Assistant</button>
        <div style={{ height: 16 }} />
        <div className="label">Try:</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {examples.map((ex) => (
            <button key={ex} className="button" onClick={() => setQuestion(ex)}>{ex}</button>
          ))}
        </div>
      </div>

      {answer && (
        <>
          <div style={{ height: 20 }} />
          <div className="card">
            <h2>Answer</h2>
            <div className="chat-answer">{answer}</div>
          </div>
        </>
      )}
    </>
  );
}
