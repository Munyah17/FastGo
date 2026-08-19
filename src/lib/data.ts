// Mock data for the FastGo prototype. In production this comes from the
// FastGo Core API (Supabase/PostgreSQL + dispatch, pricing, compliance engines).

// Matches supabase/migrations/0019_arrival_waiting_fee.sql
export const FREE_WAIT_MINUTES = 3;
export const WAITING_FEE_PER_MIN = 0.1;

// Matches supabase/migrations/0019's ride_requests extra_passenger_fee /
// heavy_luggage_fee columns — declared upfront by the passenger, not
// discovered by the driver mid-trip.
export const EXTRA_PASSENGER_FEE = 0.5;
export const HEAVY_LUGGAGE_FEE = 1.0;
export const MAX_EXTRA_PASSENGERS = 3;

export const waitingDisputeReasons = [
  "Driver wasn't actually at the pickup point",
  "Driver arrived early and started the timer unfairly",
  "I was already waiting when this was logged",
  "Other",
];

export const user = {
  id: "usr_tawanda_m",
  phone: "+263771234567",
  name: "Tawanda M.",
  firstName: "Tawanda",
  avatarUrl: null as string | null,
  rating: 4.9,
  trips: 1247,
  acceptance: 98,
  driverSince: "Jan 2024",
  walletBalance: 18.45,
  memberSinceMonths: 26,
};

// Matches supabase/migrations/0022_scan_to_pay_cashback.sql — give_cashback()
// retains this fraction as the driver's handling fee, the rest goes to the
// passenger. Driver-initiated only; never something a passenger can compel.
export const CASHBACK_FEE_RATE = 0.05;

// Other FastGo users a Scan to Pay QR code or manual lookup can resolve to.
// Stand-in for a real recipient lookup by id/phone in production.
export const scanToPayContacts: {
  id: string;
  name: string;
  phone: string;
  role: "passenger" | "driver";
  avatarUrl: string | null;
}[] = [
  { id: "usr_blessing_m", name: "Blessing M.", phone: "+263772234567", role: "driver", avatarUrl: null },
  { id: "usr_rudo_c", name: "Rudo C.", phone: "+263773345678", role: "passenger", avatarUrl: null },
  { id: "usr_tinashe_k", name: "Tinashe K.", phone: "+263774456789", role: "driver", avatarUrl: null },
  { id: "usr_farai_n", name: "Farai N.", phone: "+263775567890", role: "passenger", avatarUrl: null },
];

export const savedPlaces = [
  { label: "Home", address: "123 Samora Machel Ave, Harare", icon: "home" },
  { label: "Work", address: "Borrowdale Office Park, Harare", icon: "work" },
  { label: "Chitungwiza", address: "Chitungwiza CBD", icon: "pin" },
];

// Matches vehicle_category enum in supabase/migrations/0023_vehicle_designations.sql.
// This is the canonical vehicle taxonomy: what a partner's vehicle registers
// as (see vehicle.designation below) and what a passenger picks in
// RideOptions. Delivery and Bike carry parcels only, never passengers.
export const vehicleDesignations = [
  { id: "ordinary", label: "Ordinary", description: "Everyday ride, any compact or sedan.", seats: 4, isDelivery: false },
  { id: "four_seater", label: "4 Seater", description: "Sedan or hatchback seating up to 4.", seats: 4, isDelivery: false },
  { id: "seven_seater", label: "7 Seater", description: "SUV or minivan seating up to 7.", seats: 7, isDelivery: false },
  { id: "comfort", label: "Comfort", description: "Newer, more spacious vehicle with extra legroom.", seats: 4, isDelivery: false },
  { id: "luxury", label: "Luxury", description: "Premium vehicle for a top-tier ride.", seats: 4, isDelivery: false },
  { id: "exclusive", label: "Exclusive", description: "FastGo's highest tier — top-rated partners, premium vehicles only.", seats: 4, isDelivery: false },
  { id: "delivery", label: "Delivery", description: "Car or van for parcel and package delivery, no passengers.", seats: 0, isDelivery: true },
  { id: "bike", label: "Bike", description: "Motorbike for fast parcel pickups and drop-offs.", seats: 0, isDelivery: true },
] as const;

