import Layout from "@/components/Layout";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { ministries, getProposalsByMinistry } from "@/data/ministries";

const Ministeres = () => {
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
              Parcourez les ministères nationaux et consultez leur tableau de bord avec toutes les propositions citoyennes.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map((ministry) => {
              const proposalCount = getProposalsByMinistry(ministry.name).length;
              return (
                <Link
                  key={ministry.id}
                  to={`/ministeres/${ministry.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 civic-card-shadow hover:border-primary/30"
                >
                  <span className="text-3xl">{ministry.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary">
                      {ministry.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ministry.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {proposalCount} proposition{proposalCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ministeres;
