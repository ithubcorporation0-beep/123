import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, MapPin, Sparkles, Send } from "lucide-react";

export const metadata = {
  title: "Contact Support & Feedback — EduFlow",
  description: "Get in touch with the EduFlow team for support, instructor inquiries, or platform feedback.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="secondary" className="py-1 px-3.5 text-xs font-semibold rounded-full border">
          <Sparkles className="h-3.5 w-3.5 text-primary mr-1.5 inline" /> We're Here to Help
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Get in Touch with EduFlow
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Have a question about our courses, need technical assistance, or want to contribute as an instructor? Send us a message and our team will get back to you promptly.
        </p>
      </section>

      {/* Main Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Methods (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-2xl border bg-card/90 shadow-sm p-6">
            <CardHeader className="p-0 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Mail className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold">Email Inquiries</CardTitle>
              <CardDescription>Direct support for students and creators.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 text-sm">
              <p className="font-semibold text-foreground">support@eduflow.dev</p>
              <p className="text-xs text-muted-foreground mt-1">Average response time: within 24 hours</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card/90 shadow-sm p-6">
            <CardHeader className="p-0 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <MessageSquare className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold">Community Discord</CardTitle>
              <CardDescription>Join live study groups and ask questions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 text-sm">
              <p className="font-semibold text-foreground">discord.gg/eduflow</p>
              <p className="text-xs text-muted-foreground mt-1">Connect with mentors and fellow learners</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card/90 shadow-sm p-6">
            <CardHeader className="p-0 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                <MapPin className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold">Open Source Headquarters</CardTitle>
              <CardDescription>Distributed global team</CardDescription>
            </CardHeader>
            <CardContent className="p-0 text-sm">
              <p className="text-muted-foreground">San Francisco, CA & Remote Worldwide</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="rounded-2xl border bg-card shadow-sm p-8">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-2xl font-bold text-foreground">
                Send a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we will respond via your registered email.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <form className="space-y-5" onSubmit={undefined}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="Alex" required className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Rivera" required className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="alex@example.com" required className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Question regarding Course Curriculum" required className="rounded-xl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what you need help with or share your feedback..."
                    rows={5}
                    required
                    className="rounded-xl resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-xl font-semibold gap-2 mt-2">
                  <Send className="h-4 w-4" />
                  Submit Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