export type VehicleDesignationId = (typeof vehicleDesignations)[number]["id"];

export const rideOptions = [
  { id: "ordinary", name: "Ordinary", eta: "3 min away", price: 2.8, seats: 4 },
  { id: "four_seater", name: "4 Seater", eta: "4 min away", price: 3.2, seats: 4 },
  { id: "seven_seater", name: "7 Seater", eta: "6 min away", price: 4.8, seats: 7 },
  { id: "comfort", name: "Comfort", eta: "5 min away", price: 4.5, seats: 4 },
  { id: "luxury", name: "Luxury", eta: "8 min away", price: 7.5, seats: 4 },
  { id: "exclusive", name: "Exclusive", eta: "10 min away", price: 11.0, seats: 4 },
  { id: "delivery", name: "Delivery", eta: "6 min away", price: 3.5, seats: 0 },
  { id: "bike", name: "Bike", eta: "3 min away", price: 2.0, seats: 0 },
];

export const activeRide = {
  driver: { name: "Blessing M.", rating: 4.9, phone: "+263772234567" },
  vehicle: { model: "Toyota Allion", colour: "Silver", plate: "AFD 1234" },
  etaMinutes: 2,
  pickup: "My Location",
  dropoff: "Sam Levy's Village",
  fare: 3.2,
  payment: "FastGo Wallet",
};

export const vehicle = {
  make: "Toyota",
  model: "Allion",
  colour: "Silver",
  plate: "AFD 1234",
  status: "Active",
  designation: "four_seater" as VehicleDesignationId,
};

export const vehicleDocuments = [
  { name: "Registration", expires: "04 Nov 2025", status: "Valid" },
  { name: "Legal Aid Cover (Motions)", expires: "01 Jun 2025", status: "Valid" },
  { name: "Roadworthy Certificate", expires: "15 Aug 2025", status: "Valid" },
  { name: "COE / PSV Badge", expires: "31 Dec 2025", status: "Valid" },
] as const;

export const documents = [
  { name: "Driver's License", expires: "12 Mar 2026", status: "Valid" },
  { name: "Vehicle Registration", expires: "04 Nov 2025", status: "Valid" },
  { name: "Legal Aid Cover (Motions)", expires: "01 Jun 2025", status: "Valid" },
  { name: "Roadworthy Certificate", expires: "15 Aug 2025", status: "Valid" },
] as const;

export const weeklyEarnings = {
  range: "12 May – 18 May 2025",
  prevRange: "05 May – 11 May 2025",
  total: 156.8,
  changePct: 12,
  days: [
    { day: "Mon", amount: 18.4 },
    { day: "Tue", amount: 31.2 },
    { day: "Wed", amount: 14.6 },
    { day: "Thu", amount: 16.8 },
    { day: "Fri", amount: 27.4 },
    { day: "Sat", amount: 42.3 },
    { day: "Sun", amount: 6.1 },
  ],
  trips: 36,
  online: "22h 45m",
  avgPerTrip: 4.36,
  breakdown: {
    tripEarnings: 132.4,
    incentives: 18.0,
    other: 6.4,
    deductions: -8.0,
    payout: 148.8,
  },
};

export const todayEarnings = {
  total: 56.7,
  trips: 5,
  hours: [2, 0, 1, 4, 6, 3, 8, 5, 9, 4, 7, 3],
};

export const insurance = {
  policyNumber: "MDP-25-584729",
  coverPeriod: "01 May 2025 – 01 Jun 2025",
  nextPayment: "01 Jun 2025",
  monthlyPremium: 5.0,
  currentPeriodPaid: true,
  billingHistory: [
    { period: "01 Apr – 01 May 2025", amount: 5.0, method: "Wallet", date: "01 Apr 2025" },
    { period: "01 Mar – 01 Apr 2025", amount: 5.0, method: "EcoCash", date: "01 Mar 2025" },
    { period: "01 Feb – 01 Mar 2025", amount: 5.0, method: "Wallet", date: "01 Feb 2025" },
  ],
  covered: [
    {
      title: "Legal Assistance",
      subtitle: "For transport-related disputes",
      icon: "scale",
    },
    {
      title: "Comprehensive Cover",
      subtitle: "Vehicle & third-party cover",
      icon: "car",
    },
    {
      title: "Vehicle Impound Support",
      subtitle: "Legal Support",
      icon: "shield",
    },
    {
      title: "24/7 Support",
      subtitle: "We're always here for you",
      icon: "headset",
    },
  ],
};

