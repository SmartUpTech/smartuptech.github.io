export interface FAQ {
  question: string;
  answer: string;
}

export interface App {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  themeColor: string;
  category: string;
  playStoreUrl: string;
  icon: string;
  seoTitle?: string;
  features: string[];
  seoKeywords: string[];
  faqs: FAQ[];
  benefits: string[];
}

export const apps: App[] = [
  {
    id: "vedic-panchang",
    name: "Vedic Panchang",
    tagline: "Your Daily Spiritual Guide",
    shortDescription: "Comprehensive Hindu Panchang with Tithi, Nakshatra, Muhurat, and Festival information.",
    longDescription: "Deep dive into ancient wisdom with accurate Tithi, Nakshatra, and Muhurat calculations. Vedic Panchang is designed for clarity and spiritual precision, providing you with all the essential information to align your daily life with cosmic rhythms.",
    themeColor: "#FF9933", // Saffron
    category: "Utility & Lifestyle",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.hinducalendar",
    icon: "/vedic-panchang.webp",
    seoTitle: "Vedic Panchang App | Hindu Calendar, Tithi & Muhurat",
    features: ["Daily Panchang", "Tithi & Nakshatra", "Yoga & Muhurat", "Hindu Festivals", "Sunrise & Sunset", "Multiple Languages", "Offline Access"],
    seoKeywords: ["Vedic Panchang", "Hindu Calendar", "Panchang App", "Festival Calendar", "Muhurat App"],
    benefits: [
      "Plan your auspicious events with accurate Muhurat timings.",
      "Stay connected to your cultural roots with festival notifications.",
      "Understand the cosmic influences on your day-to-day life.",
      "Access traditional wisdom anywhere, even without an internet connection.",
      "Easy-to-use interface designed for all age groups."
    ],
    faqs: [
      { question: "Is Vedic Panchang available offline?", answer: "Yes, the core Panchang calculations and festival information are available offline." },
      { question: "Does it support multiple languages?", answer: "Yes, the app supports several Indian languages for a more personalized experience." },
      { question: "How accurate are the Muhurat timings?", answer: "Our calculations are based on standard Vedic astronomical algorithms ensuring high precision." },
      { question: "Can I see sunrise and sunset times for my location?", answer: "Yes, the app uses your location to provide accurate local sunrise and sunset timings." },
      { question: "Is the app free to use?", answer: "Yes, Vedic Panchang is free to download and use with all essential features." }
    ]
  },
  {
    id: "today",
    name: "Today",
    tagline: "International & National Days",
    shortDescription: "Discover international days, national observances, and awareness events happening around the world.",
    longDescription: "Never miss an important event. Discover what the world is celebrating today with a clean, distraction-free interface. Today brings you a curated list of international observances, historical events, and national celebrations.",
    themeColor: "#4F46E5", // Indigo
    category: "Information",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.three65days",
    icon: "/today.webp",
    seoTitle: "Today App | International Days & Awareness Calendar",
    features: ["International Days", "National Days", "Awareness Events", "Daily Discoveries", "Search Events", "Historical Information"],
    seoKeywords: ["International Days App", "Today Special Day", "Awareness Calendar", "National Days Calendar"],
    benefits: [
      "Broaden your global perspective by learning about different observances.",
      "Get daily inspiration for social media content or school projects.",
      "Stay informed about important health and social awareness days.",
      "Easy to browse through the year's calendar of events.",
      "Lightweight app that won't take up much space on your device."
    ],
    faqs: [
      { question: "How often is the event list updated?", answer: "Our database is updated regularly to include the latest international and national observances." },
      { question: "Can I search for a specific day?", answer: "Yes, the app includes a search feature to find events for any date of the year." },
      { question: "Are the descriptions of the days detailed?", answer: "We provide concise yet informative descriptions for each event to give you the context you need." },
      { question: "Does it work without internet?", answer: "The daily event list is cached, but a connection is recommended for the most up-to-date info." },
      { question: "Is there a notification feature?", answer: "Yes, you can enable daily notifications to stay updated on each day's significance." }
    ]
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    tagline: "Precision in your pocket",
    shortDescription: "Fast and accurate unit conversion tool supporting multiple measurement categories.",
    longDescription: "Elegant, fast, and comprehensive conversion for all your professional needs. No clutter, just the results you need. Whether you are a student, professional, or DIY enthusiast, this tool simplifies complex conversions.",
    themeColor: "#14B8A6", // Teal
    category: "Productivity",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.unitconverter",
    icon: "/unit-converter.webp",
    seoTitle: "Unit Converter App | Fast & Accurate Measurement Conversion",
    features: ["Length & Weight", "Temperature & Area", "Volume & Currency", "Scientific Units", "Instant Conversion", "Offline Mode"],
    seoKeywords: ["Unit Converter", "Measurement Converter", "Currency Converter", "Conversion Calculator"],
    benefits: [
      "Save time with instant results as you type.",
      "Perform conversions across 100+ categories with ease.",
      "Reliable tool for professional and academic use.",
      "Works perfectly offline for on-the-go calculations.",
      "Minimalist design reduces cognitive load and improves speed."
    ],
    faqs: [
      { question: "Does it support currency conversion?", answer: "Yes, currency conversion is supported with rates that can be updated when online." },
      { question: "Are scientific units included?", answer: "Yes, the app covers a wide range of scientific and engineering units." },
      { question: "Is the interface easy for quick use?", answer: "The app is designed for speed, allowing you to switch categories and units instantly." },
      { question: "How many categories are supported?", answer: "We support over 100 categories of measurement, making it one of the most comprehensive tools available." },
      { question: "Does it require special permissions?", answer: "No, the app is built with privacy in mind and requires minimal permissions." }
    ]
  },
  {
    id: "citizen-calculator",
    name: "Citizen Calculator",
    tagline: "Simplified Taxation",
    shortDescription: "Business calculator with GST calculation, tax calculations, and daily utility functions.",
    longDescription: "Calculate GST instantly with precision. Designed for Indian businesses and professionals who value speed and accuracy. Citizen Calculator brings the familiar interface of traditional calculators to your smartphone with added digital power.",
    themeColor: "#3B82F6", // Blue
    category: "Finance",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.citizengstcalculator",
    icon: "/citizen-calculator.webp",
    seoTitle: "Citizen Calculator | GST & Business Calculator",
    features: ["GST Add/Remove", "Tax Calculations", "Percentage Calculations", "Business Calculations", "History Tape", "Custom Tax Rates"],
    seoKeywords: ["GST Calculator", "Citizen Calculator", "Business Calculator", "Tax Calculator"],
    benefits: [
      "Simplify your business accounting with dedicated GST buttons.",
      "Familiar layout ensures no learning curve for traditional calculator users.",
      "Accurate percentage calculations for trade and commerce.",
      "Review your calculation history to avoid errors.",
      "Fast, reliable, and optimized for low-end devices."
    ],
    faqs: [
      { question: "Can I customize the GST rates?", answer: "Yes, you can set custom tax rates to match your specific business requirements." },
      { question: "Is there a history feature?", answer: "Yes, the app maintains a history of your recent calculations for easy reference." },
      { question: "How do I add or remove GST?", answer: "Dedicated GST+ and GST- buttons allow you to calculate inclusive or exclusive amounts with one tap." },
      { question: "Is it suitable for shopkeepers?", answer: "Absolutely, it's designed specifically for daily business use and retail environments." },
      { question: "Does it support large number calculations?", answer: "Yes, the calculator is optimized for high-precision business math." }
    ]
  },
  {
    id: "sindhi-tipno",
    name: "Sindhi Tipno",
    tagline: "Preserving Heritage",
    shortDescription: "Traditional Sindhi calendar application with important dates, festivals, and cultural information.",
    longDescription: "The most authentic Sindhi calendar with all festivals and cultural dates, bringing tradition to your modern device. Sindhi Tipno helps you stay connected with your community's heritage and never miss an important cultural event.",
    themeColor: "#F59E0B", // Amber
    category: "Culture",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.sindhitipno",
    icon: "/sindhi-tipno.webp",
    seoTitle: "Sindhi Tipno App | Sindhi Calendar & Cultural Dates",
    features: ["Sindhi Calendar", "Sindhi Festivals", "Cultural Dates", "Traditional Information", "Daily Reference", "Offline Access"],
    seoKeywords: ["Sindhi Tipno", "Sindhi Calendar", "Sindhi Festival Calendar", "Sindhi Panchang"],
    benefits: [
      "Stay informed about all upcoming Sindhi festivals and fasts.",
      "Preserve cultural knowledge for the next generation.",
      "Quick access to important community dates.",
      "Authentic data verified by community experts.",
      "Clean, modern interface for a traditional tool."
    ],
    faqs: [
      { question: "What is a Tipno?", answer: "A Tipno is a traditional Sindhi calendar used to track lunar dates and festivals." },
      { question: "Are all Sindhi festivals included?", answer: "Yes, we include all major and minor Sindhi festivals, including Cheti Chand and others." },
      { question: "Is the data accurate?", answer: "Yes, the calendar data is carefully compiled according to traditional Sindhi customs." },
      { question: "Can I use it offline?", answer: "Yes, the entire calendar and festival list is accessible without an internet connection." },
      { question: "Is there a community event section?", answer: "Currently, it focuses on the traditional calendar, but community features are planned." }
    ]
  }
];
