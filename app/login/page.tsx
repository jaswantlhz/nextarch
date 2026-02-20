"use client"
import { loginaction } from "../actions/login";
import { useActionState } from "react";
import { useState } from "react";
import { PieChart } from "lucide-react";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginaction, null);
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`login-root${isDark ? " dark" : ""}`}>
      {/* Grid background */}
      <div className="login-grid" />

      {/* Corner decoratives */}
      <div className="login-corner-tl">
        <span className="login-coord">LAT: 40.7128 N</span>
        <span className="login-coord">LNG: 74.0060 W</span>
      </div>
      <div className="login-corner-tr">
        <span className="login-coord-right">SYS: ONLINE</span>
        <span className="login-coord-right">VER: 4.0.0.128</span>
      </div>
      <div className="login-corner-bl">
        <span className="login-coord">X: 1042.029 // Y: 9283.111</span>
      </div>

      {/* Theme toggle button — top right, below corner text */}
      <button
        className="login-theme-toggle"
        onClick={() => setIsDark(!isDark)}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle theme"
      >
        {isDark ? (
          /* Sun icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          /* Moon icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        <span className="login-theme-label">{isDark ? "LIGHT" : "DARK"}</span>
      </button>

      {/* Watermark */}
      <div className="login-watermark">PRECISION</div>

      {/* Decorative SVG icons on left and right */}
      <div className="login-deco-left">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          <line x1="30" y1="0" x2="0" y2="80" stroke="#3b82f6" strokeWidth="2" />
          <line x1="30" y1="0" x2="60" y2="80" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="30" cy="0" r="4" fill="#3b82f6" />
        </svg>
      </div>
      <div className="login-deco-left-grid">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          {[0, 20, 40, 60].map(x => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="60" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
          ))}
          {[0, 20, 40, 60].map(y => (
            <line key={`h${y}`} x1="0" y1={y} x2="60" y2={y} stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
          ))}
        </svg>
      </div>
      <div className="login-deco-right">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <rect x="0" y="35" width="50" height="15" stroke="#6366f1" strokeWidth="1.5" fill="none" />
          <line x1="0" y1="35" x2="15" y2="0" stroke="#6366f1" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="login-deco-ruler">
        <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
          <rect x="0" y="10" width="120" height="30" rx="3" stroke="#6366f1" strokeWidth="1.5" fill="none" />
          {[0, 15, 30, 45, 60, 75, 90, 105, 120].map((x, i) => (
            <line key={i} x1={x} y1="10" x2={x} y2={i % 2 === 0 ? "25" : "20"} stroke="#6366f1" strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/* Main centered content */}
      <div className="login-center">

        {/* Logo / Title */}
        <div className="login-logo-block">
          <div className="login-logo-icon">
            <PieChart size={30} color="#3b82f6" strokeWidth={1.75} />
          </div>
          <span className="login-logo-title">NextArch Precision</span>
        </div>
        <div className="login-subtitle">PRECISION WORKSPACE // V 4.0</div>

        {/* Card */}
        <div className="login-card">
          <form action={formAction}>
            {/* Operator Identity */}
            <div className="login-field-group">
              <label className="login-label">OPERATOR IDENTITY</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="login_email"
                  className="login-input"
                  placeholder="example@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Access Key */}
            <div className="login-field-group">
              <label className="login-label">ACCESS KEY</label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="login_pass"
                  className="login-input"
                  placeholder="••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error message */}
            {state?.error && (
              <div className="login-error">{state.error}</div>
            )}

            {/* Remember + Forgot row */}
            <div className="login-row-between">
              <label className="login-checkbox-label">
                <input type="checkbox" className="login-checkbox" />
                <span>Persistent Link</span>
              </label>
              <button type="button" className="login-link-btn">Reset Protocol</button>
            </div>

            {/* Submit */}
            <button type="submit" className="login-submit-btn">
              INITIALIZE SESSION &nbsp;→
            </button>
          </form>

          <div className="login-divider-label">INTEGRATE ENVIRONMENT</div>

          {/* Social / OAuth buttons */}
          <div className="login-social-row">
            <button className="login-social-btn" title="Google">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
            <button className="login-social-btn" title="GitHub">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="login-github-icon">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </button>
            <button className="login-social-btn" title="Microsoft">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="1" width="10" height="10" fill="#f25022" />
                <rect x="13" y="1" width="10" height="10" fill="#7fba00" />
                <rect x="1" y="13" width="10" height="10" fill="#00a4ef" />
                <rect x="13" y="13" width="10" height="10" fill="#ffb900" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <span className="login-footer-dot" />
          SECURE ARCHITECTURAL NODE #291
        </div>
        <div className="login-footer-links">
          <a href="#" className="login-footer-link">TERMS_OF_USE</a>
          <span className="login-footer-sep">//</span>
          <a href="#" className="login-footer-link">DATA_ENCRYPTION</a>
          <span className="login-footer-sep">//</span>
          <a href="#" className="login-footer-link">SUPPORT_COMMS</a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Inter:wght@400;500;600&display=swap');

        /* ═══════════════════════════════════
           BASE (LIGHT THEME)
        ═══════════════════════════════════ */
        .login-root {
          min-height: 100vh;
          min-width: 100vw;
          background: #f0f4f8;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Share Tech Mono', monospace;
          transition: background 0.3s;
        }

        /* Grid */
        .login-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
          transition: background-image 0.3s;
        }

        /* Corner readouts */
        .login-corner-tl {
          position: fixed;
          top: 18px;
          left: 18px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 10;
        }
        .login-corner-tr {
          position: fixed;
          top: 18px;
          right: 18px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          z-index: 10;
        }
        .login-corner-bl {
          position: fixed;
          bottom: 18px;
          left: 18px;
          z-index: 10;
        }
        .login-coord, .login-coord-right {
          font-size: 11px;
          color: #2563eb;
          letter-spacing: 0.05em;
          transition: color 0.3s;
        }

        /* ─── Theme Toggle Button ─── */
        .login-theme-toggle {
          position: fixed;
          top: 64px;
          right: 18px;
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 20px;
          padding: 6px 14px 6px 10px;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #475569;
          letter-spacing: 0.12em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, color 0.3s, box-shadow 0.2s;
        }
        .login-theme-toggle:hover {
          border-color: #3b82f6;
          color: #2563eb;
          box-shadow: 0 4px 14px rgba(59,130,246,0.18);
        }
        .login-theme-label {
          font-size: 10px;
          letter-spacing: 0.15em;
        }

        /* Watermark */
        .login-watermark {
          position: fixed;
          right: -40px;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          font-size: 90px;
          font-weight: 900;
          color: rgba(99,102,241,0.08);
          letter-spacing: 0.15em;
          pointer-events: none;
          z-index: 0;
          user-select: none;
          transition: color 0.3s;
        }

        /* Decorative elements */
        .login-deco-left {
          position: fixed; top: 45px; left: 44px;
          z-index: 1; opacity: 0.4;
        }
        .login-deco-left-grid {
          position: fixed; bottom: 160px; left: 220px;
          z-index: 1; opacity: 0.25;
        }
        .login-deco-right {
          position: fixed; top: 160px; right: 220px;
          z-index: 1; opacity: 0.35;
        }
        .login-deco-ruler {
          position: fixed; bottom: 60px; right: 80px;
          z-index: 1; opacity: 0.3;
        }

        /* Center layout */
        .login-center {
          position: relative; z-index: 5;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          width: 100%; max-width: 440px;
          padding: 20px 16px;
        }

        /* Logo */
        .login-logo-block {
          display: flex; align-items: center; gap: 10px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 22px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: background 0.3s, border-color 0.3s;
        }
        .login-logo-icon { display: flex; align-items: center; }
        .login-logo-title {
          font-family: 'Inter', sans-serif;
          font-size: 20px; font-weight: 600;
          color: #1e293b; letter-spacing: 0.01em;
          transition: color 0.3s;
        }
        .login-subtitle {
          font-size: 11px; color: #64748b;
          letter-spacing: 0.25em; margin-bottom: 4px;
          transition: color 0.3s;
        }

        /* Card */
        .login-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 28px 28px 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }

        /* Fields */
        .login-field-group { margin-bottom: 18px; }
        .login-label {
          display: block; font-size: 11px; color: #64748b;
          letter-spacing: 0.2em; margin-bottom: 8px;
          transition: color 0.3s;
        }
        .login-input-wrapper {
          display: flex; align-items: center;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px; padding: 0 14px; height: 46px;
          transition: border-color 0.2s, background 0.3s;
        }
        .login-input-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.12);
        }
        .login-input-icon {
          margin-right: 10px; display: flex; align-items: center;
          opacity: 0.5; color: #475569;
          transition: color 0.3s;
        }
        .login-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px; color: #1e293b; letter-spacing: 0.1em;
          transition: color 0.3s;
        }
        .login-input::placeholder { color: #94a3b8; }

        /* Row */
        .login-row-between {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 20px;
        }
        .login-checkbox-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: #64748b;
          cursor: pointer; user-select: none;
          transition: color 0.3s;
        }
        .login-checkbox { accent-color: #3b82f6; width: 14px; height: 14px; }
        .login-link-btn {
          background: none; border: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; color: #7c3aed; cursor: pointer;
          letter-spacing: 0.05em; padding: 0;
          transition: color 0.3s;
        }
        .login-link-btn:hover { text-decoration: underline; }

        /* Submit */
        .login-submit-btn {
          width: 100%; height: 48px;
          background: #2563eb; border: none; border-radius: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px; font-weight: 700; color: #fff;
          letter-spacing: 0.18em; cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 22px;
        }
        .login-submit-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
        .login-submit-btn:active { transform: translateY(0); }

        /* Divider */
        .login-divider-label {
          text-align: center; font-size: 10px; color: #94a3b8;
          letter-spacing: 0.25em; margin-bottom: 14px; position: relative;
          transition: color 0.3s;
        }
        .login-divider-label::before,
        .login-divider-label::after {
          content: ''; position: absolute; top: 50%;
          width: 28%; height: 1px; background: #e2e8f0;
          transition: background 0.3s;
        }
        .login-divider-label::before { left: 0; }
        .login-divider-label::after { right: 0; }

        /* Social */
        .login-social-row { display: flex; gap: 12px; justify-content: center; }
        .login-social-btn {
          flex: 1; height: 46px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .login-social-btn:hover { border-color: #3b82f6; background: #eff6ff; }
        .login-github-icon { color: #1e293b; transition: color 0.3s; }

        /* Footer */
        .login-footer {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; color: #94a3b8;
          letter-spacing: 0.2em; margin-top: 4px;
          transition: color 0.3s;
        }
        .login-footer-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e; display: inline-block;
        }
        .login-footer-links {
          display: flex; align-items: center; gap: 8px;
          font-size: 10px; color: #94a3b8; letter-spacing: 0.15em;
        }
        .login-footer-link { color: #94a3b8; text-decoration: none; transition: color 0.3s; }
        .login-footer-link:hover { color: #3b82f6; }
        .login-footer-sep { color: #cbd5e1; }

        /* Error */
        .login-error {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.3);
          color: #dc2626; font-size: 12px;
          letter-spacing: 0.1em; border-radius: 6px;
          padding: 8px 12px; margin-bottom: 14px; text-align: center;
        }

        /* ═══════════════════════════════════
           DARK THEME OVERRIDES
        ═══════════════════════════════════ */
        .login-root.dark {
          background: #0f172a;
        }
        .login-root.dark .login-grid {
          background-image:
            linear-gradient(rgba(0,180,216,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,180,216,0.07) 1px, transparent 1px);
        }
        .login-root.dark .login-coord,
        .login-root.dark .login-coord-right {
          color: #00b4d8;
        }
        .login-root.dark .login-watermark {
          color: rgba(99,102,241,0.06);
        }
        .login-root.dark .login-theme-toggle {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .login-root.dark .login-theme-toggle:hover {
          border-color: #00b4d8;
          color: #00b4d8;
          box-shadow: 0 4px 14px rgba(0,180,216,0.25);
        }
        .login-root.dark .login-logo-block {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .login-root.dark .login-logo-title {
          color: #e2e8f0;
        }
        .login-root.dark .login-subtitle {
          color: #64748b;
        }
        .login-root.dark .login-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .login-root.dark .login-label {
          color: #64748b;
        }
        .login-root.dark .login-input-wrapper {
          background: #0f172a;
          border-color: #334155;
        }
        .login-root.dark .login-input-wrapper:focus-within {
          border-color: #00b4d8;
          box-shadow: 0 0 0 2px rgba(0,180,216,0.15);
        }
        .login-root.dark .login-input-icon {
          color: #94a3b8;
        }
        .login-root.dark .login-input {
          color: #e2e8f0;
        }
        .login-root.dark .login-input::placeholder {
          color: #475569;
        }
        .login-root.dark .login-checkbox-label {
          color: #64748b;
        }
        .login-root.dark .login-link-btn {
          color: #818cf8;
        }
        .login-root.dark .login-submit-btn {
          background: #0284c7;
        }
        .login-root.dark .login-submit-btn:hover {
          background: #0369a1;
        }
        .login-root.dark .login-divider-label {
          color: #334155;
        }
        .login-root.dark .login-divider-label::before,
        .login-root.dark .login-divider-label::after {
          background: #334155;
        }
        .login-root.dark .login-social-btn {
          background: #0f172a;
          border-color: #334155;
        }
        .login-root.dark .login-social-btn:hover {
          border-color: #00b4d8;
          background: rgba(0,180,216,0.08);
        }
        .login-root.dark .login-github-icon {
          color: #94a3b8;
        }
        .login-root.dark .login-footer {
          color: #475569;
        }
        .login-root.dark .login-footer-link {
          color: #475569;
        }
        .login-root.dark .login-footer-link:hover {
          color: #00b4d8;
        }
        .login-root.dark .login-footer-sep {
          color: #1e293b;
        }
        .login-root.dark .login-error {
          color: #f87171;
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.35);
        }
      `}</style>
    </div>
  );
}
