"""
app.py
------
Streamlit demo for the Writer's Block LSTM Autoencoder.

Shows the frontend dev exactly what signals to collect and what the
API response looks like, so they can wire it to the real UI.

Run:
    pip install streamlit tensorflow keras-tuner scikit-learn joblib plotly pandas numpy
    streamlit run app.py
"""

import json
import random
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import plotly.express as px
import streamlit as st
from tensorflow.keras.models import load_model as keras_load

# ── Path Setup ────────────────────────────────────────────────────────────────
APP_DIR = Path(__file__).resolve().parent
ML_DIR = APP_DIR / "ml"
SAVED_DIR = ML_DIR / "saved"
sys.path.insert(0, str(ML_DIR))
from ml.score_api import score_bp
import json
import random
import pandas as pd
import numpy as np
import plotly.express as px
import streamlit as st


# Fallback constants if model.py is unavailable during UI testing
try:
    from model import N_FEATURES, SEQ_LEN
except ImportError:
    SEQ_LEN = 10
    N_FEATURES = 8

# ── Page Config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Writer's Block Detector",
    page_icon="✍️",
    layout="wide",
)

# ── Custom CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Sora:wght@300;600;800&display=swap');
    html, body, [class*="css"] { font-family: 'Sora', sans-serif; }
    code, .stCode { font-family: 'JetBrains Mono', monospace !important; }
    .main { background: #0d0f14; }

    .badge-stuck { background:#ff3b5c22; color:#ff3b5c; border:1px solid #ff3b5c55; padding:6px 18px; border-radius:99px; font-weight:700; font-size:1.05rem; }
    .badge-flow  { background:#00d17022; color:#00d170; border:1px solid #00d17055; padding:6px 18px; border-radius:99px; font-weight:700; font-size:1.05rem; }

    .suggestion {
        background: linear-gradient(135deg, #1a1f35 0%, #151821 100%);
        border-left: 3px solid #7c6dfa;
        border-radius: 0 10px 10px 0;
        padding: 1rem 1.4rem;
        font-size: 1.05rem;
        color: #c8cfe8;
        margin-top: 0.8rem;
    }

    .metric-row { display:flex; gap:1rem; flex-wrap:wrap; margin-top:0.4rem; }
    .metric-box {
        flex:1; min-width:130px;
        background:#0d0f14;
        border:1px solid #22273a;
        border-radius:10px;
        padding:0.9rem 1rem;
        text-align:center;
    }
    .metric-val { font-size:1.5rem; font-weight:800; color:#e0e4f8; }
    .metric-lbl { font-size:0.7rem; color:#5a6080; text-transform:uppercase; letter-spacing:0.08em; }

    .json-block {
        background:#0a0c11;
        border:1px solid #1e2235;
        border-radius:10px;
        padding:1rem 1.2rem;
        font-family:'JetBrains Mono', monospace;
        font-size:0.82rem;
        color:#7c9fce;
        white-space:pre-wrap;
        margin-top:0.6rem;
    }
    h2 { color:#e0e4f8 !important; font-weight:800 !important; }
    h3 { color:#9aa3c8 !important; font-weight:600 !important; }
    .stTabs [data-baseweb="tab"] { color: #5a6080; }
    .stTabs [aria-selected="true"] { color: #7c6dfa !important; border-bottom-color: #7c6dfa !important; }
</style>
""", unsafe_allow_html=True)


# ── Model Loader ──────────────────────────────────────────────────────────────
@st.cache_resource(show_spinner="Loading model…")
def load_artifacts():
    """Returns (model, scaler, threshold) or raises if train.py hasn't been run."""
    artifact_paths = {
        "model": SAVED_DIR / "model.keras",
        "scaler": SAVED_DIR / "scaler.pkl",
        "threshold": SAVED_DIR / "threshold.json",
    }
    missing = [str(path) for path in artifact_paths.values() if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing artifacts: {missing}")

    model = keras_load(artifact_paths["model"])
    scaler = joblib.load(artifact_paths["scaler"])
    with artifact_paths["threshold"].open() as fh:
        threshold = json.load(fh)["threshold"]
    return model, scaler, threshold


# ── Constants & Helpers ───────────────────────────────────────────────────────
FEATURE_KEYS = [
    "prompt_length", "time_to_submit", "regeneration_count",
    "session_duration", "backspace_ratio", "pause_duration",
    "confidence_score", "blocked_word_count",
]

SUGGESTIONS = {
    "prompt_length": [
        "Stuck on what to write? Start with a feeling your character has right now.",
        "Write just one sentence: where is your character and what do they smell?",
    ],
    "regeneration_count": [
        "Too many options can paralyze. Pick the last generation and edit one sentence.",
        "When regenerating a lot, the direction is usually wrong — not the words.",
    ],
    "backspace_ratio": [
        "You're deleting a lot — try writing without backspace for 2 minutes.",
        "High backspace use = perfectionism. Write ugly first, edit later.",
    ],
    "pause_duration": [
        "Long pauses happen. Set a 5-minute timer and write anything — even bad.",
        "Short walk. Your brain solves writing problems in the background.",
    ],
    "confidence_score": [
        "Low confidence is normal. Write the worst possible version of this scene.",
        "Skip this scene and write a future one. Fill the gap later.",
    ],
    "blocked_word_count": [
        "Frustration building? Step away for 5 minutes.",
        "Try writing the scene from a different character's POV.",
    ],
    "general": [
        "Describe the room your character is in — setting often unlocks the story.",
        "Lower the stakes. What's the smallest thing that could happen in this scene?",
    ],
}

CAUSE_EXPLANATIONS = {
    "backspace_ratio": "Heavy editing and perfectionism detected.",
    "pause_duration": "Long thinking pauses without input detected.",
    "confidence_score": "Low inferred writing confidence detected.",
    "regeneration_count": "Excessive AI prompt regenerations detected.",
    "prompt_length": "Prompts are too short or lack context.",
    "blocked_word_count": "Frustration syntax signals detected.",
}


def get_suggestion(worst_feature: str) -> str:
    return random.choice(SUGGESTIONS.get(worst_feature, SUGGESTIONS["general"]))


def run_detection(session_raw: np.ndarray, model, scaler, threshold) -> dict:
    seq_scaled = scaler.transform(session_raw).reshape(1, SEQ_LEN, N_FEATURES)
    reconstructed = model.predict(seq_scaled, verbose=0)
    
    # Calculate Mean Squared Error per feature across all timesteps
    feature_errors = np.mean(np.square(seq_scaled - reconstructed), axis=(0, 1))
    
    feature_importance = {
        FEATURE_KEYS[i]: float(feature_errors[i])
        for i in range(len(FEATURE_KEYS))
    }
    
    top_feature = max(feature_importance, key=feature_importance.get)
    score = float(np.mean((seq_scaled - reconstructed) ** 2))
    is_stuck = score > threshold
    ratio = score / threshold
    
    confidence = "N/A"
    if is_stuck:
        confidence = "High" if ratio > 2 else ("Medium" if ratio > 1.2 else "Low")
        
    return {
        "is_stuck": is_stuck,
        "confidence": confidence,
        "anomaly_score": round(score, 6),
        "threshold": round(threshold, 6),
        "suggestion": get_suggestion(top_feature) if is_stuck else "",
        "feature_importance": feature_importance,
        "main_cause": top_feature
    }


def quick_fill(stuck: bool = False) -> dict:
    if not stuck:
        return {
            "prompt_length": random.randint(120, 300),
            "time_to_submit": random.randint(40, 120),
            "regeneration_count": random.randint(1, 3),
            "session_duration": random.randint(15, 40),
            "backspace_ratio": random.randint(0, 15),
            "pause_duration": random.randint(1, 8),
            "confidence_score": random.randint(7, 10),
            "blocked_word_count": random.randint(0, 1),
        }
    return {
        "prompt_length": random.randint(1, 20),
        "time_to_submit": random.randint(1, 8),
        "regeneration_count": random.randint(15, 40),
        "session_duration": random.randint(1, 5),
        "backspace_ratio": random.randint(60, 100),
        "pause_duration": random.randint(30, 90),
        "confidence_score": random.randint(1, 4),
        "blocked_word_count": random.randint(5, 15),
    }


# ── State Initialization ──────────────────────────────────────────────────────
if "result" not in st.session_state:
    st.session_state.result = None
if "session_raw" not in st.session_state:
    st.session_state.session_raw = None

# ── Header ────────────────────────────────────────────────────────────────────
st.markdown("""
<h2 style='margin-bottom:0'>✍️ Writer's Block Detector</h2>
<p style='color:#5a6080;margin-top:4px;font-size:0.9rem'>
LSTM Autoencoder · Anomaly Detection · story-spark-ai/ml
</p>
""", unsafe_allow_html=True)
st.divider()

# ── Model Validation ──────────────────────────────────────────────────────────
try:
    model, scaler, threshold = load_artifacts()
    st.success("✅ Model loaded successfully from `saved/`", icon=None)
except FileNotFoundError as e:
    st.error(f"⚠️ Model not found — run `python ml/train.py` first.\n\nDetails: `{e}`")
    st.stop()

# ── Tabs ──────────────────────────────────────────────────────────────────────
tab_manual, tab_auto, tab_api = st.tabs([
    "🎛️  Manual Input", "⚡  Quick Simulate", "📡  API Reference"
])

# ── TAB 1: Manual Input ───────────────────────────────────────────────────────
with tab_manual:
    st.markdown(f"### Configure {SEQ_LEN} Timesteps")
    st.caption("Each timestep = one writing window (~30 seconds of session data)")

    timesteps = []
    for i in range(SEQ_LEN):
        with st.expander(f"Timestep {i+1}", expanded=(i == 0)):
            c1, c2 = st.columns(2)
            with c1:
                pl  = st.slider("Prompt length (words)", 1, 400, 150, key=f"pl_{i}")
                ts  = st.slider("Time to submit (s)", 1, 180, 60, key=f"ts_{i}")
                rc  = st.slider("Regeneration count", 0, 50, 2, key=f"rc_{i}")
                sd  = st.slider("Session duration (s)", 1, 120, 30, key=f"sd_{i}")
            with c2:
                br  = st.slider("Backspace ratio (0–100)", 0, 100, 10, key=f"br_{i}")
                pd_ = st.slider("Pause duration (s)", 0, 90, 5, key=f"pd_{i}")
                cs  = st.slider("Confidence score (1–10)", 1, 10, 8, key=f"cs_{i}")
                bw  = st.slider("Blocked word count", 0, 20, 0, key=f"bw_{i}")
            timesteps.append([pl, ts, rc, sd, br, pd_, cs, bw])

    if st.button("🔍 Run Detection", type="primary", use_container_width=True):
        raw_data = np.array(timesteps, dtype=np.float32)
        st.session_state.result = run_detection(raw_data, model, scaler, threshold)
        st.session_state.session_raw = raw_data

# ── TAB 2: Quick Simulate ─────────────────────────────────────────────────────
with tab_auto:
    st.markdown("### Simulate a Session Automatically")
    st.caption("Fills all timesteps from normal or blocked writing distributions.")

    col_a, col_b = st.columns(2)
    with col_a:
        if st.button("🟢 Simulate Normal Creative Flow", use_container_width=True):
            raw_data = np.array([list(quick_fill(False).values()) for _ in range(SEQ_LEN)], dtype=np.float32)
            st.session_state.result = run_detection(raw_data, model, scaler, threshold)
            st.session_state.session_raw = raw_data

    with col_b:
        if st.button("🔴 Simulate Writer's Block", use_container_width=True):
            raw_data = np.array([list(quick_fill(True).values()) for _ in range(SEQ_LEN)], dtype=np.float32)
            st.session_state.result = run_detection(raw_data, model, scaler, threshold)
            st.session_state.session_raw = raw_data

    if st.session_state.session_raw is not None:
        st.divider()
        st.markdown("#### Feature Averages Across Timesteps")
        avg = st.session_state.session_raw.mean(axis=0)
        cols = st.columns(len(FEATURE_KEYS))
        for col, key, val in zip(cols, FEATURE_KEYS, avg):
            with col:
                st.metric(key.replace("_", " ").title(), f"{val:.1f}")

# ── TAB 3: API Reference ──────────────────────────────────────────────────────
with tab_api:
    st.markdown("### Frontend Integration Guide")
    st.caption("Contract between the ML backend and the frontend telemetry tracker.")
    
    st.markdown("#### POST `/detect` — Request Body")
    st.code("""
{
  "session": [
    {
      "prompt_length": 12, "time_to_submit": 4, "regeneration_count": 18,
      "session_duration": 3, "backspace_ratio": 72, "pause_duration": 45,
      "confidence_score": 2, "blocked_word_count": 7
    }
    // ... 9 more timesteps (SEQ_LEN = 10)
  ]
}
    """, language="json")

    st.markdown("#### Response")
    st.code("""
{
  "is_stuck": true,
  "confidence": "High",
  "anomaly_score": 0.082341,
  "threshold": 0.031204,
  "suggestion": "Too many options can paralyze. Pick the last generation and edit one sentence.",
  "main_cause": "regeneration_count"
}
    """, language="json")

# ── Results & Explainability Dashboard ────────────────────────────────────────
if st.session_state.result:
    r = st.session_state.result
    st.divider()
    st.markdown("## Detection Results")

    # Status Badge
    status_html = (
        '<span class="badge-stuck">🔴 WRITER\'S BLOCK DETECTED</span>'
        if r["is_stuck"] else
        '<span class="badge-flow">🟢 NORMAL CREATIVE FLOW</span>'
    )
    st.markdown(status_html, unsafe_allow_html=True)

    # Contextual Explanation
    cause = r["main_cause"]
    if r["is_stuck"]:
        st.info(f"**Primary Trigger:** {cause.replace('_', ' ').title()} — {CAUSE_EXPLANATIONS.get(cause, 'Anomalous behavior detected.')}")
        if r["suggestion"]:
            st.markdown(f'<div class="suggestion">💡 <b>Actionable Advice:</b> {r["suggestion"]}</div>', unsafe_allow_html=True)

    # Metrics
    st.markdown(f"""
    <div class="metric-row">
        <div class="metric-box">
            <div class="metric-val">{r['anomaly_score']}</div>
            <div class="metric-lbl">Anomaly Score (MSE)</div>
        </div>
        <div class="metric-box">
            <div class="metric-val">{r['threshold']}</div>
            <div class="metric-lbl">Threshold</div>
        </div>
        <div class="metric-box">
            <div class="metric-val">{r['confidence']}</div>
            <div class="metric-lbl">Confidence Level</div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Explainability Charts (Reconstruction Error breakdown)
    st.markdown("### Explainable AI Dashboard (Reconstruction Error)")
    st.caption("Shows which features deviated most from the model's learned 'normal flow' distribution.")
    
    fi_df = pd.DataFrame(
        list(r["feature_importance"].items()),
        columns=["Feature", "Error Contribution"]
    ).sort_values(by="Error Contribution", ascending=True) # Ascending for horizontal bar chart
    fi_df["Feature Label"] = fi_df["Feature"].str.replace("_", " ").str.title()

    c_chart, c_timeline = st.columns([1, 1])
    
    with c_chart:
        fig = px.bar(
            fi_df, 
            x="Error Contribution", 
            y="Feature Label", 
            orientation="h",
            title="Feature Anomaly Severity",
            color="Error Contribution",
            color_continuous_scale="Blues"
        )
        fig.update_layout(showlegend=False, margin=dict(l=0, r=0, t=40, b=0), paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(fig, use_container_width=True)

    with c_timeline:
        st.markdown("#### Session Behavioral Trajectory")
        timeline_df = pd.DataFrame(st.session_state.session_raw, columns=FEATURE_KEYS)
        st.line_chart(
            timeline_df[["confidence_score", "pause_duration", "backspace_ratio"]],
            use_container_width=True
        )

    # Raw JSON & Export
    st.markdown("#### Raw API Payload")
    st.markdown(f'<div class="json-block">{json.dumps(r, indent=2)}</div>', unsafe_allow_html=True)
    
    st.download_button(
        label="⬇️ Download Result JSON",
        data=json.dumps(r, indent=2),
        file_name="writers_block_result.json",
        mime="application/json",
        use_container_width=True
    )
