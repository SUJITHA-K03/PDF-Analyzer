import { useState } from "react";
import "./App.css";

const BACKEND_URL = "https://pdf-analyzer-213a.onrender.com";

const CARDS = [
  { key: "documentType", label: "Document Type", color: "#eef2ff", iconColor: "#4f46e5" },
  { key: "title",        label: "Title",         color: "#f0fdf4", iconColor: "#16a34a" },
  { key: "authors",      label: "Authors",       color: "#fffbeb", iconColor: "#d97706" },
  { key: "summary",      label: "Summary",       color: "#fdf4ff", iconColor: "#9333ea" },
  { key: "keyTakeaway",  label: "Key Takeaway",  color: "#f0f9ff", iconColor: "#0284c7" },
];

export default function App() {
  const [pdfUrl, setPdfUrl]   = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [history, setHistory] = useState([]);
  const [dark, setDark]       = useState(false);
  const [page, setPage]       = useState("home");

  const analyse = async () => {
    if (!pdfUrl.trim()) { setError("Please enter a PDF URL!"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        setHistory(p => [{
          url: pdfUrl,
          title: data.title,
          type: data.documentType,
          time: new Date().toLocaleTimeString()
        }, ...p].slice(0, 10));
      }
    } catch {
      setError("Server not reachable. Is Spring Boot running?");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const txt = CARDS.map(c => `${c.label}:\n${result[c.key] || "N/A"}`).join("\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
    a.download = "analysis-result.txt";
    a.click();
  };

  const d       = dark;
  const bg      = d ? "#0f172a" : "#f8f9ff";
  const sidebar = d ? "#1e293b" : "#ffffff";
  const card    = d ? "#1e293b" : "#ffffff";
  const border  = d ? "#334155" : "#e5e7eb";
  const text    = d ? "#f1f5f9" : "#111827";
  const muted   = d ? "#94a3b8" : "#6b7280";
  const accent  = "#4f46e5";

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Inter',sans-serif", background:bg, color:text }}>

      {/* ── Sidebar ── */}
      <div style={{ width:240, background:sidebar, borderRight:`1px solid ${border}`, padding:"24px 16px", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 10px", marginBottom:20 }}>
          <div style={{ width:42, height:42, background:"#eef2ff", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>📄</div>
          <div>
            <div style={{ fontWeight:800, fontSize:"1rem", color:text }}>PDF Analyzer</div>
            <div style={{ fontSize:"0.7rem", color:muted }}>AI Powered Analysis</div>
          </div>
        </div>

        {/* Nav */}
        {[["home","🏠","Home"],["history","🕐","History"],["about","ℹ️","About"]].map(([p,ic,lb]) => (
          <div key={p} className={`nav-item ${page===p ? "nav-active" : ""}`}
            style={{ color: page===p ? accent : muted }}
            onClick={() => setPage(p)}>
            {ic} {lb}
          </div>
        ))}

        {/* Tip */}
        <div style={{ marginTop:"auto" }}>
          <div style={{ background: d?"#0f172a":"#f0f9ff", border:`1px solid ${d?"#1e3a5f":"#bae6fd"}`, borderRadius:12, padding:"14px 16px" }}>
            <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#0284c7", marginBottom:4 }}>💡 Tip</div>
            <div style={{ fontSize:"0.78rem", color:muted, lineHeight:1.5 }}>Use a publicly accessible PDF URL for best results.</div>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, padding:"40px 52px", overflowY:"auto" }}>

        {/* Page Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:36 }}>
          <div>
            <h1 style={{ fontSize:"2rem", fontWeight:800, color:text, marginBottom:6 }}>
              {page==="home" ? "Analyze PDF Document" : page==="history" ? "Analysis History" : "About"}
            </h1>
            <p style={{ color:muted, fontSize:"0.9rem" }}>
              {page==="home"    ? "Enter a publicly accessible PDF URL and get AI-powered insights in seconds."
               : page==="history" ? "Your recent PDF analyses — click any row to re-analyse."
               : "About this tool."}
            </p>
          </div>
          <button onClick={() => setDark(!d)}
            style={{ background:"none", border:`1px solid ${border}`, borderRadius:10, padding:"8px 14px", cursor:"pointer", fontSize:"1rem", color:muted }}>
            {d ? "☀️" : "🌙"}
          </button>
        </div>

        {/* ── HOME ── */}
        {page==="home" && (
          <div>
            {/* Input */}
            <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"26px 30px", marginBottom:36 }}>
              <div style={{ fontWeight:700, fontSize:"0.95rem", color:text, marginBottom:16 }}>1. Enter PDF URL</div>
              <div style={{ display:"flex", gap:12, marginBottom:12 }}>
                <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, border:`1px solid ${border}`, borderRadius:10, padding:"0 16px", background:bg }}>
                  <span style={{ color:muted }}>🔗</span>
                  <input value={pdfUrl} onChange={e => setPdfUrl(e.target.value)}
                    onKeyDown={e => e.key==="Enter" && analyse()}
                    placeholder="https://example.com/document.pdf"
                    style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:"0.9rem", padding:"14px 0", color:text }} />
                </div>
                <button className="analyse-btn" onClick={analyse} disabled={loading}
                  style={{ padding:"14px 28px", background: loading?"#a5b4fc":accent, color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:"0.9rem", cursor: loading?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap" }}>
                  {loading ? <><div className="spinner" /> Analysing...</> : "✨ Analyze Document"}
                </button>
              </div>
              <div style={{ fontSize:"0.78rem", color:muted }}>ℹ️ Make sure the PDF is publicly accessible.</div>
              {error && (
                <div style={{ marginTop:12, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"12px 16px", color:"#dc2626", fontSize:"0.85rem", fontWeight:500 }}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Results */}
            {result && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:"1.4rem", color:text }}>Analysis Result</div>
                    <div style={{ fontSize:"0.83rem", color:muted, marginTop:3 }}>AI-generated summary and key insights from your document.</div>
                  </div>
                  <button className="dl-btn" onClick={download}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", border:`1px solid ${border}`, borderRadius:10, background:card, cursor:"pointer", fontSize:"0.85rem", color:accent, fontWeight:600, transition:"background 0.2s" }}>
                    ⬇️ Download Result
                  </button>
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  {CARDS.map((c, i) => (
                    <div key={c.key} className="result-card"
                      style={{ background: d?"#1e293b":c.color, border:`1px solid ${border}`, borderRadius:14, padding:"20px 24px", animationDelay:`${i*0.08}s`, display:"flex", alignItems:"flex-start" }}>
                      <div style={{ width:4, background:c.iconColor, borderRadius:"4px 0 0 4px", alignSelf:"stretch", marginRight:20, flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:"0.72rem", color: d?"#94a3b8":c.iconColor, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>
                          {c.label}
                        </div>
                        <div style={{ fontWeight: c.key==="summary"||c.key==="keyTakeaway" ? 500 : 700, fontSize:"1rem", color:text, lineHeight:1.7 }}>
                          {result[c.key] || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ textAlign:"center", marginTop:28, fontSize:"0.78rem", color:muted, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                  🔒 Your data is secure. We do not store any documents.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY ── */}
        {page==="history" && (
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, overflow:"hidden" }}>
            {history.length===0
              ? <div style={{ padding:56, textAlign:"center", color:muted, fontSize:"0.95rem" }}>No history yet. Analyse a PDF first!</div>
              : history.map((h, i) => (
                <div key={i} className="hist-row"
                  onClick={() => { setPdfUrl(h.url); setPage("home"); }}
                  style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 24px", borderBottom: i<history.length-1?`1px solid ${border}`:"none", cursor:"pointer" }}>
                  <div style={{ width:38, height:38, background:"#eef2ff", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", flexShrink:0 }}>📄</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:"0.88rem", color:text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{h.title||h.url}</div>
                    <div style={{ fontSize:"0.76rem", color:muted, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{h.url}</div>
                  </div>
                  <span style={{ fontSize:"0.72rem", padding:"4px 12px", borderRadius:20, background:"#eef2ff", color:accent, fontWeight:600, flexShrink:0 }}>{h.type||"PDF"}</span>
                  <span style={{ fontSize:"0.76rem", color:muted, flexShrink:0 }}>{h.time}</span>
                </div>
              ))
            }
          </div>
        )}

        {/* ── ABOUT ── */}
        {page==="about" && (
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"36px 40px", maxWidth:560 }}>
            <div style={{ fontSize:"2.5rem", marginBottom:16 }}>📄</div>
            <h2 style={{ fontWeight:800, fontSize:"1.4rem", marginBottom:8, color:text }}>PDF Analyzer</h2>
            <p style={{ color:muted, lineHeight:1.7, fontSize:"0.9rem", marginBottom:24 }}>
              An AI-powered PDF analysis tool built with React + Spring Boot. Paste any public PDF URL and get instant structured insights powered by Groq LLaMA.
            </p>
            {[
              ["⚡ Stack",       "React, Vite, Spring Boot, Java"],
              ["🤖 AI Model",    "Groq — LLaMA 3.1 8B Instant"],
              ["📦 PDF Parsing", "Apache PDFBox 3.x"],
              ["🔒 Privacy",     "No documents stored. Analysis only."],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", gap:16, marginBottom:14, fontSize:"0.9rem", alignItems:"flex-start" }}>
                <span style={{ fontWeight:700, color:text, minWidth:130 }}>{k}</span>
                <span style={{ color:muted }}>{v}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}