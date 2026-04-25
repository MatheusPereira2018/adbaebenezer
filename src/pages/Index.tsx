import { Hero } from "@/components/landing/Hero";
import { MainVideo } from "@/components/landing/MainVideo";
import { Institutional } from "@/components/landing/Institutional";
import { UpdatesCarousel } from "@/components/landing/UpdatesCarousel";
import { SiteFooter } from "@/components/landing/SiteFooter";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <MainVideo />
      <UpdatesCarousel />
      <Institutional />
      <SiteFooter />
    </main>
  );
};

export default Index;
