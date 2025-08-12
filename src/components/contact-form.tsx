import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    emailjs: any;
  }
}

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;

    if (window.emailjs) {
      window.emailjs.sendForm('service_c5hnxps', 'template_s5pm6ri', form)
        .then(() => {
          toast({
            title: "Message Sent!",
            description: "Your message was sent successfully. We'll get back to you soon!",
          });
          form.reset();
        })
        .catch((error: any) => {
          console.error('EmailJS error:', error);
          toast({
            title: "Error",
            description: "Oops! Something went wrong. Please try again later.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      toast({
        title: "Error",
        description: "Email service is not available. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Contact Us
        </CardTitle>
        <CardDescription className="text-lg">
          Have questions about the Maker Lab? Get in touch with us!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Subject
            </label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="What is this regarding?"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              name="content"
              id="content"
              placeholder="Tell us how we can help you..."
              required
              className="w-full min-h-[120px]"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};