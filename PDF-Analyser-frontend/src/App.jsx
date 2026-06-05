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

  const bg     = "#f8f9ff";
  const card   = "#ffffff";
  const border = "#e5e7eb";
  const text   = "#111827";
  const muted  = "#6b7280";
  const accent = "#4f46e5";

  const analyse = async () => {
    if (!pdfUrl.trim()) { setError("Please enter a PDF URL!"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/analyse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(`Request failed (${res.status}). Please check the PDF URL.`);
      } else if (data.error) {
        setError("Invalid or inaccessible PDF URL. Please try a public PDF link.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Server not reachable. Please try again later.");
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

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Inter',sans-serif", background:bg, color:text, padding:"40px 52px" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:36 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, background:"#eef2ff", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>📄</div>
          <div>
            <div style={{ fontWeight:800, fontSize:"1.2rem", color:text }}>PDF Analyzer</div>
            <div style={{ fontSize:"0.7rem", color:muted }}>AI Powered Analysis</div>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div style={{ marginBottom:36 }}>
        <h1 style={{ fontSize:"2rem", fontWeight:800, color:text, marginBottom:6 }}>Analyze PDF Document</h1>
        <p style={{ color:muted, fontSize:"0.9rem" }}>Enter a publicly accessible PDF URL and get AI-powered insights in seconds.</p>
      </div>

      {/* Input */}
      <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:"26px 30px", maxWidth:700, margin:"0 auto 36px auto" }}>
        <div style={{ fontWeight:700, fontSize:"0.95rem", color:text, marginBottom:16 }}>Enter PDF URL</div>
        <div style={{ display:"flex", gap:12, marginBottom:12 }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, border:`1px solid ${border}`, borderRadius:10, padding:"0 16px", background:bg }}>
            <span style={{ color:muted }}>🔗</span>
            <input value={pdfUrl} onChange={e => setPdfUrl(e.target.value)}
              onKeyDown={e => e.key==="Enter" && analyse()}
              placeholder="https://example.com/document.pdf"
              style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:"0.9rem", padding:"14px 0", color:text }} />
          </div>
          <button onClick={analyse} disabled={loading}
            style={{ padding:"14px 28px", background: loading?"#a5b4fc":accent, color:"#fff", border:"none", borderRadius:10, fontWeight:700, fontSize:"0.9rem", cursor: loading?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap" }}>
            {loading ? "⏳ Analysing..." : "✨ Analyze Document"}
          </button>
        </div>
        <div style={{ fontSize:"0.78rem", color:muted }}>ℹ️ Make sure the PDF is publicly accessible.</div>
        {loading && (
          <div style={{ textAlign:"center", color:muted, fontSize:"0.85rem", marginTop:12 }}>
            ⏳ This may take 30-60 seconds on first request...
          </div>
        )}
        {error && (
          <div style={{ marginTop:12, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"12px 16px", color:"#dc2626", fontSize:"0.85rem", fontWeight:500 }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:"1.4rem", color:text }}>Analysis Result</div>
              <div style={{ fontSize:"0.83rem", color:muted, marginTop:3 }}>AI-generated summary and key insights.</div>
            </div>
            <button onClick={download}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", border:`1px solid ${border}`, borderRadius:10, background:card, cursor:"pointer", fontSize:"0.85rem", color:accent, fontWeight:600 }}>
              ⬇️ Download Result
            </button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {CARDS.map((c) => (
              <div key={c.key}
                style={{ background:c.color, border:`1px solid ${border}`, borderRadius:14, padding:"20px 24px", display:"flex", alignItems:"flex-start" }}>
                <div style={{ width:4, background:c.iconColor, borderRadius:"4px 0 0 4px", alignSelf:"stretch", marginRight:20, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"0.72rem", color:c.iconColor, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>
                    {c.label}
                  </div>
                  <div style={{ fontWeight: c.key==="summary"||c.key==="keyTakeaway" ? 500 : 700, fontSize:"1rem", color:text, lineHeight:1.7 }}>
                    {result[c.key] || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:28, fontSize:"0.78rem", color:muted }}>
            🔒 Your data is secure. We do not store any documents.
          </div>
        </div>
      )}
    </div>
  );
}