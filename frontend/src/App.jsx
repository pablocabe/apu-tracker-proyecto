import { useState, useEffect } from "react";

const API = "https://apu-tracker-proyecto.onrender.com";

const SUBJECTS = {
  CNE: { name: "Expresión de Problemas y Algoritmos", short: "Expr. Algoritmos", year: 0, sem: 0, prereqs: [] },
  CNC: { name: "Conceptos de Organización de Computadoras", short: "Org. Computadoras (intro)", year: 0, sem: 0, prereqs: [] },
  CNM: { name: "Matemática 0", short: "Matemática 0", year: 0, sem: 0, prereqs: [] },
  SI106: { name: "Conceptos de Algoritmos, Datos y Programas", short: "Algoritmos y Datos", year: 1, sem: 1, prereqs: ["CNE","CNC","CNM"] },
  SI104: { name: "Organización de Computadoras", short: "Org. Computadoras", year: 1, sem: 1, prereqs: ["CNE","CNC","CNM"] },
  SI101: { name: "Matemática 1", short: "Matemática 1", year: 1, sem: 1, prereqs: ["CNE","CNC","CNM"] },
  SI107: { name: "Taller de Programación", short: "Taller de Prog.", year: 1, sem: 2, prereqs: ["SI106"] },
  SI105: { name: "Arquitectura de Computadoras", short: "Arquitectura", year: 1, sem: 2, prereqs: ["SI104"] },
  SI102: { name: "Matemática 2", short: "Matemática 2", year: 1, sem: 2, prereqs: ["SI101"] },
  SI209: { name: "Fundamentos de Organización de Datos", short: "Fund. Org. Datos", year: 2, sem: 3, prereqs: ["SI107"] },
  SI203: { name: "Algoritmos y Estructuras de Datos", short: "Algoritmos y Estruct.", year: 2, sem: 3, prereqs: ["SI102","SI107"] },
  SI207: { name: "Seminario de Lenguajes", short: "Seminario Lenguajes", year: 2, sem: 3, prereqs: ["SI107"] },
  SI210: { name: "Diseño de Bases de Datos", short: "Diseño BD", year: 2, sem: 4, prereqs: ["SI209"] },
  SI202: { name: "Ingeniería de Software 1", short: "Ing. Software 1", year: 2, sem: 4, prereqs: ["SI107"] },
  SI206: { name: "Orientación a Objetos 1", short: "OO 1", year: 2, sem: 4, prereqs: ["SI107"] },
  SI204: { name: "Introducción a los Sistemas Operativos", short: "Sist. Operativos", year: 2, sem: 4, prereqs: ["SI107","SI105"] },
  SI208: { name: "Taller de Lecto-comprensión en Inglés", short: "Inglés", year: 2, sem: 4, prereqs: ["CNE","CNC","CNM"], note: "Obligatorio aprobar antes de 3er año" },
  SI308: { name: "Matemática 3", short: "Matemática 3", year: 3, sem: 5, prereqs: ["SI102"] },
  SI302: { name: "Ingeniería de Software 2", short: "Ing. Software 2", year: 3, sem: 5, prereqs: ["SI202","SI208"] },
  SI307: { name: "Orientación a Objetos 2", short: "OO 2", year: 3, sem: 5, prereqs: ["SI206","SI208"] },
  SI301: { name: "Programación Concurrente", short: "Prog. Concurrente", year: 3, sem: 6, prereqs: ["SI204","SI207","SI208"] },
  SI305: { name: "Proyecto de Software", short: "Proyecto Software", year: 3, sem: 6, prereqs: ["SI210","SI202","SI203","SI207","SI208","SI206"] },
  "07301": { name: "Taller de Tecnologías de Producción de Software", short: "Taller TPS", year: 3, sem: 6, prereqs: ["SI210","SI203","SI204","SI206","SI208","SI302"] },
  SI306: { name: "Conceptos y Paradigmas de Lenguajes", short: "Paradigmas", year: 3, sem: 5, prereqs: ["SI203","SI207","SI208"], elective: true },
  SI304: { name: "Redes y Comunicaciones", short: "Redes", year: 3, sem: 6, prereqs: ["SI102","SI204","SI208"], elective: true },
  S0303: { name: "Bases de Datos I", short: "BD I", year: 3, sem: 5, prereqs: ["SI210","SI208"], elective: true },
  S0410: { name: "Sistemas y Organizaciones", short: "Sist. y Org.", year: 3, sem: 6, prereqs: ["SI210","SI202","SI208"], elective: true },
};

const SEMESTERS = [
  { label: "Ingreso", sems: [0], yearLabel: "Nivelación" },
  { label: "1° Semestre", sems: [1], yearLabel: "1° Año" },
  { label: "2° Semestre", sems: [2], yearLabel: "1° Año" },
  { label: "3° Semestre", sems: [3], yearLabel: "2° Año" },
  { label: "4° Semestre", sems: [4], yearLabel: "2° Año" },
  { label: "5° Semestre", sems: [5], yearLabel: "3° Año" },
  { label: "6° Semestre", sems: [6], yearLabel: "3° Año" },
];