export const helpTopics = [
  { title: "Account & Verification", icon: "user" },
  { title: "Earnings & Payouts", icon: "dollar" },
  { title: "Trips & Bookings", icon: "car" },
  { title: "Wallet & Payments", icon: "wallet" },
  { title: "Safety & Security", icon: "shield" },
];

export const messages = [
  {
    from: "FastGo Support",
    preview: "Your document review is complete, all valid.",
    time: "09:12",
    unread: true,
  },
  {
    from: "Blessing M.",
    preview: "I'm at the pickup point near the entrance.",
    time: "Yesterday",
    unread: false,
  },
  {
    from: "FastGo Promotions",
    preview: "Peak-hour bonus: earn +10% on trips 6–9AM this week.",
    time: "Mon",
    unread: false,
  },
];

// Trip history as seen by a partner (rides they gave, not rides they took) —
// matches the "Trip History" partner mockup: grouped by day, payment method
// chip per trip, no fare shown for cancelled trips.
export const tripHistory = [
  {
    id: "FG-88214",
    day: "Today",
    time: "06:45 AM",
    from: "Borrowdale Brooke",
    to: "Sam Levy's Village",
    fare: 8.4,
    status: "Completed",
    payment: "Cash",
    passenger: "Rudo M.",
    distance: "6.8 km",
    duration: "14 min",
  },
  {
    id: "FG-88198",
    day: "Today",
    time: "05:10 AM",
    from: "Harare CBD",
    to: "Avondale Shops",
    fare: 6.2,
    status: "Completed",
    payment: "EcoCash",
    passenger: "Simba T.",
    distance: "5.1 km",
    duration: "11 min",
  },
  {
    id: "FG-88102",
    day: "Yesterday",
    time: "08:15 PM",
    from: "Ruwa",
    to: "Eastgate Mall",
    fare: 9.1,
    status: "Completed",
    payment: "Wallet",
    passenger: "Chipo N.",
    distance: "18.4 km",
    duration: "29 min",
  },
  {
    id: "FG-87960",
    day: "Yesterday",
    time: "04:30 PM",
    from: "Waterfalls",
    to: "Mbare Musika",
    fare: 5.8,
    status: "Completed",
    payment: "Cash",
    passenger: "Farai K.",
    distance: "9.2 km",
    duration: "17 min",
  },
  {
    id: "FG-87811",
    day: "Yesterday",
    time: "01:20 PM",
    from: "Eastlea",
    to: "Highlands",
    fare: 2.9,
    status: "Cancelled",
    payment: "—",
    passenger: "—",
    distance: "—",
    duration: "—",
  },
] as const;

export const transactions = [
  { id: 1, type: "ride_payment", label: "Ride Payment", day: "Today", time: "09:12 AM", amount: 8.4, channel: "Wallet" },
  { id: 2, type: "commission", label: "FastGo Commission", day: "Today", time: "09:12 AM", amount: -2.1, channel: "Deduction" },
  { id: 3, type: "protection", label: "Legal Aid Cover", day: "Today", time: "09:12 AM", amount: -0.23, channel: "Deduction" },
  { id: 4, type: "topup", label: "Wallet Top Up", day: "Today", time: "08:00 AM", amount: 20.0, channel: "EcoCash" },
  { id: 5, type: "ride_payment", label: "Ride Payment", day: "Yesterday", time: "06:45 PM", amount: 6.2, channel: "Wallet" },
  { id: 6, type: "withdraw", label: "Withdrawal", day: "Yesterday", time: "09:12 AM", amount: -25.0, channel: "EcoCash" },
  { id: 7, type: "bonus", label: "Peak-hour bonus", day: "Mon", time: "08:00 AM", amount: 5.0, channel: "Wallet" },
] as const;

