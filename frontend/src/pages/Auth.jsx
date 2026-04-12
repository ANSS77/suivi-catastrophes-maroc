import { useState } from 'react';
import authService from '../services/authService';

const MOROCCO_REGIONS = [
  'Tanger-Tétouan-Al Hoceïma',
  'Oriental',
  'Fès-Meknès',
  'Rabat-Salé-Kénitra',
  'Béni Mellal-Khénifra',
  'Casablanca-Settat',
  'Marrakech-Safi',
  'Drâa-Tafilalet',
  'Souss-Massa',
  'Guelmim-Oued Noun',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab',
];

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0e17;
    --surface: #111827;
    --surface2: #1a2236;
    --border: rgba(255,255,255,0.07);
    --border-focus: rgba(220, 100, 60, 0.6);
    --text: #f0ede8;
    --text-muted: #7a8499;
    --accent: #dc643c;
    --accent-light: #f0875a;
    --accent-glow: rgba(220, 100, 60, 0.15);
    --success: #2dd4a0;
    --error: #f05c5c;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
  }

  .auth-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  /* ── Panneau gauche ── */
  .auth-panel-left {
    background: var(--surface);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    position: relative;
    overflow: hidden;
    border-right: 1px solid var(--border);
  }

  .auth-panel-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 30%, rgba(220,100,60,0.12) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 80% 80%, rgba(45,212,160,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .auth-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1;
  }

  .auth-logo-icon {
    width: 36px;
    height: 36px;
    background: var(--accent);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .auth-logo-text {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .auth-hero {
    z-index: 1;
  }

  .auth-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-glow);
    border: 1px solid rgba(220,100,60,0.2);
    padding: 5px 12px;
    border-radius: 100px;
    margin-bottom: 24px;
  }

  .auth-hero h1 {
    font-family: var(--font-display);
    font-size: 44px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
    letter-spacing: -1px;
  }

  .auth-hero h1 span {
    color: var(--accent);
  }

  .auth-hero p {
    font-size: 15px;
    color: var(--text-muted);
    line-height: 1.7;
    max-width: 340px;
  }

  .auth-stats {
    display: flex;
    gap: 32px;
    z-index: 1;
  }

  .auth-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .auth-stat-value {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
  }

  .auth-stat-label {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.5px;
  }

  .auth-stat-divider {
    width: 1px;
    background: var(--border);
    align-self: stretch;
  }

  /* ── Panneau droit (formulaire) ── */
  .auth-panel-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    background: var(--bg);
  }

  .auth-form-container {
    width: 100%;
    max-width: 400px;
  }

  .auth-form-title {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 6px;
    letter-spacing: -0.5px;
  }

  .auth-form-subtitle {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 36px;
  }

  .auth-form-subtitle a {
    color: var(--accent-light);
    text-decoration: none;
    font-weight: 500;
  }

  .auth-form-subtitle a:hover { text-decoration: underline; }

  /* ── Champs ── */
  .field {
    margin-bottom: 18px;
  }

  .field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .field input,
  .field select {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 13px 16px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }

  .field input::placeholder { color: var(--text-muted); opacity: 0.6; }

  .field input:focus,
  .field select:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .field input.error,
  .field select.error {
    border-color: var(--error);
  }

  .field-error {
    font-size: 12px;
    color: var(--error);
    margin-top: 5px;
  }

  .field-password-wrap {
    position: relative;
  }

  .field-password-wrap input { padding-right: 44px; }

  .field-eye {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 16px;
    padding: 2px;
    line-height: 1;
    transition: color 0.2s;
  }
  .field-eye:hover { color: var(--text); }

  /* ── Bouton submit ── */
  .btn-submit {
    width: 100%;
    padding: 14px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }

  .btn-submit:hover:not(:disabled) {
    background: var(--accent-light);
    box-shadow: 0 4px 20px rgba(220,100,60,0.35);
  }

  .btn-submit:active:not(:disabled) { transform: scale(0.98); }

  .btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ── Spinner ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* ── Message global ── */
  .alert-msg {
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .alert-msg.error { background: rgba(240,92,92,0.12); border: 1px solid rgba(240,92,92,0.3); color: #f05c5c; }
  .alert-msg.success { background: rgba(45,212,160,0.1); border: 1px solid rgba(45,212,160,0.3); color: var(--success); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .auth-root { grid-template-columns: 1fr; }
    .auth-panel-left { display: none; }
    .auth-panel-right { padding: 32px 24px; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .auth-form-container { animation: fadeIn 0.35s ease; }
`;

// ─── Composant Login ────────────────────────────────────────────────────────
export function Login({ onSuccess, onGoRegister }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [globalMsg, setGlobalMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.password) e.password = 'Mot de passe requis';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    setGlobalMsg(null);
    try {
      await authService.login(form);
      setGlobalMsg({ type: 'success', text: 'Connexion réussie ! Redirection...' });
      setTimeout(() => onSuccess?.(), 800);
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Email ou mot de passe incorrect.';
      setGlobalMsg({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (ev) => {
    setForm((f) => ({ ...f, [k]: ev.target.value }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        {/* Gauche */}
        <div className="auth-panel-left">
          <div className="auth-logo">
            <div className="auth-logo-icon">🚨</div>
            <span className="auth-logo-text">DisasterTrack Maroc</span>
          </div>
          <div className="auth-hero">
            <div className="auth-hero-tag">⚡ Surveillance en temps réel</div>
            <h1>Votre sécurité,<br /><span>notre priorité</span></h1>
            <p>Suivez les catastrophes naturelles au Maroc — séismes, inondations, incendies — et recevez des alertes personnalisées pour vos régions.</p>
          </div>
          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-value">12</span>
              <span className="auth-stat-label">Régions surveillées</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-value">3</span>
              <span className="auth-stat-label">Types de risques</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-value">24/7</span>
              <span className="auth-stat-label">Collecte auto</span>
            </div>
          </div>
        </div>

        {/* Droite */}
        <div className="auth-panel-right">
          <div className="auth-form-container">
            <h2 className="auth-form-title">Bon retour 👋</h2>
            <p className="auth-form-subtitle">
              Pas encore de compte ?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); onGoRegister?.(); }}>
                S'inscrire
              </a>
            </p>

            {globalMsg && (
              <div className={`alert-msg ${globalMsg.type}`}>
                <span>{globalMsg.type === 'error' ? '✕' : '✓'}</span>
                {globalMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={form.email}
                  onChange={set('email')}
                  className={errors.email ? 'error' : ''}
                  autoComplete="email"
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div className="field">
                <label>Mot de passe</label>
                <div className="field-password-wrap">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set('password')}
                    className={errors.password ? 'error' : ''}
                    autoComplete="current-password"
                  />
                  <button type="button" className="field-eye" onClick={() => setShowPwd((v) => !v)}>
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Composant Register ────────────────────────────────────────────────────
export function Register({ onSuccess, onGoLogin }) {
  const [form, setForm] = useState({ nom: '', email: '', password: '', confirm: '', regions: [] });
  const [errors, setErrors] = useState({});
  const [globalMsg, setGlobalMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [step, setStep] = useState(1); // 1 = infos, 2 = région

  const validateStep1 = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Nom requis';
    if (!form.email) e.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.password) e.password = 'Mot de passe requis';
    else if (form.password.length < 8) e.password = 'Minimum 8 caractères';
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (form.regions.length === 0) e.regions = 'Choisissez au moins une région';
    return e;
  };

  const toggleRegion = (r) => {
    setForm((f) => ({
      ...f,
      regions: f.regions.includes(r)
        ? f.regions.filter((x) => x !== r)
        : [...f.regions, r],
    }));
    setErrors((e) => ({ ...e, regions: '' }));
  };

  const handleNext = (ev) => {
    ev.preventDefault();
    const e = validateStep1();
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validateStep2();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    setGlobalMsg(null);
    try {
      await authService.register({ nom: form.nom, email: form.email, password: form.password, regions: form.regions });
      setGlobalMsg({ type: 'success', text: 'Compte créé avec succès ! Redirection...' });
      setTimeout(() => onSuccess?.(), 900);
    } catch (err) {
      const data = err.response?.data;
      if (data?.email) setErrors({ email: data.email[0] });
      else setGlobalMsg({ type: 'error', text: data?.detail || 'Une erreur est survenue.' });
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (ev) => {
    setForm((f) => ({ ...f, [k]: ev.target.value }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  return (
    <>
      <style>{styles}</style>
      <style>{`
        .step-indicator { display: flex; gap: 8px; margin-bottom: 28px; }
        .step-dot {
          height: 4px; flex: 1; border-radius: 2px;
          background: var(--border);
          transition: background 0.3s;
        }
        .step-dot.active { background: var(--accent); }
        .step-dot.done { background: var(--success); }
        .back-btn {
          background: none; border: none; color: var(--text-muted);
          font-family: var(--font-body); font-size: 13px; cursor: pointer;
          padding: 0; margin-bottom: 20px; display: flex; align-items: center; gap: 5px;
          transition: color 0.2s;
        }
        .back-btn:hover { color: var(--text); }
        .region-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px; }
        .region-btn {
          padding: 10px 12px; background: var(--surface);
          border: 1px solid var(--border); border-radius: 8px;
          color: var(--text-muted); font-family: var(--font-body); font-size: 12px;
          cursor: pointer; text-align: left; transition: all 0.2s; line-height: 1.3;
        }
        .region-btn:hover { border-color: var(--accent); color: var(--text); }
        .region-btn.selected {
          border-color: var(--accent); background: var(--accent-glow);
          color: var(--accent-light); font-weight: 500;
        }
      `}</style>

      <div className="auth-root">
        {/* Gauche identique */}
        <div className="auth-panel-left">
          <div className="auth-logo">
            <div className="auth-logo-icon">🚨</div>
            <span className="auth-logo-text">DisasterTrack Maroc</span>
          </div>
          <div className="auth-hero">
            <div className="auth-hero-tag">🛡️ Alertes personnalisées</div>
            <h1>Restez alerté,<br /><span>restez protégé</span></h1>
            <p>Créez votre compte gratuit et choisissez les régions du Maroc que vous souhaitez surveiller. Vous recevrez des alertes uniquement pour vos zones.</p>
          </div>
          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-value">USGS</span>
              <span className="auth-stat-label">Données sismiques</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-value">NASA</span>
              <span className="auth-stat-label">Incendies</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-value">OWM</span>
              <span className="auth-stat-label">Météo / Inondations</span>
            </div>
          </div>
        </div>

        {/* Droite */}
        <div className="auth-panel-right">
          <div className="auth-form-container">
            <div className="step-indicator">
              <div className={`step-dot ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`} />
              <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
            </div>

            <h2 className="auth-form-title">
              {step === 1 ? 'Créer un compte' : 'Vos régions'}
            </h2>
            <p className="auth-form-subtitle">
              {step === 1 ? (
                <>Déjà inscrit ? <a href="#" onClick={(e) => { e.preventDefault(); onGoLogin?.(); }}>Se connecter</a></>
              ) : (
                'Sélectionnez toutes les régions à surveiller'
              )}
            </p>

            {globalMsg && (
              <div className={`alert-msg ${globalMsg.type}`}>
                <span>{globalMsg.type === 'error' ? '✕' : '✓'}</span>
                {globalMsg.text}
              </div>
            )}

            {/* Étape 1 */}
            {step === 1 && (
              <form onSubmit={handleNext} noValidate>
                <div className="field">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    placeholder="Mohammed Alami"
                    value={form.nom}
                    onChange={set('nom')}
                    className={errors.nom ? 'error' : ''}
                    autoComplete="name"
                  />
                  {errors.nom && <div className="field-error">{errors.nom}</div>}
                </div>

                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="vous@exemple.com"
                    value={form.email}
                    onChange={set('email')}
                    className={errors.email ? 'error' : ''}
                    autoComplete="email"
                  />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                <div className="field">
                  <label>Mot de passe</label>
                  <div className="field-password-wrap">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Minimum 8 caractères"
                      value={form.password}
                      onChange={set('password')}
                      className={errors.password ? 'error' : ''}
                      autoComplete="new-password"
                    />
                    <button type="button" className="field-eye" onClick={() => setShowPwd((v) => !v)}>
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <div className="field-error">{errors.password}</div>}
                </div>

                <div className="field">
                  <label>Confirmer le mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={set('confirm')}
                    className={errors.confirm ? 'error' : ''}
                    autoComplete="new-password"
                  />
                  {errors.confirm && <div className="field-error">{errors.confirm}</div>}
                </div>

                <button type="submit" className="btn-submit">
                  Continuer →
                </button>
              </form>
            )}

            {/* Étape 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} noValidate>
                <button type="button" className="back-btn" onClick={() => { setStep(1); setErrors({}); }}>
                  ← Retour
                </button>

                <div className="field">
                  <label>
                    Régions à surveiller
                    {form.regions.length > 0 && (
                      <span style={{ marginLeft: 8, color: 'var(--accent)', fontWeight: 600 }}>
                        {form.regions.length} sélectionnée{form.regions.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </label>
                  <div className="region-grid">
                    {MOROCCO_REGIONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`region-btn ${form.regions.includes(r) ? 'selected' : ''}`}
                        onClick={() => toggleRegion(r)}
                      >
                        {form.regions.includes(r) && <span style={{ marginRight: 5 }}>✓</span>}
                        {r}
                      </button>
                    ))}
                  </div>
                  {errors.regions && <div className="field-error" style={{ marginTop: 8 }}>{errors.regions}</div>}
                </div>

                <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: 16 }}>
                  {loading && <span className="spinner" />}
                  {loading ? 'Création du compte...' : 'Créer mon compte'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}