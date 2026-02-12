import Layout from "@/components/Layout";
import { MapPin, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const provinces = [
  { name: "Kinshasa", proposals: 456, capital: "Kinshasa" },
  { name: "Haut-Katanga", proposals: 234, capital: "Lubumbashi" },
  { name: "Nord-Kivu", proposals: 312, capital: "Goma" },
  { name: "Sud-Kivu", proposals: 198, capital: "Bukavu" },
  { name: "Kasaï Central", proposals: 87, capital: "Kananga" },
  { name: "Équateur", proposals: 65, capital: "Mbandaka" },
  { name: "Tshopo", proposals: 112, capital: "Kisangani" },
  { name: "Lualaba", proposals: 143, capital: "Kolwezi" },
  { name: "Kongo Central", proposals: 98, capital: "Matadi" },
  { name: "Ituri", proposals: 176, capital: "Bunia" },
  { name: "Maniema", proposals: 54, capital: "Kindu" },
  { name: "Tanganyika", proposals: 89, capital: "Kalemie" },
];

const Provinces = () => {
  const navigate = useNavigate();

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
              Sélectionnez votre province pour soumettre des propositions à votre gouvernement provincial.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {provinces.map((province) => (
              <div
                key={province.name}
                onClick={() => navigate(`/propositions?province=${encodeURIComponent(province.name)}`)}
                className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 civic-card-shadow hover:border-civic-green/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-civic-green-light">
                  <MapPin className="h-5 w-5 text-civic-green" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-civic-green">
                    {province.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">Chef-lieu : {province.capital}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" /> {province.proposals} propositions
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-civic-green" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Provinces;
