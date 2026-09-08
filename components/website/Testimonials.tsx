import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Sparkles, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    name: "Jessica Taylor",
    role: "Senior Frontend Engineer",
    company: "FinTech Scale-up",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    comment:
      "The Next.js and TypeScript architecture course gave our team the exact blueprints needed to migrate to Server Components without regressions. The progression tracking and code notes are top tier.",
    rating: 5,
  },
  {
    name: "Carlos Mendez",
    role: "Design Systems Lead",
    company: "Product Studio",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    comment:
      "I love the clarity of the curriculum structure. Knowing exactly what each module covers and having immediate access to project files made leveling up my engineering skills effortless.",
    rating: 5,
  },
  {
    name: "Amina Al-Mansoor",
    role: "Cloud & DevOps Specialist",
    company: "Enterprise Cloud",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    comment:
      "The Docker and Kubernetes track went far beyond basics. Real multi-stage pipelines and verifiable credential certificates you can immediately share on LinkedIn. Highly recommended!",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/20 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
            Engineering Testimonials
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Validated by Practitioners & Teams
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Read how engineers and technical leaders leverage our curriculums to deploy production systems and accelerate career growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <Card
              key={idx}
              className="rounded-2xl border border-border/80 bg-card shadow-xs flex flex-col justify-between p-6 hover:border-foreground/20 transition-all hover-card-lift"
            >
              <CardContent className="p-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-foreground">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-foreground" />
                    ))}
                  </div>
                  <Quote className="h-4 w-4 text-muted-foreground/40" />
                </div>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                  "{item.comment}"
                </p>
              </CardContent>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-xs text-foreground shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-foreground">{item.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{item.role} • {item.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
