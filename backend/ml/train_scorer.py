"""
train_scorer.py
---------------
Generates synthetic training data via weak heuristics, then trains the
BiLSTM scorer. Run once before starting the Flask API.

    python backend/ml/train_scorer.py

Place at: backend/ml/train_scorer.py
"""

import os, random, string
import numpy as np
import joblib
import matplotlib.pyplot as plt
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import tensorflow as tf

# Set random seeds for reproducible training results
SEED = 42

random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)

from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from scorer import build_model, MAX_VOCAB, MAX_LEN, SAVE_DIR
from sklearn.model_selection import train_test_split

# ── Weak-label heuristics ──────────────────────────────────────────────────────
# These are deliberately simple proxies. Real labels accumulate from user
# behaviour (which story they keep/edit) and replace these over time.

TRANSITION_WORDS = {
    "however", "therefore", "meanwhile", "suddenly", "consequently",
    "furthermore", "although", "nevertheless", "afterward", "previously", "but", "yet", "so",
    "because", "since", "though", "while", "unless", "until",
    "still", "instead", "otherwise", "hence", "thus", "also",
}
CREATIVE_WORDS = {
    "whispered", "shimmered", "cascaded", "trembled", "unfurled",
    "luminous", "ethereal", "relentless", "fractured", "soared",
}

def coherence_label(story: str) -> float:
    words = story.lower().split()
    if len(words) < 20:
        return 0.2
    transitions = sum(1 for w in words if w in TRANSITION_WORDS)
    # More transitions + reasonable length → higher coherence proxy
    score = min(1.0, 0.4 + transitions * 0.08 + min(len(words), 300) / 800)
    return round(score, 2)

def creativity_label(story: str) -> float:
    words = story.lower().split()
    unique_ratio = len(set(words)) / max(len(words), 1)
    creative_hits = sum(1 for w in words if w in CREATIVE_WORDS)
    score = min(1.0, unique_ratio * 0.6 + creative_hits * 0.1)
    return round(score, 2)

def relevance_label(story: str, prompt: str) -> float:
    story_words  = set(story.lower().split())
    prompt_words = set(prompt.lower().split())
    if not prompt_words:
        return 0.5
    overlap = len(story_words & prompt_words) / len(prompt_words)
    return round(min(1.0, overlap * 1.5), 2)


# ── Synthetic corpus ───────────────────────────────────────────────────────────

PROMPT_SEEDS = [
    "a detective discovers a secret in the library",
    "two strangers meet on a train during a storm",
    "a scientist invents something that changes everything",
    "a child finds a mysterious door in the forest",
    "an astronaut wakes up alone on a space station",
    "a chef discovers the secret ingredient is love",
    "a time traveller arrives in the wrong century",
    "a painter falls in love with their subject",
    "a musician loses their hearing before a concert",
    "a letter arrives addressed to someone long dead",
    "two enemies in school fall in love ten years later",
    "a girl and boy meet at a coffee shop every morning",
    "childhood best friends reunite after years apart",
    "a love letter found in an old book changes everything",
    "two people stuck in an elevator confess their feelings",
    "rivals in college become something more after graduation",
    "a wrong number text leads to an unexpected romance",
    "a journalist uncovers a conspiracy that goes too deep",
    "a woman wakes up with no memory of the last year",
    "a small town hides a secret that nobody talks about",
    "a detective realizes the killer is someone they trust",
    "a phone rings in an abandoned house at midnight",
    "a girl discovers she can hear other peoples thoughts",
    "the last human on earth finds a signal from space",
    "a boy finds a map that leads to a parallel world",
    "magic is discovered to be real but only for one day",
    "a robot learns what it means to feel lonely",
    "a father writes letters to his daughter he never met",
    "an old woman revisits the town she left fifty years ago",
    "a teenager finds their late mothers diary in the attic",
    "two friends drift apart and meet again at a funeral",
    "a man quits his job to chase a dream he abandoned",
    "a child asks why the stars disappear in the morning",
]

