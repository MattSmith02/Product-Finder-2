import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
  }
} else {
  console.log("Gemini API Key missing or default placeholder. Falling back to rules-based engine.");
}

// Complete static product catalog for offline rule-matching across all 8 shopping categories
const CATALOG: Record<string, any[]> = {
  Laptops: [
    {
      id: "asus-g14",
      name: "ASUS ROG Zephyrus G14 (2024)",
      brand: "ASUS",
      category: "Laptop",
      rating: 4.8,
      reviewsCount: 342,
      price: "£1,099.00",
      matchScore: 98,
      tag: "BEST MATCH",
      specs: ["AMD Ryzen 9 Processor", "NVIDIA RTX 4070 GPU", "OLED 120Hz display", "Perfect for gaming & travel"],
      description: "The ASUS ROG Zephyrus G14 is an ultraportable gaming powerhouse. It boasts a stunning OLED display, incredible battery life for a gaming rig, and sleek styling that fits anywhere.",
      pros: ["Gorgeous 120Hz OLED screen", "Exceptional gaming performance", "Sleek and robust build", "Surprisingly good battery"],
      cons: ["Can get loud under full load", "RAM is soldered / not upgradable"],
      imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "macbook-air-m3",
      name: "Apple MacBook Air 13-inch (M3)",
      brand: "Apple",
      category: "Laptop",
      rating: 4.7,
      reviewsCount: 512,
      price: "£1,049.00",
      matchScore: 95,
      tag: "GREAT VALUE",
      specs: ["Apple M3 chip", "Fanless completely silent design", "Up to 18 hours battery life", "Liquid Retina display"],
      description: "The absolute best laptop for most people. The M3 chip brings brilliant speed, epic battery life, and a super-slim profile. Completely silent in operation, it is perfect for work, study, and daily tasks.",
      pros: ["Unmatched battery endurance", "Completely silent fanless design", "Great keyboard and trackpad", "Stellar aluminum build"],
      cons: ["Only supports two external displays closed", "Base model starts with 8GB RAM"],
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "razer-blade-14",
      name: "Razer Blade 14 (2024)",
      brand: "Razer",
      category: "Laptop",
      rating: 4.6,
      reviewsCount: 128,
      price: "£1,649.00",
      matchScore: 92,
      tag: "PREMIUM PICK",
      specs: ["AMD Ryzen 9 8945HS", "NVIDIA RTX 4070", "QHD+ 240Hz Display", "CNC Aluminum Chassis"],
      description: "A gorgeous, high-end compact gaming masterpiece. Features a top-tier build quality, powerful specs, and professional looks.",
      pros: ["Supreme metal casing", "Extremely fast screen refresh", "Excellent gaming frame rates"],
      cons: ["High pricing tier", "Runs warm under full power"],
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80"
    }
  ],
  Phones: [
    {
      id: "iphone-15-pro-max",
      name: "Apple iPhone 15 Pro Max",
      brand: "Apple",
      category: "Phone",
      rating: 4.8,
      reviewsCount: 840,
      price: "£1,199.00",
      matchScore: 97,
      tag: "BEST MATCH",
      specs: ["A17 Pro Titanium Chip", "5x Telephoto Optical Zoom", "Super Retina XDR 120Hz", "USB-C Port"],
      description: "Apple's ultimate flagship phone. Crafted in high-strength titanium with unmatched video capabilities, long-lasting battery, and cutting-edge gaming performance.",
      pros: ["Premium titanium shell", "Outstanding 5x zoom camera", "Terrific battery endurance"],
      cons: ["Relatively heavy size", "Standard charging speeds"],
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "galaxy-s24-ultra",
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      category: "Phone",
      rating: 4.9,
      reviewsCount: 815,
      price: "£1,249.00",
      matchScore: 96,
      tag: "PREMIUM PICK",
      specs: ["Snapdragon 8 Gen 3", "200MP Quad Camera System", "S Pen stylus included", "Flat 6.8-inch QHD+ 120Hz display"],
      description: "Samsung's ultimate flagship phone offers a massive, incredibly bright anti-reflective screen, extreme performance, a built-in stylus, and outstanding camera versatility.",
      pros: ["Stunning anti-reflective glass screen", "Incredible camera zoom and 200MP detail", "Long-term 7 years software updates", "Integrated S-Pen"],
      cons: ["Very large and heavy", "Expensive price tag"],
      imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "pixel-8a",
      name: "Google Pixel 8a",
      brand: "Google",
      category: "Phone",
      rating: 4.7,
      reviewsCount: 298,
      price: "£499.00",
      matchScore: 94,
      tag: "GREAT VALUE",
      specs: ["Google Tensor G3 chip", "64MP Dual Camera", "Actua 120Hz display", "7 Years OS Updates"],
      description: "Google's budget-friendly phone packing premium AI photography features, a fast display, and unmatched software longevity at an affordable price.",
      pros: ["Amazing photo quality", "Vibrant, fast screen", "Affordable pricing tier"],
      cons: ["Slower wireless charging", "Larger screen bezels"],
      imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80"
    }
  ],
  TVs: [
    {
      id: "lg-c3-oled",
      name: "LG OLED EVO C3 55-inch",
      brand: "LG",
      category: "TV",
      rating: 4.9,
      reviewsCount: 650,
      price: "£1,199.00",
      matchScore: 98,
      tag: "BEST MATCH",
      specs: ["OLED Evo Display", "Alpha 9 Gen 6 AI Processor", "4x HDMI 2.1 Ports", "Dolby Vision & Atmos"],
      description: "The gold standard for OLED televisions. Perfect contrast levels, intense color accuracy, and incredible gaming features make this a home theater standout.",
      pros: ["Perfect ink blacks", "Phenomenal gaming support", "Intuitive WebOS software"],
      cons: ["Not as bright as QD-OLED options", "Reflective screen in bright rooms"],
      imageUrl: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "samsung-qn90c",
      name: "Samsung Neo QLED QN90C 55-inch",
      brand: "Samsung",
      category: "TV",
      rating: 4.7,
      reviewsCount: 420,
      price: "£999.00",
      matchScore: 94,
      tag: "GREAT VALUE",
      specs: ["Neo QLED Mini-LED Technology", "Neural Quantum Processor 4K", "Ultra Viewing Angle", "Anti-Glare Panel"],
      description: "An incredibly bright and vivid Mini-LED TV. Ideal for daytime viewing in sun-filled living rooms, bringing punchy, lifelike colors.",
      pros: ["Extraordinary brightness levels", "Excellent anti-reflection treatment", "Robust gaming dashboard"],
      cons: ["No Dolby Vision support", "Slight blooming in high contrast scenes"],
      imageUrl: "https://images.unsplash.com/photo-1593784991095-a205039475fe?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "sony-a95l",
      name: "Sony Master Series A95L QD-OLED 55\"",
      brand: "Sony",
      category: "TV",
      rating: 4.9,
      reviewsCount: 110,
      price: "£2,499.00",
      matchScore: 92,
      tag: "PREMIUM PICK",
      specs: ["Cognitive Processor XR", "QD-OLED Panel", "Acoustic Surface Audio+", "Google TV Interface"],
      description: "Sony's state-of-the-art master series TV. Combines QD-OLED brightness with class-leading picture processing for the ultimate cinematic visual fidelity.",
      pros: ["Best-in-class motion & upscaling", "Extremely rich color volume", "Screen acts as a high-quality speaker"],
      cons: ["Extremely premium price tag", "Only has 2 HDMI 2.1 ports"],
      imageUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&q=80"
    }
  ],
  Headphones: [
    {
      id: "sony-wh1000xm5",
      name: "Sony WH-1000XM5 Wireless Headphones",
      brand: "Sony",
      category: "Audio",
      rating: 4.8,
      reviewsCount: 1240,
      price: "£299.00",
      matchScore: 97,
      tag: "BEST MATCH",
      specs: ["Industry-leading ANC", "30-hour battery life", "Speak-to-chat smart feature", "High-res wireless audio"],
      description: "Sony's flagship wireless over-ear headphones deliver pristine audio clarity, unmatched active noise cancellation, and lightweight travel comfort.",
      pros: ["Top-tier active noise cancellation", "Extremely comfortable lightweight frame", "Rich, punchy sound profile", "Great mic quality for calls"],
      cons: ["No longer folds down as small as XM4s", "Touch controls can be finicky in cold weather"],
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "soundcore-space-q45",
      name: "Anker Soundcore Space Q45",
      brand: "Anker",
      category: "Audio",
      rating: 4.6,
      reviewsCount: 820,
      price: "£119.00",
      matchScore: 93,
      tag: "GREAT VALUE",
      specs: ["98% Noise Reduction", "50-Hour Playtime", "LDAC High-Res Support", "Adaptive Noise Cancelling"],
      description: "Unbelievable value in the wireless audio market. Provides a massive 50 hours of playback, adaptive ANC, and highly custom EQ controls at an entry price.",
      pros: ["Insane battery longevity", "Highly customisable mobile app", "Very affordable price"],
      cons: ["Slightly bulky carry case", "Puffy ear pads can warm up ears"],
      imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "airpods-max",
      name: "Apple AirPods Max",
      brand: "Apple",
      category: "Audio",
      rating: 4.7,
      reviewsCount: 1420,
      price: "£499.00",
      matchScore: 91,
      tag: "PREMIUM PICK",
      specs: ["Apple H1 Chip", "Immersive Spatial Audio", "Anodized Aluminum Cups", "Exceptional Transparency Mode"],
      description: "Apple's over-ear luxury headphones. Combines stunning aesthetic design with unmatched physical controls, rich bass, and the best spatial sound in the industry.",
      pros: ["Incredible transparency feedback", "Superb luxury metal styling", "Perfect integration with iOS ecosystem"],
      cons: ["Heavy aluminum weight", "Strange carry case case design"],
      imageUrl: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=400&q=80"
    }
  ],
  Smartwatches: [
    {
      id: "apple-watch-s9",
      name: "Apple Watch Series 9",
      brand: "Apple",
      category: "Smartwatch",
      rating: 4.8,
      reviewsCount: 950,
      price: "£399.00",
      matchScore: 97,
      tag: "BEST MATCH",
      specs: ["S9 SiP with Double Tap gesture", "60-Year ECG & Heart Tracking", "Always-On Retina display", "Fast charging support"],
      description: "The gold standard of smartwatches. Includes the new hands-free Double Tap gesture, extreme fitness accuracy, and local Siri processing for speed.",
      pros: ["Double-tap gesture works like magic", "Brilliant bright always-on display", "Vast collection of watchOS apps"],
      cons: ["Strictly requires an iPhone", "Only 18-hour single day battery"],
      imageUrl: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "galaxy-watch-6",
      name: "Samsung Galaxy Watch 6",
      brand: "Samsung",
      category: "Smartwatch",
      rating: 4.6,
      reviewsCount: 680,
      price: "£289.00",
      matchScore: 94,
      tag: "GREAT VALUE",
      specs: ["Super AMOLED screen", "BioActive Sensor (ECG, BIA)", "WearOS Powered by Samsung", "Custom Sleep Coaching"],
      description: "The premier smartwatch choice for Android users. A thin-bezeled premium circular screen with excellent sleep tracking and complete body composition tracking.",
      pros: ["Vibrant circular AMOLED", "Comprehensive body metric sensor", "Responsive custom Android apps"],
      cons: ["Battery lasts around 30 hours", "ECG requires a Samsung smartphone"],
      imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "garmin-epix-2",
      name: "Garmin Epix (Gen 2) Premium Active",
      brand: "Garmin",
      category: "Smartwatch",
      rating: 4.9,
      reviewsCount: 310,
      price: "£799.00",
      matchScore: 92,
      tag: "PREMIUM PICK",
      specs: ["1.3\" Always-On AMOLED Display", "Up to 16 Days Battery Life", "Multi-Band GPS & TopoActive Maps", "Titanium Bezel"],
      description: "The premium sports smartwatch. Features highly accurate GPS, advanced training telemetry, and an incredibly tough titanium construction.",
      pros: ["Outstanding 16-day battery lifespan", "Tough, military-grade titanium build", "World class topographic mapping"],
      cons: ["Very large and rugged design", "Considerable price premium"],
      imageUrl: "https://images.unsplash.com/photo-1510017808632-95f06e681c1c?auto=format&fit=crop&w=400&q=80"
    }
  ],
  Cameras: [
    {
      id: "fuji-xt5",
      name: "Fujifilm X-T5 Mirrorless Camera",
      brand: "Fujifilm",
      category: "Camera",
      rating: 4.8,
      reviewsCount: 410,
      price: "£1,549.00",
      matchScore: 98,
      tag: "BEST MATCH",
      specs: ["40.2MP APS-C X-Trans CMOS", "7.0 Stop 5-Axis IBIS", "Traditional Analog Control Dials", "Vibrant Film Simulations"],
      description: "The ultimate pure photography camera. Combines an ultra-high 40 megapixel sensor, classical analog dials, and legendary Fujifilm color science in a retro frame.",
      pros: ["Stunning retro analog styling", "Ultra-high resolution sensor", "Unparalleled straight-from-camera colors"],
      cons: ["Tilt-only display screen (not fully articulating)", "Video performance is slightly basic"],
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "canon-eos-r50",
      name: "Canon EOS R50 Content Creator Kit",
      brand: "Canon",
      category: "Camera",
      rating: 4.7,
      reviewsCount: 220,
      price: "£649.00",
      matchScore: 95,
      tag: "GREAT VALUE",
      specs: ["24.2MP APS-C CMOS Sensor", "Dual Pixel CMOS AF II", "Articulating Touchscreen Display", "4K 30p Video"],
      description: "An incredible entry-level camera for beginners. Lightweight, responsive autofocus that tracks eyes effortlessly, and highly simple menus.",
      pros: ["Vast autofocus coverage", "Extremely portable light frame", "Simple to use out-of-the-box"],
      cons: ["Plastic lens mount", "Small battery capacity"],
      imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "sony-a7-iv",
      name: "Sony Alpha 7 IV Full-Frame",
      brand: "Sony",
      category: "Camera",
      rating: 4.9,
      reviewsCount: 880,
      price: "£2,199.00",
      matchScore: 92,
      tag: "PREMIUM PICK",
      specs: ["33MP Full-Frame Exmor R Sensor", "10-bit 4K 60p video capture", "Real-time AI Eye AF", "Dual Card Slots"],
      description: "The absolute benchmark hybrid camera. Delivering stunning full-frame photos and cinematic professional video output, backed by industry-best tracking.",
      pros: ["Flawless AI autofocus tracking", "Outstanding full-frame dynamic range", "Extensive professional video codecs"],
      cons: ["Body gets warm during long video recording", "Menu structure can be intimidating"],
      imageUrl: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "Smart home": [
    {
      id: "nest-hub-max",
      name: "Google Nest Hub Max 10\"",
      brand: "Google",
      category: "Smart Home",
      rating: 4.7,
      reviewsCount: 1320,
      price: "£219.00",
      matchScore: 97,
      tag: "BEST MATCH",
      specs: ["10-inch HD Display", "Stereo Speakers with Subwoofer", "Built-In Nest Security Camera", "Google Assistant Voice Engine"],
      description: "The ultimate centerpiece for a smart household. Connects all security cameras, lights, and thermostats while doubling as a fantastic kitchen speaker.",
      pros: ["Rich, room-filling sound quality", "Useful gesture controls", "Built-in indoor security camera"],
      cons: ["Screen resolution is only 720p", "No physical camera shutter switch"],
      imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "philips-hue-starter",
      name: "Philips Hue White & Colour Starter Kit",
      brand: "Philips",
      category: "Smart Home",
      rating: 4.8,
      reviewsCount: 3120,
      price: "£139.00",
      matchScore: 94,
      tag: "GREAT VALUE",
      specs: ["3x Smart LED Bulbs", "Hue Bridge Central Hub", "16 Million Custom Colors", "Alexa, Google, Apple Home sync"],
      description: "The premier smart lighting system on the market. Incredibly rich color reproduction, simple custom routines, and solid scheduling reliability.",
      pros: ["Best color depth in the industry", "Highly reliable Zigbee hub system", "Endless customization scenes"],
      cons: ["Requires Hue Bridge for full features", "Bulbs are more expensive individually"],
      imageUrl: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "sonos-era-300",
      name: "Sonos Era 300 Smart Speaker",
      brand: "Sonos",
      category: "Smart Home",
      rating: 4.9,
      reviewsCount: 430,
      price: "£449.00",
      matchScore: 92,
      tag: "PREMIUM PICK",
      specs: ["Dolby Atmos Spatial Audio", "6 Custom Acoustic Drivers", "Trueplay Tuning System", "WiFi, Bluetooth & Line-In"],
      description: "Sonos' revolutionary spatial audio speaker. Drives multi-directional audio around any room, creating a wide, high-fidelity acoustic experience.",
      pros: ["Stunning Dolby Atmos imaging", "Trueplay automatically tunes acoustics", "Multi-room network integration"],
      cons: ["Unique, hourglass-like physical look", "Higher price than standard speakers"],
      imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80"
    }
  ],
  Gaming: [
    {
      id: "playstation-5-slim",
      name: "Sony PlayStation 5 Slim",
      brand: "Sony",
      category: "Gaming",
      rating: 4.9,
      reviewsCount: 4210,
      price: "£479.00",
      matchScore: 98,
      tag: "BEST MATCH",
      specs: ["1TB High-Speed Custom SSD", "Tempest 3D AudioTech", "Ray Tracing Support", "DualSense Haptic Controller"],
      description: "The ultimate console for home gaming. Delivers breathtaking 4K graphics, lightning-fast game loading times, and physical immersion through haptic controller feedback.",
      pros: ["DualSense triggers feel incredibly real", "Pristine 4K performance", "Vast catalogue of exclusive games"],
      cons: ["Console stands are sold separately", "Internal storage fills up quickly"],
      imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "nintendo-switch-oled",
      name: "Nintendo Switch OLED Model",
      brand: "Nintendo",
      category: "Gaming Console",
      rating: 4.8,
      reviewsCount: 2314,
      price: "£299.00",
      matchScore: 94,
      tag: "GREAT VALUE",
      specs: ["7-inch vibrant OLED display", "64GB internal storage", "Wired LAN port in dock", "Adjustable wide stand"],
      description: "The best hybrid console. The gorgeous 7-inch OLED screen elevates handheld gaming with vibrant colors and rich contrast, perfect for travel or playing on the couch.",
      pros: ["Beautiful, high-contrast OLED display", "Huge, unmatched library of games", "Versatile handheld or TV play", "Sturdy, adjustable Kickstand"],
      cons: ["Hardware is starting to show its age", "Joy-con drift is still a rare concern"],
      imageUrl: "https://images.unsplash.com/photo-1507457379470-08b8006bd94e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "steam-deck-oled",
      name: "Steam Deck OLED (512GB)",
      brand: "Valve",
      category: "Gaming",
      rating: 4.9,
      reviewsCount: 620,
      price: "£569.00",
      matchScore: 95,
      tag: "PREMIUM PICK",
      specs: ["7.4\" 90Hz HDR OLED", "6nm AMD APU", "512GB NVMe High-Speed SSD", "50Wh Large Battery"],
      description: "The dream handheld device for PC gamers. Merges the convenience of mobile play with a massive personal Steam games collection, beautifully rendered on HDR OLED.",
      pros: ["Stunning high-refresh HDR OLED", "Vast customisation options", "Superb physical button layout"],
      cons: ["Bulky design to transport", "PC game performance requires tweaking"],
      imageUrl: "https://images.unsplash.com/photo-1621259182978-f09e5e2b07ae?auto=format&fit=crop&w=400&q=80"
    }
  ]
};

// Elegant, precise offline matcher
function getFallbackRecommendations(answers: any): any[] {
  const categoryKey = answers.shoppingFor || "Laptops";
  const sourceList = CATALOG[categoryKey] || CATALOG["Laptops"];
  
  // Clone selected category products
  let matched = JSON.parse(JSON.stringify(sourceList));

  // Dynamically recalculate matchScore based on actual survey answers
  matched = matched.map((p: any) => {
    let score = 90;

    // Check budget limit
    const budgetMax = answers.budget?.max || 1500;
    const priceNum = parseInt(p.price.replace(/[^\d]/g, ""));

    if (priceNum > budgetMax) {
      score -= 20; // Budget penalty
    } else if (priceNum <= budgetMax && priceNum >= (answers.budget?.min || 1000)) {
      score += 8; // In target sweet spot
    }

    // Match Brands
    const brandPreferences = answers.brands || [];
    if (brandPreferences.includes("No preference")) {
      score += 5;
    } else if (brandPreferences.includes(p.brand)) {
      score += 10; // Match loved brand
    } else if (brandPreferences.length > 0) {
      score -= 15; // Unselected brand penalty
    }

    // Match important specifications & tags
    const importantAttributes = answers.mostImportant || [];
    if (importantAttributes.includes("Best value") && p.tag === "GREAT VALUE") {
      score += 10;
    }
    if (importantAttributes.includes("Performance") && p.tag === "PREMIUM PICK") {
      score += 10;
    }
    if (importantAttributes.includes("Premium quality") && p.tag === "PREMIUM PICK") {
      score += 8;
    }

    p.matchScore = Math.min(99, Math.max(50, score));
    return p;
  });

  // Sort by score descending
  matched.sort((a: any, b: any) => b.matchScore - a.matchScore);

  // Guarantee exact tags are present
  if (matched[0]) matched[0].tag = "BEST MATCH";
  if (matched[1]) matched[1].tag = "GREAT VALUE";
  if (matched[2]) matched[2].tag = "PREMIUM PICK";

  return matched.slice(0, 3);
}

// REST API endpoint
app.post("/api/recommend", async (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ error: "No answers provided." });
  }

  // If Gemini is not loaded, run our precise matching rules offline
  if (!ai) {
    const matched = getFallbackRecommendations(answers);
    return res.json({ products: matched, source: "rule-engine" });
  }

  try {
    const prompt = `You are a professional product analyst and editor at Tom's Guide.
Based on the following user survey responses, recommend exactly 3 real-world consumer technology products available in the market today that suit them perfectly.

Chosen category they are shopping for: ${answers.shoppingFor || "Laptops"}

User lifestyle answers:
- Most important features: ${answers.mostImportant?.join(", ") || "General utility"}
- Target Budget: ${answers.budget?.segment} (£${answers.budget?.min} - £${answers.budget?.max})
- Primary activities & usage: ${answers.useCases?.join(", ") || "Everyday browsing"}
- Preferred brands: ${answers.brands?.join(", ") || "No preference"}
- Extra preferences: ${answers.extra?.join(", ") || "None"}

You must return EXACTLY 3 real products belonging to the chosen category: "${answers.shoppingFor}".
Tailor their matchScore (out of 100) based on their compatibility with this profile.
If they specified preferred brands, prioritize those. If they avoided anything, respect it.
Ensure prices are formatted in Great British Pounds (£) to match the survey.
Provide clear, authoritative Tom's Guide editorial descriptions, pros, cons, and technical specifications.

Provide high-quality tech Unsplash images matching the recommended products, such as:
- Laptops: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80"
- Phones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
- TVs: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80"
- Headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
- Smartwatches: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80"
- Cameras: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"
- Smart Home: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=400&q=80"
- Gaming: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["products"],
          properties: {
            products: {
              type: Type.ARRAY,
              description: "The list of 3 recommended products.",
              items: {
                type: Type.OBJECT,
                required: ["id", "name", "brand", "category", "rating", "reviewsCount", "price", "matchScore", "tag", "specs", "description", "pros", "cons", "imageUrl"],
                properties: {
                  id: { type: Type.STRING, description: "Slug, e.g. macbook-air-m3" },
                  name: { type: Type.STRING, description: "Full commercial name." },
                  brand: { type: Type.STRING, description: "Brand name." },
                  category: { type: Type.STRING, description: "Category name." },
                  rating: { type: Type.NUMBER, description: "Rating score (1.0 to 5.0)." },
                  reviewsCount: { type: Type.INTEGER, description: "Number of expert reviews." },
                  price: { type: Type.STRING, description: "Price string in GBP, e.g. £899.00." },
                  matchScore: { type: Type.INTEGER, description: "Fit score (40 to 100)." },
                  tag: { type: Type.STRING, description: "Must be exactly one of: 'BEST MATCH', 'GREAT VALUE', or 'PREMIUM PICK'" },
                  specs: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 to 4 core specifications."
                  },
                  description: { type: Type.STRING, description: "Editorial analysis." },
                  pros: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2 to 3 main advantages."
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "1 to 2 minor drawbacks."
                  },
                  imageUrl: { type: Type.STRING, description: "Unsplash URL matching the device." }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text || "";
    const parsed = JSON.parse(text);
    return res.json({ products: parsed.products, source: "gemini-api" });
  } catch (error) {
    console.error("Gemini recommendation error, switching to offline matching rules:", error);
    const matched = getFallbackRecommendations(answers);
    return res.json({ products: matched, source: "rule-engine-error" });
  }
});

// Setup Vite Dev server middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

startServer();
