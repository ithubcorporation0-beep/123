import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jessica Taylor",
    role: "Frontend Developer at Vercel ecosystem",
    comment: "The Next.js and TypeScript course on EduFlow helped me bridge the gap between building simple SPAs and deploying production-ready server components. The progress tracking made it easy to pick up where I left off.",
    rating: 5,
  },
  {
    name: "Carlos Mendez",
    role: "UX Designer & Design Systems Lead",
    comment: "I love the clarity of the curriculum structure. Knowing exactly what each module teaches before enrolling makes planning my study hours effortless.",
    rating: 5,
  },
  {
    name: "Amina Al-Mansoor",
    role: "Full-Stack Software Engineer",
    comment: "The automated quiz validation after each lesson is incredible. You cannot just skim video content; you actually retain the material and earn a verifiable certificate at the end.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/20 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Trusted by Learners & Creators
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            See how developers and designers use EduFlow to master technical skills and advance their careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <Card key={idx} className="rounded-2xl border bg-card/90 shadow-sm flex flex-col justify-between p-6">
              <CardContent className="p-0">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </CardContent>

              <div className="mt-6 pt-4 border-t flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
