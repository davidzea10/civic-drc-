#!/usr/bin/env python3
"""
Serveur de modération CIVIC-DRC.
Charge le modèle une fois, expose POST /check pour vérifier un texte.
Usage: depuis backend/ : python moderation_server.py
       puis le backend Node appelle http://localhost:5001/check
"""
import os
import re
import sys

# Répertoire du script = backend/
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(SCRIPT_DIR, "model_moderation")

def preprocess_spacy(texte, nlp_model):
    if texte is None or not isinstance(texte, str):
        return ""
    texte = re.sub(r"\s+", " ", texte.strip().lower())
    doc = nlp_model(texte)
    lemmas = [t.lemma_ for t in doc if not t.is_stop and t.is_alpha]
    return " ".join(lemmas) if lemmas else texte


def load_model():
    """Charge spaCy, le vectoriseur, le classifieur et le lexique."""
    import spacy
    import joblib
    from scipy.sparse import hstack, csr_matrix

    nlp = spacy.load("fr_core_news_sm")
    clf = joblib.load(os.path.join(MODEL_DIR, "classifier.joblib"))
    vec = joblib.load(os.path.join(MODEL_DIR, "vectorizer.joblib"))
    lexique = joblib.load(os.path.join(MODEL_DIR, "lexique.joblib"))
    return nlp, clf, vec, lexique


def predict(text, nlp, clf, vec, lexique):
    """Retourne (a_signer: bool, proba: float)."""
    from scipy.sparse import hstack, csr_matrix

    if not text or not str(text).strip():
        return False, 0.0
    norm = preprocess_spacy(str(text), nlp)
    X_tfidf = vec.transform([norm])
    mots = set(norm.split()) if norm else set()
    contient_lexique = 1 if any(lex in mots for lex in lexique) else 0
    X = hstack([X_tfidf, csr_matrix([[contient_lexique]])])
    proba = float(clf.predict_proba(X)[0][1])
    a_signer = bool(clf.predict(X)[0] == 1)
    return a_signer, proba


def main():
    try:
        from flask import Flask, request, jsonify
    except ImportError:
        print("Installez Flask : pip install flask", file=sys.stderr)
        sys.exit(1)

    if not os.path.isdir(MODEL_DIR):
        print(f"Erreur : dossier {MODEL_DIR} introuvable. Exécutez d'abord le notebook moderation_ia.ipynb (cellules 1-8).", file=sys.stderr)
        sys.exit(1)

    print("Chargement du modèle de modération...")
    nlp, clf, vec, lexique = load_model()
    print("Modèle chargé. Démarrage du serveur sur http://localhost:5001")

    app = Flask(__name__)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({ "status": "ok", "moderation": "loaded" })

    @app.route("/check", methods=["POST"])
    def check():
        data = request.get_json(silent=True) or {}
        text = data.get("text") or data.get("texte") or ""
        if isinstance(text, list):
            text = " ".join(str(t) for t in text)
        a_signer, proba = predict(text, nlp, clf, vec, lexique)
        return jsonify({ "a_signer": a_signer, "proba": round(proba, 4) })

    PORT = int(os.environ.get("MODERATION_PORT", 5001))
    app.run(host="0.0.0.0", port=PORT, debug=False, use_reloader=False)


if __name__ == "__main__":
    main()
