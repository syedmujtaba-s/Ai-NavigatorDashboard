// src/components/ChatDock.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatDock() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me to navigate (orders/customers/sales) or KPI like 'max sales this week'." }
  ]);
  const router = useRouter();

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { role: "user", content: text }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: text }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();

    if (data.type === "navigate" && data.ok) {
      setMessages(m => [...m, { role: "assistant", content: `Navigating to ${data.path}…` }]);
      router.push(data.path);
      return;
    }
    if (data.type === "kpi" && data.ok) {
      const { metric, agg, range, value } = data.data;
      setMessages(m => [
        ...m,
        { role: "assistant", content: `<b>${agg.toUpperCase()} ${metric}</b> for <code>${range}</code> is <b>${value}</b>.` }
      ]);
      return;
    }
    if (data.type === "filter" && data.ok) {
      setMessages(m => [...m, { role: "assistant", content: `Filter set: ${data.activeFilter.field} = ${data.activeFilter.value}.` }]);
      return;
    }
    if (data.type === "text") {
      setMessages(m => [...m, { role: "assistant", content: data.content }]);
    } else {
      setMessages(m => [...m, { role: "assistant", content: "Sorry, I couldn't do that." }]);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 rounded-2xl shadow-xl border bg-white z-50">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="font-medium">Navigator</span>
        <button onClick={()=>setOpen(!open)} className="text-sm">{open ? "–" : "+"}</button>
      </div>
      {open && (
        <div className="p-3">
          <div className="h-56 overflow-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block px-3 py-2 rounded-xl ${m.role==="user"?"bg-black text-white":"bg-gray-100"}`}>
                  <span dangerouslySetInnerHTML={{ __html: m.content }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none"
              placeholder="e.g. max sales this week"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter" && send()}
            />
            <button className="px-3 py-2 text-sm rounded-xl bg-black text-white" onClick={send}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
