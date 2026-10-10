import { CategoryTiles } from "@/components/home/category-tiles";
import { CommunityTeaser } from "@/components/home/community-teaser";
import { CraftStory } from "@/components/home/craft-story";
import { Hero } from "@/components/home/hero";
import { NewArrivalsStrip } from "@/components/home/new-arrivals-strip";
import { VisitCta } from "@/components/home/visit-cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryTiles />
      <NewArrivalsStrip />
      <CraftStory />
      <CommunityTeaser />
      <VisitCta />
    </main>
  );
}
