import { useState } from "react";
import "./App.css";

const BACKEND_URL = "https://pdf-analyzer-213a.onrender.com";

const CARDS = [
  { key: "documentType", label: "Document Type", accent: "#7c3aed" },
  { key: "title",        label: "Title",         accent: "#0891b2" },
  { key: "authors",      label: "Authors",       accent: "#059669" },
  { key: "summary",      label: "Summary",       accent: "#d97706" },
  { key: "keyTakeaway",  label: "Key Takeaway",  accent: "#e11d48" },
];

export default function App() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg, #fdf4ff 0%, #eff6ff 50%, #f0fdf4 100%)", fontFamily:"'Inter',sans-serif" }}>

      {/* Navbar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px 48px", background:"rgba(255,255,255,0.7)", backdropFilter:"blur(10px)", borderBottom:"1px solid rgba(0,0,0,0.06)", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ width:36, height:36, background:"linear-gradient(135deg,#7c3aed,#ec4899)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", color:"#fff", fontWeight:900 }}>✦</div>
        <div>
          <span style={{ fontWeight:800, fontSize:"1.1rem", color:"#1e1b4b" }}>PDF </span>
          <span style={{ fontWeight:800, fontSize:"1.1rem", color:"#7c3aed" }}>Analyzer</span>
        </div>
        <div style={{ marginLeft:12, fontSize:"0.72rem", color:"#9ca3af" }}>AI powered insights from your documents</div>
      </div>

      {/* Hero */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 48px 40px", gap:60 }}>

        {/* Left */}
        <div style={{ maxWidth:560, flex:1 }}>
          <div style={{ display:"inline-block", fontSize:"0.72rem", color:"#7c3aed", fontWeight:700, letterSpacing:"2px", marginBottom:16, background:"#f3e8ff", padding:"4px 14px", borderRadius:20 }}>✦ AI DOCUMENT ANALYSIS</div>
          <h1 style={{ fontSize:"3rem", fontWeight:900, color:"#1e1b4b", lineHeight:1.2, marginBottom:16 }}>
            Analyze any <span style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>PDF</span>
          </h1>
          <p style={{ color:"#6b7280", fontSize:"1rem", lineHeight:1.7, marginBottom:32 }}>
            Paste a publicly accessible PDF URL and let AI extract key insights for you.
          </p>

          {/* Input */}
          <div style={{ display:"flex", gap:12, marginBottom:12 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, background:"#fff", border:"2px solid #e9d5ff", borderRadius:12, padding:"0 16px", boxShadow:"0 4px 20px rgba(124,58,237,0.08)" }}>
              <span style={{ color:"#9ca3af", fontSize:"1rem" }}>🔗</span>
              <input
                value={pdfUrl}
                onChange={e => setPdfUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && analyse()}
                placeholder="https://arxiv.org/pdf/1706.03762"
                style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:"0.9rem", padding:"16px 0", color:"#1e1b4b" }}
              />
              {pdfUrl && (
                <span onClick={() => setPdfUrl("")} style={{ color:"#9ca3af", cursor:"pointer", fontSize:"1.2rem" }}>×</span>
              )}
            </div>
            <button
              onClick={analyse}
              disabled={loading}
              style={{ padding:"16px 28px", background: loading ? "#c4b5fd" : "linear-gradient(135deg,#7c3aed,#ec4899)", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:"0.9rem", cursor: loading ? "not-allowed" : "pointer", whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(124,58,237,0.35)" }}>
              {loading ? "⏳ Analysing..." : "✦ Analyze Document"}
            </button>
          </div>

          <div style={{ fontSize:"0.75rem", color:"#9ca3af", display:"flex", alignItems:"center", gap:6 }}>
            🛡 The PDF must be publicly accessible. Your data is secure and not stored.
          </div>

          {loading && (
            <div style={{ marginTop:12, fontSize:"0.82rem", color:"#7c3aed" }}>
              ⏳ First request may take 30-60 seconds...
            </div>
          )}

          {error && (
            <div style={{ marginTop:12, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10, padding:"12px 16px", color:"#dc2626", fontSize:"0.85rem" }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Right illustration */}
        <div style={{ flexShrink:0, width:220, height:220, position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:160, height:200, background:"#fff", border:"2px solid #e9d5ff", borderRadius:20, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, boxShadow:"0 8px 40px rgba(124,58,237,0.12)" }}>
            <div style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899)", borderRadius:8, padding:"8px 18px", fontWeight:800, color:"#fff", fontSize:"1rem" }}>PDF</div>
            {[80,60,70].map((w,i) => (
              <div key={i} style={{ height:8, width:`${w}%`, background:"#f3e8ff", borderRadius:4 }} />
            ))}
          </div>
          <div style={{ position:"absolute", bottom:10, right:10, width:52, height:52, background:"linear-gradient(135deg,#7c3aed,#ec4899)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", boxShadow:"0 4px 20px rgba(124,58,237,0.4)" }}>🔍</div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div style={{ maxWidth:700, margin:"0 auto", padding:"0 48px 60px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:"1.3rem", color:"#1e1b4b" }}>Analysis Result</div>
              <div style={{ fontSize:"0.82rem", color:"#9ca3af", marginTop:3 }}>AI-generated insights from your document.</div>
            </div>
            <button onClick={download}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", border:"2px solid #e9d5ff", borderRadius:10, background:"#fff", cursor:"pointer", fontSize:"0.85rem", color:"#7c3aed", fontWeight:600 }}>
              ⬇️ Download
            </button>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {CARDS.map((c) => (
              <div key={c.key} style={{ background:"#fff", border:"2px solid #f3e8ff", borderRadius:14, padding:"20px 24px", display:"flex", alignItems:"flex-start", boxShadow:"0 2px 12px rgba(124,58,237,0.06)" }}>
                <div style={{ width:4, background:c.accent, borderRadius:4, alignSelf:"stretch", marginRight:20, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"0.7rem", color:c.accent, fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", marginBottom:8 }}>
                    {c.label}
                  </div>
                  <div style={{ fontWeight: c.key==="summary"||c.key==="keyTakeaway" ? 400 : 600, fontSize:"0.95rem", color:"#374151", lineHeight:1.7 }}>
                    {result[c.key] || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:24, fontSize:"0.75rem", color:"#9ca3af" }}>
            🔒 Your data is secure. We do not store any documents.
          </div>
        </div>
      )}
    </div>
  );
}