export const notifications = [
  {
    title: "New Incentive",
    body: "Complete 40 trips this week and earn US$15 bonus.",
    time: "2m ago",
    tone: "brand",
    category: "Promotions",
    unread: true,
  },
  {
    title: "Trip Completed",
    body: "Sam Levy's Village. You earned US$8.40.",
    time: "35m ago",
    tone: "good",
    category: "Trips",
    unread: true,
  },
  {
    title: "Wallet Top Up Successful",
    body: "Your wallet has been topped up with US$20.00.",
    time: "1h ago",
    tone: "good",
    category: "Alerts",
    unread: true,
  },
  {
    title: "Legal Aid Cover Activated",
    body: "Your legal aid cover is active until 01 Jun 2025.",
    time: "3h ago",
    tone: "brand",
    category: "Alerts",
    unread: false,
  },
  {
    title: "Document Expiry Reminder",
    body: "Your Roadworthy Certificate expires in 30 days.",
    time: "1d ago",
    tone: "warn",
    category: "Alerts",
    unread: false,
  },
] as const;

export const faqs = [
  {
    q: "How do I top up my FastGo Wallet?",
    a: "Open Wallet → Top Up, choose EcoCash, OneMoney, bank card or Paynow, enter the amount and confirm on your phone.",
  },
  {
    q: "How is my fare calculated?",
    a: "Fares combine a base fare, distance and time, with a minimum fare. You always see the price before you confirm, with no surprises.",
  },
  {
    q: "Can I pay cash?",
    a: "Yes. Choose Cash before confirming your ride. For drivers, FastGo's commission on cash trips is deducted from your wallet balance.",
  },
  {
    q: "What happens if my documents expire?",
    a: "You'll get reminders 30, 14 and 7 days before expiry. Once a required document expires, trip requests pause automatically until it's renewed.",
  },
  {
    q: "How do I share my trip?",
    a: "During an active ride, tap Share Trip to send a live link with the driver, vehicle and route to your trusted contacts.",
  },
  {
    q: "How does the SOS button work?",
    a: "SOS immediately shares your live location, trip and vehicle details with your trusted contacts and the FastGo safety team, 24/7.",
  },
] as const;

export const weeklyChallenge = {
  title: "This Week",
  desc: "Complete 40 trips",
  progress: 20,
  total: 40,
};

export const incentives = [
  {
    title: "Peak Hour Bonus",
    desc: "Earn extra between 6AM - 9AM",
    reward: "+15%",
    tone: "warn",
  },
  {
    title: "Weekend Booster",
    desc: "Complete 30 trips",
    reward: "US$10",
    tone: "brand",
  },
  {
    title: "Streak Reward",
    desc: "7 days in a row",
    reward: "US$15",
    tone: "good",
  },
] as const;

export const incentiveHistory = [
  { title: "Perfect Week", desc: "Completed 45 trips, 7 days straight", reward: 20.0, date: "Aug 03" },
  { title: "Early Bird Bonus", desc: "10 trips before 7AM", reward: 5.0, date: "Jul 28" },
  { title: "Weekend Booster", desc: "Completed 30 trips", reward: 10.0, date: "Jul 21" },
] as const;

export const trustedContacts: { name: string; phone: string; relation: string }[] = [
  { name: "Rudo M.", phone: "+263 77 234 5678", relation: "Spouse" },
  { name: "Tapiwa M.", phone: "+263 71 902 4411", relation: "Brother" },
];

export const statements = [
  { range: "12 May – 18 May 2025", trips: 36, amount: 148.8 },
  { range: "05 May – 11 May 2025", trips: 33, amount: 139.95 },
  { range: "28 Apr – 04 May 2025", trips: 29, amount: 121.4 },
  { range: "21 Apr – 27 Apr 2025", trips: 38, amount: 156.1 },
] as const;

export const chatThread = [
  { from: "them", text: "Hi Tawanda, I'm at the pickup point near the entrance.", time: "08:39" },
  { from: "me", text: "Great, I can see you. Silver Allion?", time: "08:39" },
  { from: "them", text: "Yes, AFD 1234. I'm right by the gate.", time: "08:40" },
  { from: "me", text: "Coming now 👍", time: "08:40" },
] as const;

