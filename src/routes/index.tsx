import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Ticker } from "@/components/ticker";
import {
  Hero,
  Why,
  About,
  Programs,
  Playground,
  Gallery,
  Blogs,
  Announcements,
  ReachUs,
  Footer,
  FloatingButtons,
} from "@/components/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Payitragam Preschool — Nellaiappar Kanthimathi | Tirunelveli" },
      {
        name: "description",
        content:
          "Nellaiappar Kanthimathi Payitragam — Multiple Intelligence Preschool in Tirunelveli, Tamilnadu. Montessori, Reggio Emilia & Play Way approach. 500+ happy students.",
      },
      {
        name: "keywords",
        content:
          "Preschool Tirunelveli, Nursery Tirunelveli, Montessori, Payitragam, Early Childhood Education, Junior KG, Senior KG",
      },
      { property: "og:title", content: "Payitragam — #1 Preschool in Tirunelveli" },
      {
        property: "og:description",
        content:
          "Multiple Intelligence-based learning. Montessori, Reggio Emilia & Play Way. Enroll your little one today!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <main>
      <Navbar />
      <Ticker />
      <Hero />
      <Why />
      <About />
      <Programs />
      <Playground />
      <Gallery />
      <Blogs />
      <Announcements />
      <ReachUs />
      <Footer />
      <FloatingButtons />
    </main>
  );
}
