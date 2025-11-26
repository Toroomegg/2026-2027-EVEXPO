export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ProductScores {
  inverter: number; // 1-5
  adas: number;     // 1-5
  zonal: number;    // 1-5
}

export interface Exhibition {
  id: string;
  name: string;
  location: string;
  region: 'North America' | 'Europe' | 'Asia' | 'Other';
  date: string; // YYYY-MM format
  year: number;
  totalCostTWD: number; // Total estimated cost in TWD
  competitors: number; // Number of competitors present
  recommendation: number; // 1-5 Stars
  status: 'Confirmed' | 'Planned' | 'Under Review' | 'Dropped';
  notes: string;
  
  // New Strategic Fields
  productScores: ProductScores;
  buyerType: string;
  swot: SWOT;
  mediaReach: number; // 1-10 (Brand Exposure / Public Interest)
}

export type SummaryType = {
  overview: string;
  strategicRecommendations: string[];
  budgetRisk: string;
};

export const INITIAL_EXHIBITIONS: Exhibition[] = [
  {
    id: '1',
    name: 'Battery Show NA 2026/2027',
    location: 'Detroit, USA',
    region: 'North America',
    date: '2026-10',
    year: 2026,
    totalCostTWD: 1230000,
    competitors: 9,
    recommendation: 5,
    status: 'Confirmed',
    notes: 'North America EV Core. Critical for US market entry.',
    productScores: { inverter: 5, adas: 2, zonal: 2 },
    buyerType: 'Tier 1 Powertrain',
    mediaReach: 7,
    swot: {
      strengths: ['Direct access to GM/Ford/Stellantis EV powertrain teams', 'Perfect fit for Inverter P1 product line'],
      weaknesses: ['High cost ($38k USD)', 'Low relevance for ADAS/Zonal products'],
      opportunities: ['IRA compliance discussions', 'Expansion into US commercial EV sector'],
      threats: ['Korean battery giants (LG/SK) dominate floor space']
    }
  },
  {
    id: '2',
    name: 'EV Tech Expo EU 2026/2027',
    location: 'Stuttgart, Germany',
    region: 'Europe',
    date: '2027-05',
    year: 2027,
    totalCostTWD: 730000,
    competitors: 5,
    recommendation: 5, 
    status: 'Planned',
    notes: 'High efficiency for Inverter targets.',
    productScores: { inverter: 5, adas: 3, zonal: 3 },
    buyerType: 'E-Powertrain Engineer',
    mediaReach: 6,
    swot: {
      strengths: ['Focused audience of powertrain engineers', 'High ROI (Low cost, High P1 fit)'],
      weaknesses: ['Smaller scale than IAA', 'Limited C-Level executive presence'],
      opportunities: ['Technical partnership deep-dives', 'Demo-focused engagement'],
      threats: ['Local German suppliers (Bosch/ZF) home turf']
    }
  },
  {
    id: '3',
    name: 'IZB 2026',
    location: 'Wolfsburg, Germany',
    region: 'Europe',
    date: '2026-10',
    year: 2026,
    totalCostTWD: 750000,
    competitors: 11,
    recommendation: 5,
    status: 'Confirmed',
    notes: 'VW Supply Chain Core. Highest competitor density. (Biennial)',
    productScores: { inverter: 4, adas: 4, zonal: 4 },
    buyerType: 'OEM (VW Group Sourcing)',
    mediaReach: 5,
    swot: {
      strengths: ['Direct access to VW Group procurement', 'Balanced interest across all product lines'],
      weaknesses: ['Extreme competition (11 rivals)', 'Booth space hard to secure', 'Long gap between shows'],
      opportunities: ['Replace legacy suppliers in next-gen SSP platform', 'Showcase cost-down capabilities'],
      threats: ['Price war pressure from procurement teams']
    }
  },
  {
    id: '4',
    name: 'Automotive World 2026/2027',
    location: 'Tokyo, Japan',
    region: 'Asia',
    date: '2027-01',
    year: 2027,
    totalCostTWD: 750000,
    competitors: 8,
    recommendation: 5,
    status: 'Confirmed',
    notes: 'Top choice for Japanese OEMs.',
    productScores: { inverter: 4, adas: 4, zonal: 4 },
    buyerType: 'JPN OEM/Tier 1 R&D',
    mediaReach: 6,
    swot: {
      strengths: ['Best gateway to Toyota/Honda/Nissan', 'High technical appreciation'],
      weaknesses: ['Language barrier requiring local team', 'Conservative decision making'],
      opportunities: ['Japanese OEMs shifting to Zonal architecture', 'SDV partnerships'],
      threats: ['Keiretsu (Supplier networks) difficult to penetrate']
    }
  },
  {
    id: '5',
    name: 'IAA Mobility 2026/2027',
    location: 'Munich, Germany',
    region: 'Europe',
    date: '2027-09',
    year: 2027,
    totalCostTWD: 950000,
    competitors: 8,
    recommendation: 4,
    status: 'Planned',
    notes: 'High cost European flagship event.',
    productScores: { inverter: 4, adas: 5, zonal: 5 },
    buyerType: 'Global OEM/Tier 1 (Wide)',
    mediaReach: 9,
    swot: {
      strengths: ['Massive global brand exposure', 'Perfect for ADAS/Zonal future tech launch'],
      weaknesses: ['Very high cost', 'Audience is mixed (B2B/B2C)'],
      opportunities: ['Meeting European C-Level execs', 'Cross-industry partnerships'],
      threats: ['Getting lost in the noise of major car launches']
    }
  },
  {
    id: '6',
    name: 'CES 2026/2027',
    location: 'Las Vegas, USA',
    region: 'North America',
    date: '2027-01',
    year: 2027,
    totalCostTWD: 1360000,
    competitors: 9,
    recommendation: 4,
    status: 'Under Review',
    notes: 'High exposure but extreme cost. Tech focus.',
    productScores: { inverter: 3, adas: 5, zonal: 5 },
    buyerType: 'Global OEM/Tech Execs',
    mediaReach: 10,
    swot: {
      strengths: ['The world stage for ADAS/Software', 'High caliber tech executives'],
      weaknesses: ['Lowest ROI for Inverter (Hardware)', 'Highest cost per lead'],
      opportunities: ['Tech branding alignment', 'Zonal architecture demos'],
      threats: ['Consumer electronics focus diluting auto supply chain value']
    }
  },
  {
    id: '7',
    name: 'Auto Shanghai 2026/2027',
    location: 'Shanghai, China',
    region: 'Asia',
    date: '2027-04',
    year: 2027,
    totalCostTWD: 610000,
    competitors: 8,
    recommendation: 4,
    status: 'Planned',
    notes: 'Must-attend for China market presence.',
    productScores: { inverter: 4, adas: 4, zonal: 3 },
    buyerType: 'CHN/Global OEM Sourcing',
    mediaReach: 8,
    swot: {
      strengths: ['Access to fastest moving market', 'Low cost of participation'],
      weaknesses: ['IP protection concerns', 'Fierce local price competition'],
      opportunities: ['China-for-Global export sourcing', 'NEV specific supply chain'],
      threats: ['Local suppliers iterating faster than us']
    }
  },
  {
    id: '8',
    name: 'IAA Transportation 2026/2027',
    location: 'Hannover, Germany',
    region: 'Europe',
    date: '2026-09',
    year: 2026,
    totalCostTWD: 680000,
    competitors: 8,
    recommendation: 4,
    status: 'Planned',
    notes: 'Key for Commercial Vehicle strategy.',
    productScores: { inverter: 3, adas: 3, zonal: 3 },
    buyerType: 'Logistics/Commercial Vehicle',
    mediaReach: 7,
    swot: {
      strengths: ['Niche focus on heavy duty/commercial', 'Less crowded than passenger car shows'],
      weaknesses: ['Lower volume potential per client', 'Conservative tech adoption'],
      opportunities: ['High voltage inverter for trucks', 'Fleet management ADAS'],
      threats: ['Economic downturn affecting logistics sector']
    }
  },
  {
    id: '9',
    name: 'JSAE 2026/2027',
    location: 'Yokohama, Japan',
    region: 'Asia',
    date: '2027-05',
    year: 2027,
    totalCostTWD: 600000,
    competitors: 5,
    recommendation: 5,
    status: 'Confirmed',
    notes: 'Critical Tech Hub. Highly recommended by customers for Inverter tech.',
    productScores: { inverter: 5, adas: 4, zonal: 4 }, 
    buyerType: 'J-OEM/Tier 1 EV Powertrain',
    mediaReach: 5,
    swot: {
      strengths: ['Highly targeted engineering audience', 'Customer validation ("Worth Attending")', 'High interest in HV Inverters'],
      weaknesses: ['Domestic Japan focus (Global reach limited)', 'Smaller booth sizes standard'],
      opportunities: ['Deep technical review with Toyota/Honda engineers', 'Building trust in Japanese market'],
      threats: ['Strong loyalty to domestic suppliers (Denso/Hitachi)']
    }
  },
  {
    id: '10',
    name: 'Tech.AD USA 2026/2027',
    location: 'Detroit, USA',
    region: 'North America',
    date: '2026-11',
    year: 2026,
    totalCostTWD: 490000,
    competitors: 7,
    recommendation: 3,
    status: 'Planned',
    notes: 'Focused technical conference for ADAS.',
    productScores: { inverter: 1, adas: 5, zonal: 4 },
    buyerType: 'AD/ADAS Tech Leads',
    mediaReach: 4,
    swot: {
      strengths: ['Pure ADAS/Autonomous focus', 'Low cost entry', 'High quality networking'],
      weaknesses: ['Conference format (No big booth exposure)', 'Zero relevance for Inverter'],
      opportunities: ['Thought leadership speaking slots', 'Zonal architecture panel discussions'],
      threats: ['Niche audience limits lead volume']
    }
  },
  {
    id: '11',
    name: 'ACT Expo 2026/2027',
    location: 'Anaheim, USA',
    region: 'North America',
    date: '2027-05',
    year: 2027,
    totalCostTWD: 810000,
    competitors: 6,
    recommendation: 4,
    status: 'Under Review',
    notes: 'Leading clean fleet event. Good for Commercial Inverter.',
    productScores: { inverter: 5, adas: 3, zonal: 2 },
    buyerType: 'Comm. Vehicle Fleet/OEM',
    mediaReach: 6,
    swot: {
      strengths: ['Explosive growth in commercial EV sector', 'High demand for robust inverters'],
      weaknesses: ['Fleet operators focus on TCO not just tech', 'Different sales cycle than passenger car'],
      opportunities: ['US School bus/Delivery van electrification', 'Infrastructure partnerships'],
      threats: ['Regulatory uncertainty in US heavy duty sector']
    }
  }
];