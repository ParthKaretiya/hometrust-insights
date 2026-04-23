// Mock data for HomeTrust (plain JS)
export const LOCALITIES = [
  { id: "koramangala", name: "Koramangala", city: "Bengaluru", lat: 12.9352, lng: 77.6245 },
  { id: "indiranagar", name: "Indiranagar", city: "Bengaluru", lat: 12.9716, lng: 77.6412 },
  { id: "hsr-layout", name: "HSR Layout", city: "Bengaluru", lat: 12.9116, lng: 77.6446 },
  { id: "whitefield", name: "Whitefield", city: "Bengaluru", lat: 12.9698, lng: 77.7499 },
  { id: "powai", name: "Powai", city: "Mumbai", lat: 19.1176, lng: 72.906 },
  { id: "bandra-west", name: "Bandra West", city: "Mumbai", lat: 19.0596, lng: 72.8295 },
  { id: "andheri-east", name: "Andheri East", city: "Mumbai", lat: 19.1136, lng: 72.8697 },
  { id: "connaught-place", name: "Connaught Place", city: "New Delhi", lat: 28.6315, lng: 77.2167 },
  { id: "hauz-khas", name: "Hauz Khas", city: "New Delhi", lat: 28.5494, lng: 77.2001 },
  { id: "gachibowli", name: "Gachibowli", city: "Hyderabad", lat: 17.4401, lng: 78.3489 },
  { id: "anna-nagar", name: "Anna Nagar", city: "Chennai", lat: 13.085, lng: 80.2101 },
  { id: "salt-lake", name: "Salt Lake", city: "Kolkata", lat: 22.5858, lng: 88.4173 },
];

export const PARAMS = [
  { key: "aqi", label: "Air Quality", icon: "Wind" },
  { key: "walkability", label: "Walkability", icon: "Footprints" },
  { key: "flood", label: "Flood Risk", icon: "Waves" },
  { key: "crime", label: "Safety", icon: "ShieldCheck" },
  { key: "noise", label: "Noise Level", icon: "Volume2" },
  { key: "transit", label: "Metro & Transit", icon: "TrainFront" },
  { key: "schools", label: "Schools", icon: "GraduationCap" },
  { key: "hospitals", label: "Hospitals", icon: "Cross" },
  { key: "green", label: "Green Cover", icon: "Trees" },
  { key: "internet", label: "Internet", icon: "Wifi" },
  { key: "power", label: "Power Supply", icon: "Zap" },
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function generateReport(locality) {
  const scores = {};
  const trend = {};
  const cityAverage = {};
  PARAMS.forEach((p) => {
    const seed = hash(locality.id + p.key);
    const base = 40 + (seed % 55);
    scores[p.key] = base;
    cityAverage[p.key] = 50 + ((seed >> 3) % 30);
    trend[p.key] = Array.from({ length: 7 }, (_, i) =>
      Math.max(20, Math.min(100, base + ((seed >> i) % 15) - 7)),
    );
  });
  const overall = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / PARAMS.length,
  );
  const top = [...PARAMS].sort((a, b) => scores[b.key] - scores[a.key]);
  const pros = top.slice(0, 3).map((p) => `Strong ${p.label.toLowerCase()} (${scores[p.key]}/100)`);
  const cons = top
    .slice(-3)
    .reverse()
    .map((p) => `Weak ${p.label.toLowerCase()} (${scores[p.key]}/100)`);
  return {
    locality,
    generatedAt: new Date().toISOString(),
    reportId: `HT-${hash(locality.id).toString(36).toUpperCase().slice(0, 8)}`,
    overall,
    scores,
    trend,
    cityAverage,
    pros,
    cons,
  };
}

export function scoreLabel(s) {
  if (s >= 80) return { label: "Excellent", tone: "success" };
  if (s >= 65) return { label: "Good", tone: "success" };
  if (s >= 45) return { label: "Moderate", tone: "warning" };
  return { label: "Poor", tone: "danger" };
}

const IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=70",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=70",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&q=70",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=70",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=70",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=70",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=70",
];

const BROKERS = [
  { id: "b1", name: "Aarav Realty", rating: 4.8, years: 6, responseRate: 96 },
  { id: "b2", name: "Priya Homes", rating: 4.6, years: 4, responseRate: 91 },
  { id: "b3", name: "Mumbai Nest", rating: 4.3, years: 8, responseRate: 87 },
  { id: "b4", name: "Delhi Dwellings", rating: 4.1, years: 3, responseRate: 78 },
  { id: "b5", name: "Skyline Brokers", rating: 4.9, years: 10, responseRate: 98 },
];

const VERIFS = ["Bronze", "Silver", "Gold", "Platinum"];
const FURNISH = ["Unfurnished", "Semi-furnished", "Fully-furnished"];

export const LISTINGS = Array.from({ length: 24 }, (_, i) => {
  const loc = LOCALITIES[i % LOCALITIES.length];
  const broker = BROKERS[i % BROKERS.length];
  const verification = VERIFS[(i * 3) % 4];
  const bhk = (i % 4) + 1;
  const trust = 40 + ((i * 13) % 60);
  return {
    id: `L${1000 + i}`,
    title: `${bhk} BHK in ${loc.name}`,
    address: `${100 + i}, ${loc.name}, ${loc.city}`,
    localityId: loc.id,
    city: loc.city,
    price: 15000 + ((i * 7800) % 85000),
    bhk,
    area: 600 + ((i * 137) % 900),
    furnishing: FURNISH[i % 3],
    verification,
    trustScore: trust,
    broker,
    lat: loc.lat + ((i % 5) - 2) * 0.004,
    lng: loc.lng + ((i % 3) - 1) * 0.004,
    image: IMAGES[i % IMAGES.length],
    postedAt: new Date(Date.now() - i * 86400000).toISOString(),
  };
});

export function verificationProgress(v) {
  return { Bronze: 25, Silver: 50, Gold: 75, Platinum: 100 }[v];
}
