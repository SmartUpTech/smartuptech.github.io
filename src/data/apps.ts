export interface FAQ {
  question: string;
  answer: string;
}

export interface Screenshot {
  file: string;
  title: string;
  description: string;
}

export interface App {
  id: string;
  name: string;
  topicName: string; // Generic category for articles (e.g., "Panchang", "International Days")
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
  screenshots: Screenshot[];
}

export const apps: App[] = [
  {
    id: "panchang",
    name: "Anant Panchang: Hindu Calendar",
    topicName: "Panchang",
    tagline: "Daily Panchang, Muhurat & Festivals",
    shortDescription: "Location-based Hindu Panchang with Tithi, Nakshatra, Vrat, Muhurat, Choghadiya, festivals, timeline, and smart reminders.",
    longDescription: "Anant Panchang brings daily Panchang, the Hindu calendar, and festival planning into one clear Android app. Pick your city for location-accurate Tithi, Nakshatra, Yoga, Karana, Vaar, sunrise, sunset, moonrise, and moonset—then follow how each element changes through the day on a visual Panchang timeline. Check Abhijit and Brahma Muhurat alongside Rahu Kaal, Gulika Kaal, Yamaganda, Amrit Kaal, and other auspicious or cautionary windows; plan travel, puja, and ceremonies with day and night Choghadiya. Browse festivals month by month, track Ekadashi, Purnima, Amavasya, and other vrat days, set reminders for observances that matter to you, and optionally glance at key details from home screen widgets. Multiple Indian languages and a layout built for everyday use—whether you check Panchang daily or only before an important date.",
    themeColor: "#FF9933", // Saffron
    category: "Utility & Lifestyle",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.hinducalendar",
    icon: "/panchang.webp",
    seoTitle: "Anant Panchang App | Hindu Calendar, Tithi, Vrat & Muhurat | SmartUp Tech",
    features: ["Daily Panchang & Timeline", "Tithi, Nakshatra, Yoga & Karana", "Muhurat & Choghadiya", "Vrat & Fasting Days", "Hindu Festivals Calendar", "Location-Based Timings", "Smart Reminders & Widgets", "Multiple Indian Languages"],
    seoKeywords: ["Anant Panchang", "Anant Panchang: Hindu Calendar", "Panchang App", "Hindu Calendar 2027", "Festival Calendar", "Muhurat App", "Choghadiya", "Ekadashi", "Vrat Reminder", "Drik Panchang", "Kalnirnay", "Hindu Calendar", "Panchangam"],
    benefits: [
      "See exactly when Tithi, Nakshatra, Yoga, and Karana change with a day-long Panchang timeline.",
      "Plan puja, travel, and auspicious work using Muhurat, Choghadiya, and inauspicious kaal timings for your city.",
      "Never miss Ekadashi, festivals, or vrat days with reminders tuned to the Hindu calendar.",
      "Use accurate sun and moon timings and Vikram Samvat details wherever you live—in India or abroad.",
      "Stay informed in the language you prefer with support for multiple Indian languages."
    ],
    faqs: [
      { question: "Is Anant Panchang available offline?", answer: "Yes. Core Panchang calculations, festival lists, and calendar browsing work offline once data is loaded." },
      { question: "Does it support multiple languages?", answer: "Yes. You can use Anant Panchang in several Indian languages for a more comfortable daily reference." },
      { question: "How accurate are the Muhurat and kaal timings?", answer: "Timings are computed from standard Hindu astronomical methods using your selected location, sunrise, and sunset." },
      { question: "Can I set reminders for festivals and vrat?", answer: "Yes. Smart reminders help you track festivals, Ekadashi, Purnima, Amavasya, Pradosh, and other important dates." },
      { question: "Does the app include Choghadiya and a Panchang timeline?", answer: "Yes. Day and night Choghadiya are listed with start and end times, and the timeline shows how Panchang elements shift through the day." },
      { question: "Is the app free to use?", answer: "Yes. Anant Panchang is free to download with essential Panchang, calendar, and festival features." }
    ],
    screenshots: [
      { file: "screenshot-panchang-1.webp", title: "Daily Panchang", description: "Complete Panchang at a glance—Tithi, Nakshatra, Yoga, Karana, sunrise, sunset, and festivals for your location." },
      { file: "screenshot-panchang-2.webp", title: "Modern Calendar View", description: "Modern Heritage. A beautifully clean interpretation of the traditional Hindu calendar with festivals and lunar months." },
      { file: "screenshot-panchang-5.webp", title: "Accurate Sun & Moon Timings", description: "Celestial Sync. High-precision data for localized sun and moon timings, Brahma Muhurta, and next Purnima and Amavasya." },
      { file: "screenshot-panchang-3.webp", title: "Day & Night Choghadiya", description: "Daily Flow. Master the cosmic influences of Choghadiya throughout the day and night." },
      { file: "screenshot-panchang-4.webp", title: "Live Hindu Clock (Ghadi)", description: "Live Ghadi. The heartbeat of tradition, pulsing in real-time on your device." },
      { file: "screenshot-panchang-6.webp", title: "Upcoming Festivals", description: "Festival Guide. Your essential companion for every cultural celebration, with quick reminders." },
      { file: "screenshot-panchang-7.webp", title: "Festivals by Month", description: "Browse Hindu festivals and observances month by month, with dates and reminder controls." },
      { file: "screenshot-panchang-8.webp", title: "Shubh & Ashubh Muhurat", description: "Muhurat Precision. See auspicious windows like Abhijit and Amrit Kaal alongside Rahu Kaal, Yamaganda, and Gulik Kaal." },
      { file: "screenshot-panchang-9.webp", title: "Panchang Timeline", description: "Follow the day on a visual timeline—muhurats, tithi changes, moonrise, and sunset in chronological order." },
      { file: "screenshot-panchang-10.webp", title: "Vrat Reminder", description: "Set daily and weekly fasting reminders so you never miss an observance." }
    ]
  },
  {
    id: "today",
    name: "Today",
    topicName: "Today & History",
    tagline: "Every Day Has a Story",
    shortDescription: "Discover what makes today special—international and national days, on-this-day history, famous birthdays, and memorials.",
    longDescription: "Today is your daily companion for curiosity and context. See which international days, national observances, and awareness campaigns fall on today's date, then explore what happened on this day in history—from breakthroughs and milestones to cultural turning points. Browse famous birthdays and death anniversaries, filter discoveries by region and interest, and jump to any date on the calendar to plan ahead or look back. Daily notifications keep you in sync with meaningful anniversaries, and optional brain games offer a quick break between reads. Whether you are preparing for exams, building social content, or simply wondering why today matters, Today connects dates with stories worth knowing.",
    themeColor: "#4F46E5", // Indigo
    category: "Information",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.three65days",
    icon: "/today.webp",
    seoTitle: "Today App | Special Days, History, Birthdays & Daily Facts | SmartUp Tech",
    features: ["International & National Days", "On This Day in History", "Famous Birthdays", "Death Anniversaries", "Calendar & Search", "Regional Filters", "Daily Notifications", "Daily Games & Puzzles"],
    seoKeywords: ["International Days App", "Today Special Day", "What Happened Today in History", "Famous Birthdays Today", "Awareness Calendar", "National Days Calendar", "Daily History", "Important Days"],
    benefits: [
      "Answer “what’s special about today?” with observances, history, and notable lives in one place.",
      "Browse any date’s international days, milestones, birthdays, and memorials for planning or learning.",
      "Filter by region and interests so the feed matches what you care about.",
      "Get daily reminders when you want a nudge about today’s significance.",
      "Enjoy a clean, readable layout plus light puzzles when you want a quick mental break."
    ],
    faqs: [
      { question: "What can I discover in the Today app?", answer: "International and national days, historical events, famous birthdays, death anniversaries, and related facts for any date you choose." },
      { question: "Can I search or browse other dates?", answer: "Yes. Use the calendar and search tools to explore upcoming observances or past events throughout the year." },
      { question: "Are there daily notifications?", answer: "Yes. You can enable reminders to stay informed about important days and anniversaries." },
      { question: "Does Today include games?", answer: "Yes. Quick daily games and brain challenges are built in alongside the reading experience." },
      { question: "Who is Today useful for?", answer: "Students, teachers, history fans, quiz lovers, HR teams planning awareness days, and anyone curious about what makes each day unique." },
      { question: "Does it work without internet?", answer: "Cached content is available offline for many views; an internet connection helps keep listings fresh." }
    ],
    screenshots: [
      { file: "screenshot-today-9.webp", title: "Global Observances", description: "World Tapestry. Stay connected with the diverse international and national events happening every day." },
      { file: "screenshot-today-10.webp", title: "Historical Milestones", description: "Echoes of Time. Journey through the past to discover the monumental events that unfolded on this very date." },
      { file: "screenshot-today-11.webp", title: "Legendary Birthdays", description: "Human Legacy. Celebrate the lives and impact of the thinkers, leaders, and icons born today." },
      { file: "screenshot-today-12.webp", title: "Solemn Tributes", description: "Lasting Impact. Honor the world's most significant memorials and share their spirit with your community." },
      { file: "screenshot-today-2.webp", title: "Daily Discoveries", description: "Fresh Perspectives. Discover a curated selection of unique observances and meaningful celebrations from across the globe." },
      { file: "screenshot-today-5.webp", title: "Enlightening Facts", description: "Infinite Wisdom. Uncover fascinating historical data and awareness facts with effortless speed and precision." },
      { file: "screenshot-today-8.webp", title: "Global Connection", description: "United Awareness. Stay in sync with official UN observances and themes that bring international communities together." }
    ]
  },
  {
    id: "graphy-calculator",
    name: "Calculator+",
    topicName: "Calculator+",
    tagline: "Calculate. Convert. Understand.",
    shortDescription: "Smart calculator with unit conversion, scientific math, and Graphy visual explanations that show how every answer was built.",
    longDescription: "Calculator+ combines fast everyday calculations, comprehensive unit conversion, and the Graphy Engine that turns results into clear visual explanations. Use the calculator exactly as before — then open Graphy to see flowcharts, blocks, gauges, and charts that reveal how your answer was produced. From percentage and BMI to EMI and length conversion, every calculation becomes easier to understand, verify, and trust.",
    themeColor: "#14B8A6", // Teal
    category: "Productivity",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.unitconverter",
    icon: "/graphy-calculator.webp",
    seoTitle: "Calculator+ App | Visual Math, Unit Conversion & Graphy | SmartUp Tech",
    features: ["Graphy Visual Explanations", "Unit Conversion", "Scientific Calculator", "Percentage & BMI", "EMI & Finance", "History & Favorites", "Offline Mode"],
    seoKeywords: ["Calculator+", "Calculator Plus", "Graphy Calculator", "Visual Calculator", "Unit Converter", "Percentage Calculator", "BMI Calculator", "EMI Calculator", "Graphy Engine"],
    benefits: [
      "See how every answer was built with optional Graphy visual explanations.",
      "Convert units across 100+ categories with instant, accurate results.",
      "Switch between flowchart, blocks, gauge, and chart renderers for the same calculation.",
      "One shared calculation engine — Graphy never computes independently of your result.",
      "Fast calculator workflows preserved; Graphy is an optional insight panel, not a replacement."
    ],
    faqs: [
      { question: "What is Calculator+?", answer: "Calculator+ is SmartUp Tech's all-in-one calculator and unit converter with optional Graphy visual explanations for every result." },
      { question: "What is Graphy?", answer: "Graphy is the visual explanation layer inside Calculator+ that transforms your calculation result into flowcharts, blocks, gauges, or charts — showing exactly how the answer was produced." },
      { question: "Does Graphy change my calculation result?", answer: "No. Graphy and the calculator share one calculation path. Graphy visualizes the same evaluated result; it never calculates independently." },
      { question: "Which calculators support Graphy?", answer: "Graphy is rolling out across calculators including Percentage, BMI, EMI, Length Converter, and more. Flowchart is the universal fallback for every calculator." },
      { question: "Can I still use it as a regular calculator?", answer: "Yes. Your existing fast calculator and unit conversion workflows are preserved. Graphy is optional — open it when you want to understand the math." },
      { question: "Does it work offline?", answer: "Yes. Core calculations and unit conversions work offline. Currency rates update when you are online." }
    ],
    screenshots: [
      { file: "screenshot-graphy-1.webp", title: "Graphy Flowchart", description: "Visual Clarity. See every step from input to result in a clean, connected flowchart." },
      { file: "screenshot-graphy-2.webp", title: "Blocks Renderer", description: "Structured Insight. Color-coded blocks break complex formulas into digestible pieces." },
      { file: "screenshot-graphy-3.webp", title: "Unit Conversion", description: "Instant Precision. Convert length, weight, temperature, currency, and 100+ categories as you type." },
      { file: "screenshot-graphy-4.webp", title: "Percentage & BMI", description: "Decision Support. Gauges and range indicators for percentage, BMI, and bounded results." },
      { file: "screenshot-graphy-5.webp", title: "EMI Breakdown", description: "Financial Clarity. Bar charts and tables reveal principal, interest, and amortization at a glance." }
    ]
  },
  {
    id: "citizen-calculator",
    name: "Citizen Calculator",
    topicName: "Calculator",
    tagline: "Simplified Taxation",
    shortDescription: "Business calculator with GST calculation, tax calculations, and daily utility functions.",
    longDescription: "Calculate GST instantly with precision. Designed for Indian businesses and professionals who value speed and accuracy. Citizen Calculator brings the familiar interface of traditional calculators to your smartphone with added digital power.",
    themeColor: "#3B82F6", // Blue
    category: "Finance",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.citizengstcalculator",
    icon: "/citizen-calculator.webp",
    seoTitle: "Citizen Calculator | GST & Business Calculator | SmartUp Tech",
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
    ],
    screenshots: [
      { file: "screenshot-calculator-1.webp", title: "GST Made Simple", description: "One-Tap Tax. Dedicated GST+ and GST- buttons for lightning-fast business calculations." },
      { file: "screenshot-calculator-2.webp", title: "Business Logic", description: "Professional Grade. Accurate percentage and markup tools designed for Indian trade." },
      { file: "screenshot-calculator-3.webp", title: "Calculation History", description: "Digital Tape. Review your previous steps to ensure complete accuracy in your accounting." },
      { file: "screenshot-calculator-4.webp", title: "Custom Tax Rates", description: "Tailored to You. Set up multiple tax brackets to match your specific business needs." },
      { file: "screenshot-calculator-5.webp", title: "Classic Layout", description: "Familiar Power. The reliability of a physical calculator, enhanced with digital precision." },
      { file: "screenshot-calculator-6.webp", title: "Accurate Results", description: "High precision. Optimized for high-precision business math and financial accuracy." },
      { file: "screenshot-calculator-7.webp", title: "Fast and Reliable", description: "Smooth Performance. Optimized for all devices, ensuring a seamless experience every time." }
    ]
  },
  {
    id: "sindhi-tipno",
    name: "Sindhi Tipno",
    topicName: "Sindhi Calendar",
    tagline: "Tradition in Your Pocket",
    shortDescription: "Digital Sindhi Tipno with festivals, Tithi, Nakshatra, Muhurat, sun and moon timings, search, and reminders.",
    longDescription: "Sindhi Tipno carries the familiar paper Tipno into a modern app built for the global Sindhi community. Browse month-by-month or day-by-day views of festivals, auspicious dates, and cultural occasions; follow Tithi and Nakshatra as they change, check Muhurat when timing matters, and see sunrise, sunset, moonrise, moonset, and moon phases for your chosen location—at home or abroad. Search for a festival or date in seconds, skim upcoming events at a glance, and set reminders so Cheti Chand, Chaliho, and other community days never slip by. Traditional calendar information meets a clean interface, location-aware timings, and tools younger generations actually use.",
    themeColor: "#F59E0B", // Amber
    category: "Culture",
    playStoreUrl: "https://play.google.com/store/apps/details?id=net.smartlogic.sindhitipno",
    icon: "/sindhi-tipno.webp",
    seoTitle: "Sindhi Tipno App | Sindhi Calendar, Tithi & Festival Reminders | SmartUp Tech",
    features: ["Sindhi Festival Calendar", "Monthly & Daily Views", "Tithi & Nakshatra", "Muhurat Timings", "Sun & Moon Timings", "Moon Phases", "Upcoming Events", "Search & Reminders"],
    seoKeywords: ["Sindhi Tipno", "Sindhi Calendar", "Sindhi Festival Calendar", "Sindhi Panchang", "Cheti Chand", "Sindhi Tipno App", "Sindhi festivals"],
    benefits: [
      "Keep Sindhi festivals and auspicious days visible in a calendar made for the community.",
      "Know local sun and moon timings and lunar phases wherever you select your city.",
      "Find the right Muhurat and daily Tithi/Nakshatra details without a paper Tipno.",
      "Search any occasion quickly and preview what is coming up next.",
      "Lightweight app with reminders so important dates reach you on time."
    ],
    faqs: [
      { question: "What is a Tipno?", answer: "A Tipno is the traditional Sindhi calendar families use to track lunar dates, festivals, and auspicious days." },
      { question: "Are Sindhi festivals and cultural dates included?", answer: "Yes. Major and community occasions—including Cheti Chand and other Sindhi festivals—are listed with calendar and reminder support." },
      { question: "Can I see Tithi, Nakshatra, and Muhurat?", answer: "Yes. Daily Tithi and Nakshatra are shown with change timings, and Muhurat details are available when you need them." },
      { question: "Does Sindhi Tipno work for my location?", answer: "Sun and moon timings are based on the location you select, so they stay relevant at home or while travelling." },
      { question: "Can I search for a festival or set reminders?", answer: "Yes. Search finds festivals and dates quickly, and smart reminders notify you before events that matter to you." },
      { question: "Can I use it offline?", answer: "Core calendar and festival information is available offline after it has been loaded in the app." }
    ],
    screenshots: [
      { file: "screenshot-tipno-1.webp", title: "Authentic Sindhi Calendar", description: "Cultural Roots. The most accurate Tipno tracking lunar phases and community dates." },
      { file: "screenshot-tipno-2.webp", title: "Major Sindhi Festivals", description: "Stay Connected. Never miss Cheti Chand, Chaliho, or any other community celebration." },
      { file: "screenshot-tipno-3.webp", title: "Cultural Heritage", description: "Ancient Wisdom. Preserve traditional Sindhi knowledge for future generations." },
      { file: "screenshot-tipno-4.webp", title: "Daily Lunar Dates", description: "Traditional Flow. Accurate Chand and Tithi information at your fingertips." },
      { file: "screenshot-tipno-5.webp", title: "Community Events", description: "Local Context. Stay informed about important religious and social dates." }
    ]
  }
];
