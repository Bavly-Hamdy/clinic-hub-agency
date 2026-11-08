import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import StudioPhilosophy from "@/components/StudioPhilosophy";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getSiteData } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const { services, works, settings } = await getSiteData();

  return (
    <main className="relative min-h-screen bg-ink">
      <Header whatsapp={settings.whatsapp} />
      <Hero whatsapp={settings.whatsapp} />
      <Services services={services} whatsapp={settings.whatsapp} />
      <StudioPhilosophy />
      <Portfolio works={works} services={services} whatsapp={settings.whatsapp} />
      <Contact
        whatsapp={settings.whatsapp}
        instagram={settings.instagram}
        email={settings.email}
      />
      <FloatingWhatsApp whatsapp={settings.whatsapp} />
    </main>
  );
}
