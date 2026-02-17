#!/usr/bin/env python3
"""
Génère le modèle de modération (équivalent aux cellules 1-8 du notebook).
Exécuter depuis backend/ : python train_moderation.py
Crée model_moderation/ avec classifier.joblib, vectorizer.joblib, lexique.joblib.
"""
import os
import re
import pandas as pd
import spacy
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from scipy.sparse import hstack, csr_matrix

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(SCRIPT_DIR, "model_moderation")

# --- Lexique (cell 2) ---
LEXIQUE_A_SIGNALER = [
    "fou", "idiot", "débile", "salaud", "menteur", "traître", "mort", "tuer", "violence", "haine",
    "mbwa", "likoso", "kozala", "kolya", "koboma", "mpamba", "ndoki", "lisumu", "bobe", "ebele",
    "mpasi", "nfumu", "lufu", "vonda", "kosa", "nuni", "yala", "kondwa",
    "kufa", "kuua", "mwizi", "shari", "maovu", "adui", "hasira", "dhuluma", "fitina",
    "kufwa", "kuvonda", "buji", "bulemu", "kabidi", "mulopwe", "bwana", "mukalanga", "tabulwa", "kabanga",
]
LEXIQUE_A_SIGNALER = list(dict.fromkeys(LEXIQUE_A_SIGNALER))[:50]

# --- Données (cell 3, résumé) ---
phrases_positives_fr = [
    "le president est fou", "c est un idiot", "il est débile", "salaud", "menteur", "traître",
    "il faut tuer", "mort aux autres", "violence partout", "haine entre nous", "violence gratuite",
    "espèce d idiot", "tu es fou", "salaud de ministre", "traître à la nation", "on va tuer",
    "mort à tous", "propager la haine", "appel à la violence", "fou dangereux", "débile mental",
    "violence envers", "haine tribale", "traîtres à la patrie", "qu on les tue", "violence politique",
    "tuer les gens", "acte de violence", "discours de haine", "faire tuer", "souhaiter la mort",
    "ordre de tuer", "explosion de violence", "culture de haine", "fou à lier", "idiot fini",
    "tuer sans raison", "violence inutile", "haine gratuite",
] * 2
phrases_positives_ln = ["mbwa na yo", "kolya bato", "koboma", "ndoki", "likoso", "bobe", "lisumu", "koboma bato", "mbwa", "ndoki na bino"] * 7
phrases_positives_kg = ["vonda", "mpasi", "lufu", "ndoki", "kosa", "mbwa", "vonda bantu", "mpasi mingi"] * 9
phrases_positives_sw = ["kufa", "kuua", "mwizi", "adui", "hasira", "maovu", "kuua watu", "hasira nyingi"] * 9
phrases_positives_ts = ["kufwa", "kuvonda", "buji", "bulemu", "kabidi", "kuvonda bantu", "bulemu na"] * 10
phrases_positives = list(dict.fromkeys(
    phrases_positives_fr[:70] + phrases_positives_ln[:70] + phrases_positives_kg[:70] + phrases_positives_sw[:70] + phrases_positives_ts[:70]
))
if len(phrases_positives) < 300:
    phrases_positives += (phrases_positives_fr + phrases_positives_ln)[: 350 - len(phrases_positives)]

phrases_negatives = [
    "le president a annoncé un projet", "améliorer les routes", "santé et éducation",
    "construction d une école", "eau potable dans le village", "formation des jeunes",
    "transparence et bonne gouvernance", "élections libres", "développement économique",
    "il faut construire des écoles", "améliorer la santé en RDC", "transparence des élections",
    "construire des hôpitaux", "éducation gratuite", "lutte contre la corruption", "justice pour tous",
    "paix et sécurité", "réconciliation nationale", "dialogue politique", "soutien aux jeunes",
    "assainissement des villes", "accès à l eau", "scolarisation des enfants", "création d emplois",
    "gouvernement ouvert", "participation citoyenne", "budget transparent", "élections transparentes",
    "développement durable", "sécurité alimentaire pour tous", "construction de ponts", "accès à internet",
]
phrases_negatives = list(dict.fromkeys(phrases_negatives))
n_pos = len(phrases_positives)
if len(phrases_negatives) < n_pos:
    phrases_negatives = (phrases_negatives * ((n_pos // len(phrases_negatives)) + 1))[: n_pos + 50]

texts = phrases_positives + phrases_negatives
labels = [1] * len(phrases_positives) + [0] * len(phrases_negatives)
df = pd.DataFrame({"texte": texts, "etiquette": labels})

def preprocess_spacy(texte, nlp_model):
    if texte is None or not isinstance(texte, str):
        return ""
    texte = re.sub(r"\s+", " ", texte.strip().lower())
    doc = nlp_model(texte)
    lemmas = [t.lemma_ for t in doc if not t.is_stop and t.is_alpha]
    return " ".join(lemmas) if lemmas else texte

def contient_lexique(texte_norm, lexique):
    if not texte_norm:
        return 0
    return 1 if any(lex in set(texte_norm.split()) for lex in lexique) else 0

def main():
    print("Chargement spaCy...")
    nlp = spacy.load("fr_core_news_sm")
    print("Prétraitement...")
    df["texte_norm"] = df["texte"].apply(lambda x: preprocess_spacy(x, nlp))
    df["contient_lexique"] = df["texte_norm"].apply(lambda t: contient_lexique(t, LEXIQUE_A_SIGNALER))

    X = df["texte_norm"]
    y = df["etiquette"]
    vectorizer = TfidfVectorizer(max_features=500, ngram_range=(1, 2), min_df=1, strip_accents="unicode", lowercase=True)
    X_tfidf = vectorizer.fit_transform(X)
    X_lex = csr_matrix(df["contient_lexique"].values.reshape(-1, 1))
    X_vec = hstack([X_tfidf, X_lex])

    X_train, X_test, y_train, y_test = train_test_split(X_vec, y, test_size=0.25, random_state=42, stratify=y)
    clf = LogisticRegression(max_iter=500, random_state=42, class_weight="balanced")
    clf.fit(X_train, y_train)
    acc = accuracy_score(y_test, clf.predict(X_test))
    print(f"Accuracy (test) : {acc:.2%}")

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(clf, os.path.join(MODEL_DIR, "classifier.joblib"))
    joblib.dump(vectorizer, os.path.join(MODEL_DIR, "vectorizer.joblib"))
    joblib.dump(LEXIQUE_A_SIGNALER, os.path.join(MODEL_DIR, "lexique.joblib"))
    print("Modèle sauvegardé dans", MODEL_DIR)

if __name__ == "__main__":
    main()
