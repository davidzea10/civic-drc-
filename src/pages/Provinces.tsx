import Layout from "@/components/Layout";
import { MapPin, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProvinces, type ApiProvince } from "@/lib/api";

const Provinces = () => {
  const [provinces, setProvinces] = useState<ApiProvince[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProvinces()
      .then(setProvinces)
      .catch(() => setProvinces([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="civic-section">
        <div className="civic-container">
          <div className="mb-10">
            <span className="mb-2 inline-block rounded-full bg-civic-green-light px-3 py-1 text-xs font-semibold uppercase tracking-wider text-civic-green">
              Gouvernements provinciaux
            </span>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Provinces de la RDC
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Sélectionnez votre province pour consulter les propositions ou en soumettre une nouvelle.
            </p>
          </div>

          {loading ? (
            <p className="py-12 text-center text-muted-foreground">Chargement des provinces…</p>
          ) : provinces.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
              Aucune province pour le moment. Les données sont chargées depuis la plateforme.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {provinces.map((province) => (
                <Link
                  key={province.id}
                  to={`/propositions?province_id=${province.id}`}
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 civic-card-shadow hover:border-civic-green/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-civic-green-light">
                    <MapPin className="h-5 w-5 text-civic-green" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-civic-green">
                      {province.nom}
                    </h3>
                    {province.gouvernement && (
                      <p className="text-xs text-muted-foreground">{province.gouvernement}</p>
                    )}
                    <div className="mt-1 flex items-center gap-1 text-xs text-primary font-medium">
                      <FileText className="h-3 w-3" /> Voir les propositions
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-civic-green" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Provinces;
