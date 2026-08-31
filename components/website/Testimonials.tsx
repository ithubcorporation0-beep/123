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
    <section className="py-24 bg-muted/20 border-y border-border/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Learner Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Trusted by Engineers & Designers
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            See how developers and technical leaders use EduFlow to master modern technologies and advance their careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <Card
              key={idx}
              className="rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md shadow-lg shadow-primary/5 flex flex-col justify-between p-8 transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
            >
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-primary/30" />
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </CardContent>

              <div className="mt-8 pt-5 border-t border-border/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-sm shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.role} • {item.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
