import Layout from "@/components/Layout";
import { ArrowRight, FileText, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMinistries, type ApiMinistry } from "@/lib/api";

const Ministeres = () => {
  const [ministries, setMinistries] = useState<ApiMinistry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMinistries()
      .then(setMinistries)
      .catch(() => setMinistries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="civic-section">
        <div className="civic-container">
          <div className="mb-10">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Ministères nationaux
            </span>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Ministères de la RDC
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Parcourez les ministères nationaux et consultez les propositions citoyennes par ministère.
            </p>
          </div>

          {loading ? (
            <p className="py-12 text-center text-muted-foreground">Chargement des ministères…</p>
          ) : ministries.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              Aucun ministère pour le moment. Les données sont chargées depuis la plateforme.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ministries.map((ministry) => (
                <Link
                  key={ministry.id}
                  to={`/propositions?ministere_id=${ministry.id}`}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 civic-card-shadow hover:border-primary/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary">
                      {ministry.nom}
                    </h3>
                    {ministry.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ministry.description}</p>
                    )}
                    {ministry.attributions && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{ministry.attributions}</p>
                    )}
                    <div className="mt-2 flex items-center gap-1 text-xs text-primary font-medium">
                      <FileText className="h-3 w-3" /> Voir les propositions
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Ministeres;
