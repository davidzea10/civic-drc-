import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import presidentImg from "@/assets/president.jpg";
import mobutuImg from "@/assets/Mobutu.jpg";
import kabilaImg from "@/assets/Kabila.jpg";
import laurentKImg from "@/assets/LaurentK.jpg";

interface SlideData {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: SlideData[] = [
  {
    image: presidentImg,
    title: "S.E. Félix Antoine Tshisekedi Tshilombo",
    subtitle: "Président de la République Démocratique du Congo",
    description:
      "Chef de l'État et garant de la Constitution, le Président Tshisekedi œuvre pour le développement et la modernisation de la RDC.",
  },
  {
    image: mobutuImg,
    title: "Maréchal Mobutu Sese Seko",
    subtitle: "Président du Zaïre (1965–1997)",
    description:
      "Figure historique de la RDC, Mobutu a dirigé le pays pendant plus de trois décennies sous le nom de Zaïre.",
  },
  {
    image: laurentKImg,
    title: "Laurent-Désiré Kabila",
    subtitle: "Président de la RDC (1997–2001)",
    description:
      "Artisan du changement de régime en 1997, Laurent-Désiré Kabila a redonné au pays son nom de République Démocratique du Congo.",
  },
  {
    image: kabilaImg,
    title: "Joseph Kabila Kabange",
    subtitle: "Président de la RDC (2001–2019)",
    description:
      "Successeur de son père, Joseph Kabila a dirigé le pays pendant près de deux décennies et supervisé la transition démocratique.",
  },
];

const PresidentSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goToSlide = useCallback(
    (index: number, dir: "left" | "right" = "right") => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating]
  );

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next, "right");
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev, "left");
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent" />

      <div className="civic-container relative z-10 py-16 md:py-24">
        <div className="mb-8 text-center">
          <span className="mb-2 inline-block rounded-full bg-yellow-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-yellow-400">
            🇨🇩 Les Présidents de la RDC
          </span>
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Histoire présidentielle
          </h2>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Slider Container */}
          <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8 p-6 md:p-10 min-h-[400px]">
              {/* Image */}
              <div className="relative w-full md:w-2/5 flex-shrink-0">
                <div
                  className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 ease-in-out ${
                    isAnimating
                      ? direction === "right"
                        ? "animate-slide-in-right"
                        : "animate-slide-in-left"
                      : ""
                  }`}
                >
                  <div className="aspect-[3/4] w-full">
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-3 -right-3 h-24 w-24 rounded-2xl border-2 border-yellow-500/30 -z-10" />
                <div className="absolute -top-3 -left-3 h-24 w-24 rounded-2xl border-2 border-blue-500/30 -z-10" />
              </div>

              {/* Content */}
              <div
                className={`flex-1 text-center md:text-left transition-all duration-700 ease-in-out ${
                  isAnimating
                    ? "opacity-0 translate-y-4"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-xs font-medium text-yellow-300">
                    {slides[currentSlide].subtitle}
                  </span>
                </div>
                <h3 className="mb-4 font-display text-2xl font-bold text-white md:text-3xl leading-tight">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-base leading-relaxed text-white/70 mb-6">
                  {slides[currentSlide].description}
                </p>

                {/* Progress dots */}
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        goToSlide(
                          index,
                          index > currentSlide ? "right" : "left"
                        )
                      }
                      className={`transition-all duration-300 rounded-full ${
                        index === currentSlide
                          ? "h-3 w-10 bg-yellow-400"
                          : "h-3 w-3 bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 border border-white/10 md:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110 border border-white/10 md:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Slide counter */}
        <div className="mt-6 text-center">
          <span className="text-sm text-white/50">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>
    </section>
  );
};

export default PresidentSlider;