const STATUS_CYCLE = ["pendiente", "regular", "aprobada"];
const STATUS_CONFIG = {
  pendiente: { label: "Pendiente", color: "#1e293b", border: "#334155", text: "#64748b", badge: null },
  regular:   { label: "Regular",   color: "#1c3a5e", border: "#3b82f6", text: "#93c5fd", badge: "R" },
  aprobada:  { label: "Aprobada",  color: "#14382a", border: "#22c55e", text: "#86efac", badge: "✓" },
};

function canTake(code, statuses) {
  return SUBJECTS[code].prereqs.every(p => statuses[p] === "regular" || statuses[p] === "aprobada");
}

// ── Auth Screen ───────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API}/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ocurrió un error.");
      } else {
        localStorage.setItem("apu_token", data.token);
        localStorage.setItem("apu_email", data.email);
        onLogin(data.token, data.email);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0f1a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div style={{
        background: "#111827", border: "1px solid #1e293b",
        borderRadius: 16, padding: 40, width: "100%", maxWidth: 400,
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>Plan de Estudios APU</h1>
          <p style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>FACULTAD DE INFORMÁTICA · UNLP</p>
        </div>

        <div style={{ display: "flex", marginBottom: 24, background: "#1e293b", borderRadius: 8, padding: 4 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null); }} style={{
              flex: 1, padding: "8px 0", border: "none", borderRadius: 6, cursor: "pointer",
              background: mode === m ? "#3b82f6" : "transparent",
              color: mode === m ? "#fff" : "#64748b",
              fontWeight: 600, fontSize: 13, transition: "all 0.2s",
            }}>
              {m === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{
              background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
              padding: "12px 14px", color: "#e2e8f0", fontSize: 14, outline: "none",
            }}
          />
          <input
            type="password" placeholder="Contraseña" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{
              background: "#1e293b", border: "1px solid #334155", borderRadius: 8,
              padding: "12px 14px", color: "#e2e8f0", fontSize: 14, outline: "none",
            }}
          />
          {error && <div style={{ color: "#f87171", fontSize: 13 }}>⚠ {error}</div>}
          <button onClick={submit} disabled={loading} style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "12px 0", fontWeight: 700, fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1, marginTop: 4,
          }}>
            {loading ? "Cargando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Subject Card ──────────────────────────────────────────────────────────────
function SubjectCard({ code, statuses, onCycle, saving }) {
  const subject = SUBJECTS[code];
  const status = statuses[code] || "pendiente";
  const cfg = STATUS_CONFIG[status];
  const available = canTake(code, statuses);
  const isSaving = saving === code;
  const missingPrereqs = subject.prereqs.filter(p => !statuses[p] || statuses[p] === "pendiente");

  return (
    <div
      onClick={() => onCycle(code)}
      title={missingPrereqs.length ? `Falta: ${missingPrereqs.map(p => SUBJECTS[p]?.short || p).join(", ")}` : subject.name}
      style={{
        background: cfg.color, border: `2px solid ${cfg.border}`, borderRadius: "10px",
        padding: "10px 12px", cursor: available || status !== "pendiente" ? "pointer" : "not-allowed",
        opacity: isSaving ? 0.6 : (!available && status === "pendiente" ? 0.45 : 1),
        transition: "all 0.2s ease",
        boxShadow: status !== "pendiente" ? `0 0 8px ${cfg.border}44` : "none", minWidth: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "10px", color: "#475569", fontFamily: "monospace", marginBottom: 2 }}>{code}</div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: cfg.text, lineHeight: 1.3 }}>
            {isSaving ? "Guardando..." : subject.short}
          </div>
          {subject.elective && <div style={{ fontSize: "10px", marginTop: 3, color: "#f59e0b", fontWeight: 600 }}>ELECTIVA</div>}
          {subject.note && <div style={{ fontSize: "9px", marginTop: 3, color: "#fbbf24", opacity: 0.8 }}>⚠ {subject.note}</div>}
        </div>
        {cfg.badge && (
          <div style={{
            background: cfg.border, color: "#fff", borderRadius: "50%",
            width: 20, height: 20, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0,
          }}>{cfg.badge}</div>
        )}
      </div>
      {!available && status === "pendiente" && missingPrereqs.length > 0 && (
        <div style={{ fontSize: "9px", color: "#475569", marginTop: 4 }}>
          Falta: {missingPrereqs.slice(0,2).map(p => SUBJECTS[p]?.short || p).join(", ")}{missingPrereqs.length > 2 ? "..." : ""}
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function APUTracker() {
  const [token, setToken] = useState(() => localStorage.getItem("apu_token"));
  const [email, setEmail] = useState(() => localStorage.getItem("apu_email"));
  const [statuses, setStatuses] = useState({});
  const [saving, setSaving] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogin = (t, e) => { setToken(t); setEmail(e); };

  const logout = () => {
    localStorage.removeItem("apu_token");
    localStorage.removeItem("apu_email");
    setToken(null); setEmail(null); setStatuses({});
  };

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    fetch(`${API}/materias`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.status === 401) { logout(); return null; } return r.json(); })
      .then(data => {
        if (!data) return;
        const map = {};
        data.forEach(m => { map[m.codigo] = m.estado; });
        setStatuses(map);
        setLoading(false);
      })
      .catch(() => { setError("No se pudo conectar con el servidor."); setLoading(false); });
  }, [token]);

  const cycleStatus = async (code) => {
    const current = statuses[code] || "pendiente";
    if (!canTake(code, statuses) && current === "pendiente") return;
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    setStatuses(prev => ({ ...prev, [code]: next }));
    setSaving(code);
    try {
      if (next === "pendiente") {
        await fetch(`${API}/materias/${code}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      } else {
        await fetch(`${API}/materias/${code}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ estado: next }),
        });
      }
    } catch {
      setStatuses(prev => ({ ...prev, [code]: current }));
    } finally {
      setSaving(null);
    }
  };

  // Progreso: regular = 0.5 puntos, aprobada = 1 punto por materia (excluye nivelación)
  const subjectsSinNivelacion = Object.entries(SUBJECTS).filter(([, s]) => s.sem > 0);
  const totalSubjects = subjectsSinNivelacion.length;
  const progressPoints = subjectsSinNivelacion.reduce((acc, [code]) => {
    const st = statuses[code] || "pendiente";
    return acc + (st === "aprobada" ? 1 : st === "regular" ? 0.5 : 0);
  }, 0);
  const progressPct = Math.round((progressPoints / totalSubjects) * 100);
  const approvedCount = Object.values(statuses).filter(s => s === "aprobada").length;
  const regularCount = Object.values(statuses).filter(s => s === "regular").length;
  const availableCount = Object.keys(SUBJECTS).filter(c => (statuses[c] || "pendiente") === "pendiente" && canTake(c, statuses)).length;

  if (!token) return <AuthScreen onLogin={handleLogin} />;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontFamily: "sans-serif" }}>
      Cargando materias...
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", fontFamily: "sans-serif", textAlign: "center", padding: 32 }}>
      ⚠️ {error}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e2e8f0", padding: "24px 40px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div style={{ maxWidth: "100%", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
            <div style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 10, padding: "6px 10px", fontSize: 20 }}>🎓</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>Plan de Estudios — APU</h1>
              <div style={{ fontSize: 12, color: "#64748b" }}>FACULTAD DE INFORMÁTICA · UNLP</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>{email}</span>
              <button onClick={logout} style={{
                background: "#1e293b", border: "1px solid #334155", borderRadius: 6,
                padding: "6px 12px", color: "#64748b", fontSize: 12, cursor: "pointer",
              }}>Salir</button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            {[
              { label: "Disponibles", val: availableCount, color: "#3b82f6" },
              { label: "Regulares", val: regularCount, color: "#f59e0b" },
              { label: "Aprobadas", val: approvedCount, color: "#22c55e" },
              { label: "Progreso", val: `${progressPct}%`, color: "#8b5cf6", note: "regular vale 50%" },
            ].map(s => (
              <div key={s.label} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 16px" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{s.label}</div>
                {s.note && <div style={{ fontSize: 10, color: "#334155" }}>{s.note}</div>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, background: "#1e293b", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${progressPct}%`, height: "100%", background: "linear-gradient(90deg, #3b82f6, #22c55e)", borderRadius: 99, transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Leyenda */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#475569" }}>Clic para cambiar estado:</span>
          {Object.entries(STATUS_CONFIG).map(([s, c]) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: c.border }} />
              <span style={{ fontSize: 12, color: "#64748b" }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Semestres */}
        {SEMESTERS.map(({ label, sems, yearLabel }) => {
          const semSubjects = Object.entries(SUBJECTS).filter(([, s]) => sems.includes(s.sem) && !s.elective);
          const electivesHere = sems.includes(5) || sems.includes(6);
          const electiveSubjects = electivesHere ? Object.entries(SUBJECTS).filter(([, s]) => sems.includes(s.sem) && s.elective) : [];

          return (
            <div key={label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ background: "#1e293b", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{yearLabel}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>{label}</div>
                <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                {semSubjects.map(([code]) => (
                  <SubjectCard key={code} code={code} statuses={statuses} onCycle={cycleStatus} saving={saving} />
                ))}
                {electiveSubjects.length > 0 && (
                  <div style={{ gridColumn: "1 / -1", marginTop: 4, padding: "10px", background: "#0f1e2d", border: "1px dashed #1e3a52", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600, marginBottom: 8 }}>★ ELEGIR UNA ELECTIVA</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                      {electiveSubjects.map(([code]) => (
                        <SubjectCard key={code} code={code} statuses={statuses} onCycle={cycleStatus} saving={saving} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