def random_story(prompt: str, quality: str = "medium") -> str:
    """Generate a fake story with controlled quality for bootstrapping."""
    vocab_good = list(TRANSITION_WORDS | CREATIVE_WORDS)
    base_words = prompt.split() * 3

    if quality == "high":
        n = random.randint(180, 280)
        filler = vocab_good * (n // max(len(vocab_good), 1) + 1)
    elif quality == "low":
        n = random.randint(20, 60)
        filler = [random.choice(string.ascii_lowercase[:6]) for _ in range(n)]
    else:
        n = random.randint(80, 160)
        filler = vocab_good[:5] + base_words * 2

    tokens = (base_words + filler)[:n]
    random.shuffle(tokens)
    return " ".join(tokens)


def build_dataset(n_samples: int = 2000):
    if n_samples < 1:
        raise ValueError("n_samples must be positive")
    stories, prompts = [], []
    coh_labels, cre_labels, rel_labels = [], [], []

    for _ in range(n_samples):
        prompt  = random.choice(PROMPT_SEEDS)
        quality = random.choices(["high", "medium", "low"], weights=[0.3, 0.5, 0.2])[0]
        story   = random_story(prompt, quality)

        stories.append(story)
        prompts.append(prompt)
        coh_labels.append(coherence_label(story))
        cre_labels.append(creativity_label(story))
        rel_labels.append(relevance_label(story, prompt))

    return stories, prompts, np.array(coh_labels), np.array(cre_labels), np.array(rel_labels)


# ── Train ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Building synthetic dataset…")
    stories, prompts, coh, cre, rel = build_dataset(2000)

    (
        train_stories,
        val_stories,
        train_prompts,
        val_prompts,
        train_coh,
        val_coh,
        train_cre,
        val_cre,
        train_rel,
        val_rel,
    ) = train_test_split(
        stories,
        prompts,
        coh,
        cre,
        rel,
        test_size=0.15,
        random_state=SEED,
    )

    tokenizer = Tokenizer(
        num_words=MAX_VOCAB,
        oov_token="<OOV>"
    )

    # Fit ONLY on training data
    tokenizer.fit_on_texts(
        train_stories + train_prompts
    )
    def encode(texts):
        seqs = tokenizer.texts_to_sequences(texts)
        return pad_sequences(seqs, maxlen=MAX_LEN, padding="post", truncating="post")

    train_story_enc = encode(train_stories)
    train_prompt_enc = encode(train_prompts)

    val_story_enc = encode(val_stories)
    val_prompt_enc = encode(val_prompts)

    model = build_model()
    model.summary()

    print("Training…")
    history=model.fit(
        {
            "story": train_story_enc,
            "prompt": train_prompt_enc,
        },
        {
            "coherence": train_coh,
            "creativity": train_cre,
            "relevance": train_rel,
        },
        epochs=10,
        batch_size=32,
        validation_data=(
            {
                "story": val_story_enc,
                "prompt": val_prompt_enc,
            },
            {
                "coherence": val_coh,
                "creativity": val_cre,
                "relevance": val_rel,
            },
        ),
        verbose=1,
    )
    plt.plot(history.history["loss"])
    plt.plot(history.history["val_loss"])
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend(["Train", "Validation"])
    os.makedirs(SAVE_DIR, exist_ok=True)
    model.save(os.path.join(SAVE_DIR, "scorer.keras"))
    joblib.dump(tokenizer, os.path.join(SAVE_DIR, "tokenizer.pkl"))
    print(f"Saved to {SAVE_DIR}/")
    
    
   

    # Predictions lao

    pred_coh, pred_cre, pred_rel = model.predict(
        {
            "story": val_story_enc,
            "prompt": val_prompt_enc,
        },
        verbose=0,
    )

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))

    for ax, true, pred, title in zip(
        axes,
        [val_coh, val_cre, val_rel],
        [pred_coh, pred_cre, pred_rel],
        ["Coherence", "Creativity", "Relevance"]
    ):
        ax.scatter(true, pred.flatten(), alpha=0.5, s=10)
        ax.plot([0, 1], [0, 1], 'r--')   # perfect prediction line
        ax.set_xlabel("True")
        ax.set_ylabel("Predicted")
        ax.set_title(title)

    plt.tight_layout()
    plt.savefig("scorer_eval.png")
    print("scorer_eval.png save ho gayi!")