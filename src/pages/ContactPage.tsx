import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ContactPage = () => {
  const { addContactMessage } = useCart();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    addContactMessage({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() });
    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto section-padding">
      <h1 className="section-title text-center mb-10">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Get in Touch</h2>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">123 Food Street, Flavor Town, India 400001</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+91 98765 43210</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">hello@royalrestaurant.com</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your Name" maxLength={100} className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground" />
          <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Your Email" maxLength={255} className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground" />
          <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Your Message" maxLength={1000} rows={5} className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground resize-none" />
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
