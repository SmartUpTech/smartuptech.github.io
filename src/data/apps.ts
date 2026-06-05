export interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  category: string;
  playStoreUrl: string;
  features: string[];
}

export const apps: App[] = [
  {
    id: "vedic-panchang",
    name: "Vedic Panchang",
    tagline: "Your Daily Spiritual Guide",
    description: "Deep dive into ancient wisdom with accurate Tithi, Nakshatra, and Muhurat calculations. Designed for clarity and spiritual precision.",
    themeColor: "#FF9933", // Saffron
    category: "Utility & Lifestyle",
    playStoreUrl: "#",
    features: ["Accurate Tithi & Nakshatra", "Muhurat Timings", "Daily Panchang Highlights"]
  },
  {
    id: "today",
    name: "Today",
    tagline: "International & National Days",
    description: "Never miss an important event. Discover what the world is celebrating today with a clean, distraction-free interface.",
    themeColor: "#4F46E5", // Indigo
    category: "Information",
    playStoreUrl: "#",
    features: ["Global Observances", "Historical Events", "Custom Notifications"]
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    tagline: "Precision in your pocket",
    description: "Elegant, fast, and comprehensive conversion for all your professional needs. No clutter, just the results you need.",
    themeColor: "#14B8A6", // Teal
    category: "Productivity",
    playStoreUrl: "#",
    features: ["100+ Categories", "Instant Conversion", "Offline Mode"]
  },
  {
    id: "gst-calculator",
    name: "GST Calculator",
    tagline: "Simplified Taxation",
    description: "Calculate GST instantly with precision. Designed for Indian businesses and professionals who value speed and accuracy.",
    themeColor: "#3B82F6", // Blue
    category: "Finance",
    playStoreUrl: "#",
    features: ["Inclusive/Exclusive Modes", "Custom Tax Rates", "Detailed Breakdown"]
  },
  {
    id: "sindhi-tipno",
    name: "Sindhi Tipno",
    tagline: "Preserving Heritage",
    description: "The most authentic Sindhi calendar with all festivals and cultural dates, bringing tradition to your modern device.",
    themeColor: "#F59E0B", // Amber
    category: "Culture",
    playStoreUrl: "#",
    features: ["Traditional Calendar", "Cultural Festivals", "Community Events"]
  }
];
