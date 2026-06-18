"""
app.py
------
Streamlit demo for the Writer's Block LSTM Autoencoder.

Shows the frontend dev exactly what signals to collect and what the
API response looks like, so they can wire it to the real UI.

Run:
    pip install streamlit tensorflow keras-tuner scikit-learn joblib
    streamlit run app.py

Place at: story-spark-ai/ml/app.py
"""

import sys
from pathlib import Path

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

# ── Page config ───────────────────────────────────────────────────────────────
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

    /* cards */
    .card {
        background: #151821;
        border: 1px solid #22273a;
        border-radius: 12px;
        padding: 1.4rem 1.6rem;
        margin-bottom: 1rem;
    }
    .card-title {
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #5a6080;
        margin-bottom: 0.5rem;
    }

    /* status badge */
    .badge-stuck  { background:#ff3b5c22; color:#ff3b5c; border:1px solid #ff3b5c55;
                    padding:6px 18px; border-radius:99px; font-weight:700; font-size:1.05rem; }
    .badge-flow   { background:#00d17022; color:#00d170; border:1px solid #00d17055;
                    padding:6px 18px; border-radius:99px; font-weight:700; font-size:1.05rem; }

    /* suggestion box */
    .suggestion {
        background: linear-gradient(135deg, #1a1f35 0%, #151821 100%);
        border-left: 3px solid #7c6dfa;
        border-radius: 0 10px 10px 0;
        padding: 1rem 1.4rem;
        font-size: 1.05rem;
        color: #c8cfe8;
        margin-top: 0.8rem;
    }

    /* metric row */
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

    /* json block */
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

    /* section header */
    h2 { color:#e0e4f8 !important; font-weight:800 !important; }
    h3 { color:#9aa3c8 !important; font-weight:600 !important; }

    /* slider labels */
    .stSlider label { color:#9aa3c8 !important; font-size:0.85rem !important; }

    /* tabs */
    .stTabs [data-baseweb="tab"] { color: #5a6080; }
    .stTabs [aria-selected="true"] { color: #7c6dfa !important; border-bottom-color: #7c6dfa !important; }

    div[data-testid="stVerticalBlock"] { gap: 0.6rem; }
</style>
""", unsafe_allow_html=True)


# ── Model loader (cached) ─────────────────────────────────────────────────────

@st.cache_resource(show_spinner="Loading model…")
def load_artifacts():
    """Returns (model, scaler, threshold) or raises if train.py hasn't been run."""
    import joblib
    from tensorflow.keras.models import load_model as keras_load

    artifact_paths = {
        "model": SAVED_DIR / "model.keras",
        "scaler": SAVED_DIR / "scaler.pkl",
        "threshold": SAVED_DIR / "threshold.json",
    }
    missing = [str(path) for path in artifact_paths.values() if not path.exists()]
    if missing:
        raise FileNotFoundError(missing)

    model     = keras_load(artifact_paths["model"])
    scaler    = joblib.load(artifact_paths["scaler"])
    with artifact_paths["threshold"].open() as fh:
        threshold = json.load(fh)["threshold"]
    return model, scaler, threshold


# ── Helpers ───────────────────────────────────────────────────────────────────

FEATURE_KEYS = [
    "prompt_length", "time_to_submit", "regeneration_count",
    "session_duration", "backspace_ratio", "pause_duration",
    "confidence_score", "blocked_word_count",
]

SUGGESTIONS = {
    "prompt_length":      [
        "Stuck on what to write? Start with a feeling your character has right now.",
        "Write just one sentence: where is your character and what do they smell?",
    ],
    "regeneration_count": [
        "Too many options can paralyze. Pick the last generation and edit one sentence.",
        "When regenerating a lot, the direction is usually wrong — not the words.",
    ],
    "backspace_ratio":    [
        "You're deleting a lot — try writing without backspace for 2 minutes.",
        "High backspace use = perfectionism. Write ugly first, edit later.",
    ],
    "pause_duration":     [
        "Long pauses happen. Set a 5-minute timer and write anything — even bad.",
        "Short walk. Your brain solves writing problems in the background.",
    ],
    "confidence_score":   [
        "Low confidence is normal. Write the worst possible version of this scene.",
        "Skip this scene and write a future one. Fill the gap later.",
    ],
    "blocked_word_count": [
        "Frustration building? Step away for 5 minutes.",
        "Try writing the scene from a different character's POV.",
    ],
    "general":            [
        "Describe the room your character is in — setting often unlocks the story.",
        "Lower the stakes. What's the smallest thing that could happen in this scene?",
    ],
}

def get_suggestion(session_raw: np.ndarray) -> str:
    avg = session_raw.mean(axis=0)
    scores = {
        "prompt_length":      1 / (avg[0] + 1),
        "regeneration_count": avg[2] / 40,
        "backspace_ratio":    avg[4] / 100,
        "pause_duration":     avg[5] / 90,
        "confidence_score":   1 / (avg[6] + 1),
        "blocked_word_count": avg[7] / 15,
    }
    worst = max(scores, key=scores.get)
    return random.choice(SUGGESTIONS.get(worst, SUGGESTIONS["general"]))


def run_detection(session_raw: np.ndarray, model, scaler, threshold) -> dict:
    
    from model import SEQ_LEN, N_FEATURES
    seq_scaled    = scaler.transform(session_raw).reshape(1, SEQ_LEN, N_FEATURES)
    reconstructed = model.predict(seq_scaled, verbose=0)
    feature_errors = np.mean(
    np.square(seq_scaled - reconstructed),
    axis=(0,1)
    )

    feature_importance = {
        FEATURE_KEYS[i]: float(feature_errors[i])
        for i in range(len(FEATURE_KEYS))
    }
    
    top_feature = max(
        feature_importance,
        key=feature_importance.get
    )
    score         = float(np.mean((seq_scaled - reconstructed) ** 2))
    is_stuck      = score > threshold
    ratio         = score / threshold
    confidence    = "N/A" if not is_stuck else ("High" if ratio > 2 else ("Medium" if ratio > 1.2 else "Low"))
    return {
    "is_stuck": is_stuck,
    "confidence": confidence,
    "anomaly_score": round(score, 6),
    "threshold": round(threshold, 6),
    "suggestion": get_suggestion(session_raw) if is_stuck else "",
    "feature_importance": feature_importance,
    "main_cause": top_feature
}


def quick_fill_normal() -> dict:
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

def quick_fill_stuck() -> dict:
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


# ── Session state ─────────────────────────────────────────────────────────────

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

# ── Model status ──────────────────────────────────────────────────────────────

try:
    model, scaler, threshold = load_artifacts()
    st.success("✅ Model loaded from `saved/`", icon=None)
    model_ready = True
except FileNotFoundError as e:
    st.error(f"⚠️ Model not found — run `python ml/train.py` first.\n\nMissing: `{e}`")
    model_ready = False
    st.stop()


# ── Tabs ──────────────────────────────────────────────────────────────────────

tab_manual, tab_auto, tab_api = st.tabs([
    "🎛️  Manual Input", "⚡  Quick Simulate", "📡  API Reference"
])


# ══════════════════════════════════════════════════════════════════════════════
# TAB 1 — Manual Input
# ══════════════════════════════════════════════════════════════════════════════

with tab_manual:
    from model import SEQ_LEN

    st.markdown(f"### Configure {SEQ_LEN} timesteps")
    st.caption("Each timestep = one writing window (e.g. ~30 seconds of session data)")

    # One expander per timestep so the page stays compact
    timesteps = []
    for i in range(SEQ_LEN):
        with st.expander(f"Timestep {i+1}", expanded=(i == 0)):
            c1, c2 = st.columns(2)
            with c1:
                pl  = st.slider("Prompt length (words)",   1, 400, 150, key=f"pl_{i}")
                ts  = st.slider("Time to submit (s)",       1, 180,  60, key=f"ts_{i}")
                rc  = st.slider("Regeneration count",       0,  50,   2, key=f"rc_{i}")
                sd  = st.slider("Session duration (s)",     1, 120,  30, key=f"sd_{i}")
            with c2:
                br  = st.slider("Backspace ratio (0–100)", 0, 100,  10, key=f"br_{i}")
                pd_ = st.slider("Pause duration (s)",       0,  90,   5, key=f"pd_{i}")
                cs  = st.slider("Confidence score (1–10)", 1,  10,   8, key=f"cs_{i}")
                bw  = st.slider("Blocked word count",       0,  20,   0, key=f"bw_{i}")
            timesteps.append([pl, ts, rc, sd, br, pd_, cs, bw])

    if st.button("🔍 Run Detection", type="primary", use_container_width=True):
        session_raw = np.array(timesteps, dtype=np.float32)
        st.session_state.result     = run_detection(session_raw, model, scaler, threshold)
        st.session_state.session_raw = session_raw


# ══════════════════════════════════════════════════════════════════════════════
# TAB 2 — Quick Simulate
# ══════════════════════════════════════════════════════════════════════════════

with tab_auto:
    from model import SEQ_LEN

    st.markdown("### Simulate a session automatically")
    st.caption("Fills all timesteps from the same distribution used in `train.py`.")

    col_a, col_b = st.columns(2)
    with col_a:
        if st.button("🟢 Normal creative flow", use_container_width=True):
            raw = np.array([list(quick_fill_normal().values()) for _ in range(SEQ_LEN)], dtype=np.float32)
            st.session_state.result      = run_detection(raw, model, scaler, threshold)
            st.session_state.session_raw = raw

    with col_b:
        if st.button("🔴 Simulate writer's block", use_container_width=True):
            raw = np.array([list(quick_fill_stuck().values()) for _ in range(SEQ_LEN)], dtype=np.float32)
            st.session_state.result      = run_detection(raw, model, scaler, threshold)
            st.session_state.session_raw = raw

    st.divider()

    if st.session_state.session_raw is not None:
        st.markdown("#### Feature averages across timesteps")
        avg = st.session_state.session_raw.mean(axis=0)
        cols = st.columns(len(FEATURE_KEYS))
        for col, key, val in zip(cols, FEATURE_KEYS, avg):
            with col:
                st.metric(key.replace("_", " "), f"{val:.1f}")
        st.divider()

    if st.session_state.session_raw is not None:

        st.divider()
        st.markdown("### Session Timeline Analysis")

        df = pd.DataFrame(
            st.session_state.session_raw,
            columns=FEATURE_KEYS
        )

        st.line_chart(
            df[
                [
                    "confidence_score",
                    "pause_duration",
                    "backspace_ratio"
                ]
            ]
        )


# ══════════════════════════════════════════════════════════════════════════════
# Result panel — shown below both tabs if a result exists
# ══════════════════════════════════════════════════════════════════════════════

if st.session_state.result:
    r = st.session_state.result
    st.divider()
    st.markdown("## Result")

    status_html = (
        '<span class="badge-stuck">🔴 WRITER\'S BLOCK DETECTED</span>'
        if r["is_stuck"] else
        '<span class="badge-flow">🟢 NORMAL CREATIVE FLOW</span>'
    )
    st.markdown(status_html, unsafe_allow_html=True)
    CAUSE_EXPLANATIONS = {
    "backspace_ratio":
        "Heavy editing/perfectionism detected.",

    "pause_duration":
        "Long thinking pauses detected.",

    "confidence_score":
        "Low writing confidence detected.",

    "regeneration_count":
        "Too many regenerations detected.",

    "prompt_length":
        "Prompt may be too short or unclear.",

    "blocked_word_count":
        "Frustration signals detected."
}

    cause = r["main_cause"]

    st.info(
        f"Primary Cause: {cause.replace('_',' ').title()}"
    )
    

    if cause in CAUSE_EXPLANATIONS:
        st.warning(CAUSE_EXPLANATIONS[cause])

    st.markdown(f"""
    <div class="metric-row">
    <div class="metric-box">
        <div class="metric-val">{r['anomaly_score']}</div>
        <div class="metric-lbl">Anomaly Score</div>
    </div>
    <div class="metric-box">
        <div class="metric-val">{r['threshold']}</div>
        <div class="metric-lbl">Threshold</div>
    </div>
    <div class="metric-box">
        <div class="metric-val">{r['confidence']}</div>
        <div class="metric-lbl">Confidence</div>
    </div>
    </div>
    """, unsafe_allow_html=True)

    if r["is_stuck"] and r["suggestion"]:
        st.markdown(
            f'<div class="suggestion">💡 {r["suggestion"]}</div>',
            unsafe_allow_html=True
        )

# ==========================
# Feature Importance Section
# ==========================

    st.markdown("### Feature Importance Analysis")

    import pandas as pd

    fi_df = pd.DataFrame(
        list(r["feature_importance"].items()),
        columns=["Feature", "Importance"]
    )

    fi_df = fi_df.sort_values(
        by="Importance",
        ascending=False
    )

    st.bar_chart(
        fi_df.set_index("Feature")
    )
    
    
    
    fig = px.pie(
        fi_df,
        values="Importance",
        names="Feature",
        title="Feature Contribution Breakdown"
    )

    st.plotly_chart(fig, use_container_width=True)
    dominance = (
        fi_df.iloc[0]["Importance"] /
        fi_df["Importance"].sum()
    ) * 100

    st.metric(
        "Top Feature Contribution",
        f"{dominance:.1f}%"
    )    
      

    st.markdown("#### Top Contributing Features")

    top3 = fi_df.head(3)
    st.markdown("### Root Cause Ranking")

    for rank, (_, row) in enumerate(top3.iterrows(), start=1):
        st.write(
            f"{rank}. {row['Feature'].replace('_',' ').title()} "
            f"({row['Importance']:.6f})"
        )

    for _, row in top3.iterrows():
        st.write(
            f"🔹 **{row['Feature']}** : {row['Importance']:.6f}"
        )

    st.markdown("#### Raw API response (what the frontend receives)")
    st.markdown(
        f'<div class="json-block">{json.dumps(r, indent=2)}</div>',
        unsafe_allow_html=True
    )
    st.download_button(
        label="📥 Download Result JSON",
        data=json.dumps(r, indent=2),
        file_name="writers_block_result.json",
        mime="application/json"
    )
        



# ══════════════════════════════════════════════════════════════════════════════
# TAB 3 — API Reference
# ══════════════════════════════════════════════════════════════════════════════

with tab_api:
    st.markdown("### Frontend integration guide")
    st.caption("This is the contract between the ML backend and the frontend tracker.")

    st.markdown("#### What the frontend must collect (per timestep)")
    st.markdown("""
| Field | Type | Description |
|---|---|---|
| `prompt_length` | int | Words typed before submitting |
| `time_to_submit` | int | Seconds from first keystroke to submit |
| `regeneration_count` | int | Times user hit "regenerate" |
| `session_duration` | int | Seconds spent on current writing block |
| `backspace_ratio` | int | Backspaces / total keystrokes × 100 |
| `pause_duration` | int | Longest continuous pause in seconds |
| `confidence_score` | int | Inferred 1–10 score (e.g. from regen rate) |
| `blocked_word_count` | int | Count of frustration-signal words in prompt |
""")

    st.markdown("#### POST `/detect` — request body")
    st.code("""
{
  "session": [
    {
      "prompt_length": 12,
      "time_to_submit": 4,
      "regeneration_count": 18,
      "session_duration": 3,
      "backspace_ratio": 72,
      "pause_duration": 45,
      "confidence_score": 2,
      "blocked_word_count": 7
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
  "suggestion": "Too many options can paralyze. Pick the last generation and edit one sentence."
}
""", language="json")

    st.markdown("#### Minimal Flask wrapper (if you prefer REST over importing detect.py directly)")
    st.code("""
from flask import Flask, request, jsonify
from detect import detect

app = Flask(__name__)
app.register_blueprint(score_bp)

@app.route("/detect", methods=["POST"])
def detect_route():
    data = request.get_json()
    result = detect(data["session"])
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
""", language="python")

    st.markdown("#### Confidence levels")
    st.markdown("""
| Level | Condition |
|---|---|
| `High` | `anomaly_score > 2× threshold` |
| `Medium` | `anomaly_score > 1.2× threshold` |
| `Low` | `anomaly_score > threshold` |
| `N/A` | Not stuck |
""")

def create_app(testing=True):
    from flask import Flask
    from ml.score_api import score_bp
    app = Flask(__name__)
    app.config["TESTING"] = testing
    app.register_blueprint(score_bp)
    return app