export const topupMethods = [
  { id: "ecocash", name: "EcoCash Instant Payments", detail: "Instant • 077 *** 5678", icon: "phone" },
  { id: "steward", name: "Steward Bank", detail: "Instant • 077 *** 5678", icon: "phone" },
  { id: "paynow", name: "Paynow Zimbabwe", detail: "Bank & mobile money", icon: "wallet" },
  { id: "onemoney", name: "OneMoney", detail: "071 *** 4411", icon: "phone" },
  { id: "card", name: "Visa / Mastercard", detail: "**** 4821", icon: "card" },
] as const;

export const referral = {
  code: "FASTGO123",
  invited: 32,
  active: 18,
  earned: 126.4,
  perReferral: 5.0,
};

export const searchablePlaces = [
  { name: "Home", address: "123 Samora Machel Ave, Harare", category: "Saved" },
  { name: "Work", address: "Borrowdale Office Park, Harare", category: "Saved" },
  { name: "Sam Levy's Village", address: "Borrowdale, Harare", category: "Shopping" },
  { name: "Eastgate Mall", address: "Robert Mugabe Rd, Harare CBD", category: "Shopping" },
  { name: "Avondale Shops", address: "King George Rd, Avondale", category: "Shopping" },
  { name: "Westgate Shopping Mall", address: "Harare Drive, Westgate", category: "Shopping" },
  { name: "Robert Gabriel Mugabe Int'l Airport", address: "Airport Rd, Harare", category: "Airport" },
  { name: "Harare CBD", address: "1st Street, Harare", category: "Area" },
  { name: "Chitungwiza CBD", address: "Chitungwiza", category: "Area" },
  { name: "Mbare Musika", address: "Mbare, Harare", category: "Transport" },
  { name: "Harare Gardens", address: "Herbert Chitepo Ave, Harare", category: "Landmark" },
  { name: "Parirenyatwa Hospital", address: "Mazowe St, Harare", category: "Hospital" },
  { name: "University of Zimbabwe", address: "Mount Pleasant, Harare", category: "Education" },
  { name: "Borrowdale Racecourse", address: "Borrowdale, Harare", category: "Landmark" },
] as const;

export const driverOffers = [
  {
    id: "off-1",
    name: "Blessing M.",
    rating: 4.9,
    phone: "+263772234567",
    vehicle: "Toyota Allion • Silver • AFD 1234",
    etaMin: 3,
    fare: 5.5,
    delayMs: 1400,
  },
  {
    id: "off-2",
    name: "Tinashe K.",
    rating: 4.7,
    phone: "+263774451290",
    vehicle: "Toyota Wish • White • AFC 5512",
    etaMin: 5,
    fare: 5.0,
    delayMs: 2600,
  },
  {
    id: "off-3",
    name: "Farai M.",
    rating: 4.95,
    phone: "+263776603345",
    vehicle: "Toyota Axio • Blue • AGX 8834",
    etaMin: 6,
    fare: 6.0,
    delayMs: 3800,
  },
] as const;

export const incomingRequests = [
  {
    id: "req-8831",
    passenger: "Nyasha C.",
    rating: 4.7,
    phone: "+263785529012",
    pickup: "Avondale Shops",
    dropoff: "Borrowdale Brooke",
    distanceKm: 1.4,
    etaMin: 4,
    offeredFare: 5.5,
  },
  {
    id: "req-8832",
    passenger: "Kudzai T.",
    rating: 4.5,
    phone: "+263713407723",
    pickup: "Eastgate Mall",
    dropoff: "Msasa",
    distanceKm: 2.1,
    etaMin: 6,
    offeredFare: 4.0,
  },
  {
    id: "req-8833",
    passenger: "Rufaro P.",
    rating: 4.9,
    phone: "+263779021188",
    pickup: "Harare CBD, 1st St",
    dropoff: "Chitungwiza CBD",
    distanceKm: 3.6,
    etaMin: 9,
    offeredFare: 7.5,
  },
] as const;

export const driverToday = {
  online: false,
  hoursOnline: "3h 12m",
  tripsToday: 5,
  earningsToday: 34.2,
  cancellationsThisWeek: 1,
  cancellationLimit: 3,
};

// Matches minimum_fare() in supabase/migrations/0014_fares_sharing_payment_prefs.sql —
// keep these in sync if the platform minimum ever changes.
export const MINIMUM_FARE = 2.0;

export const fmt = (n: number) =>
  `US$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
