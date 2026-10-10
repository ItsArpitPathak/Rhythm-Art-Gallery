// PLACEHOLDER content: titles, places, dates and text are invented for the concept.
// The shop owner replaces these with real events (and real photos in public/images/community/).

export type CommunityEvent = {
  slug: string;
  title: string;
  place: string;
  date: string; // display text
  summary: string;
  image: string;
  kind: "Selected" | "Exhibited" | "Workshop" | "Giving back";
};

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    slug: "heritage-craft-mela",
    title: "Heritage Craft Mela",
    place: "City Cultural Centre",
    date: "February 2026",
    summary: "Selected among local boutiques to showcase hand-embroidered sarees to over a thousand visitors.",
    image: "/images/community/craft-market-1.jpg",
    kind: "Selected",
  },
  {
    slug: "artisan-women-showcase",
    title: "Women Artisans Showcase",
    place: "Town Hall",
    date: "November 2025",
    summary: "Stood beside the embroiderers behind our collection and shared their stories with shoppers.",
    image: "/images/community/artisan-portrait-1.jpg",
    kind: "Exhibited",
  },
  {
    slug: "festive-basket-bazaar",
    title: "Festive Basket Bazaar",
    place: "Riverside Market",
    date: "October 2025",
    summary: "A pop-up stall of woven bags and purses alongside local basket-makers.",
    image: "/images/community/basket-stalls-1.jpg",
    kind: "Exhibited",
  },
  {
    slug: "festive-fashion-showcase",
    title: "Festive Fashion Showcase",
    place: "Grand Ballroom",
    date: "September 2025",
    summary: "One of a handful of boutiques selected to present bridal and festive wear on the runway.",
    image: "/images/story/embroidered-lehenga-1.jpg",
    kind: "Selected",
  },
  {
    slug: "embroidery-learning-circle",
    title: "Embroidery Learning Circle",
    place: "Boutique studio",
    date: "Monthly",
    summary: "Open sessions where neighbours learn basic stitches from our craftswomen. No cost, all welcome.",
    image: "/images/story/embroidery-hoop-1.jpg",
    kind: "Workshop",
  },
];
