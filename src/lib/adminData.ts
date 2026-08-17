// Mock data for the FastGo admin portal (ops dashboard). Shapes mirror the
// Supabase schema in supabase/migrations/ so wiring this to live queries
// later is a data-layer swap, not a redesign.

export const opsMetrics = {
  onlinePartners: 1284,
  activeTrips: 327,
  passengersOnline: 2841,
  tripsToday: 4820,
  gmvToday: 31420,
  platformRevenueToday: 6284,
  sosAlerts: 2,
  partnerSuspensions: 8,
  documentsExpiring: 17,
};

export const revenueTrend = [
  { day: "Mon", gmv: 24100, revenue: 4820 },
  { day: "Tue", gmv: 26800, revenue: 5360 },
  { day: "Wed", gmv: 22400, revenue: 4480 },
  { day: "Thu", gmv: 27900, revenue: 5580 },
  { day: "Fri", gmv: 33200, revenue: 6640 },
  { day: "Sat", gmv: 38650, revenue: 7730 },
  { day: "Sun", gmv: 31420, revenue: 6284 },
];

export type PartnerStatus = "active" | "pending_review" | "suspended" | "deactivated";

export const partners = [
  {
    id: "p-1001",
    name: "Blessing Moyo",
    phone: "+263 77 234 5678",
    status: "active" as PartnerStatus,
    rating: 4.9,
    totalTrips: 1247,
    acceptanceRate: 98,
    council: "Harare",
    vehicle: "Toyota Allion • AFD 1234",
    partnerSince: "Jan 2024",
    complianceStatus: "compliant" as const,
  },
  {
    id: "p-1002",
    name: "Rutendo Chikwanha",
    phone: "+263 71 902 4411",
    status: "active" as PartnerStatus,
    rating: 4.8,
    totalTrips: 892,
    acceptanceRate: 95,
    council: "Harare",
    vehicle: "Honda Fit • AEX 0921",
    partnerSince: "Mar 2024",
    complianceStatus: "expiring_soon" as const,
  },
  {
    id: "p-1003",
    name: "Tinashe Karimanzira",
    phone: "+263 78 445 1290",
    status: "suspended" as PartnerStatus,
    rating: 4.6,
    totalTrips: 2103,
    acceptanceRate: 91,
    council: "Chitungwiza",
    vehicle: "Toyota Wish • AFC 5512",
    partnerSince: "Aug 2023",
    complianceStatus: "expired" as const,
  },
  {
    id: "p-1004",
    name: "Prisca Ndlovu",
    phone: "+263 73 118 6602",
    status: "pending_review" as PartnerStatus,
    rating: 5.0,
    totalTrips: 0,
    acceptanceRate: 0,
    council: "Bulawayo",
    vehicle: "Nissan NP200 • BUL 214B",
    partnerSince: "Aug 2025",
    complianceStatus: "under_review" as const,
  },
  {
    id: "p-1005",
    name: "Farai Mudzingwa",
    phone: "+263 77 660 3345",
    status: "active" as PartnerStatus,
    rating: 4.95,
    totalTrips: 3401,
    acceptanceRate: 99,
    council: "Mutare",
    vehicle: "Toyota Axio • AGX 8834",
    partnerSince: "Nov 2022",
    complianceStatus: "compliant" as const,
  },
] as const;

export const partnerDocuments: Record<
  string,
  { name: string; expires: string; status: "valid" | "expiring_soon" | "expired" }[]
> = {
  "p-1001": [
    { name: "Driver's License", expires: "12 Mar 2026", status: "valid" },
    { name: "Vehicle Registration", expires: "04 Nov 2025", status: "valid" },
    { name: "Legal Aid Cover (Motions)", expires: "01 Jun 2026", status: "valid" },
    { name: "Roadworthy Certificate", expires: "15 Aug 2025", status: "valid" },
  ],
  "p-1002": [
    { name: "Driver's License", expires: "20 Jan 2026", status: "valid" },
    { name: "Vehicle Registration", expires: "02 Sep 2025", status: "expiring_soon" },
    { name: "Legal Aid Cover (Motions)", expires: "01 Jun 2026", status: "valid" },
    { name: "Roadworthy Certificate", expires: "28 Aug 2025", status: "expiring_soon" },
  ],
  "p-1003": [
    { name: "Driver's License", expires: "02 Feb 2025", status: "expired" },
    { name: "Vehicle Registration", expires: "14 Dec 2025", status: "valid" },
    { name: "Legal Aid Cover (Motions)", expires: "01 Mar 2025", status: "expired" },
    { name: "Roadworthy Certificate", expires: "30 Jun 2025", status: "expired" },
  ],
  "p-1004": [
    { name: "Driver's License", expires: "18 May 2027", status: "valid" },
    { name: "Vehicle Registration", expires: "09 Apr 2026", status: "valid" },
    { name: "Legal Aid Cover (Motions)", expires: "Pending activation", status: "expiring_soon" },
    { name: "Roadworthy Certificate", expires: "22 Jul 2026", status: "valid" },
  ],
  "p-1005": [
    { name: "Driver's License", expires: "09 Oct 2027", status: "valid" },
    { name: "Vehicle Registration", expires: "17 Feb 2026", status: "valid" },
    { name: "Legal Aid Cover (Motions)", expires: "01 Jun 2026", status: "valid" },
    { name: "Roadworthy Certificate", expires: "11 Nov 2025", status: "valid" },
  ],
};

export const complianceEvents: Record<
  string,
  { type: string; detail: string; time: string }[]
> = {
  "p-1001": [
    { type: "document_verified", detail: "Roadworthy Certificate verified", time: "15 Aug 2024, 09:12" },
    { type: "partner_reinstated", detail: "Reinstated after document renewal", time: "16 Mar 2024, 14:02" },
  ],
  "p-1002": [
    { type: "document_expiring", detail: "Vehicle Registration expires in 22 days", time: "Today, 03:00" },
    { type: "document_expiring", detail: "Roadworthy Certificate expires in 16 days", time: "Today, 03:00" },
  ],
  "p-1003": [
    { type: "partner_suspended", detail: "Suspended: Legal Aid Cover expired", time: "02 Mar 2025, 03:00" },
    { type: "manual_review", detail: "Low rating flagged for review (2 stars)", time: "18 Feb 2025, 19:44" },
    { type: "document_expired", detail: "Driver's License expired", time: "03 Feb 2025, 03:00" },
  ],
  "p-1004": [
    { type: "document_submitted", detail: "Vehicle documents submitted for review", time: "12 Aug 2025, 10:20" },
    { type: "manual_review", detail: "Background check in progress", time: "12 Aug 2025, 10:22" },
  ],
  "p-1005": [
    { type: "document_verified", detail: "All documents verified", time: "05 Jun 2024, 08:15" },
  ],
};

export const complianceSummary = {
  activeVehicles: 1428,
  compliant: 1311,
  expiringSoon: 73,
  expired: 44,
  suspended: 17,
};

export type TripStatus = "matched" | "enroute_pickup" | "in_progress" | "completed" | "cancelled";

export const trips = [
  { id: "FG-88214", passenger: "Tawanda M.", partner: "Blessing Moyo", from: "Samora Machel Ave", to: "Sam Levy's Village", fare: 8.4, status: "completed" as TripStatus, time: "Today, 08:42" },
  { id: "FG-88213", passenger: "Nyasha C.", partner: "Rutendo Chikwanha", from: "Avondale", to: "Borrowdale Brooke", fare: 6.2, status: "in_progress" as TripStatus, time: "Today, 09:05" },
  { id: "FG-88212", passenger: "Kudzai T.", partner: "Farai Mudzingwa", from: "Eastgate Mall", to: "Mutare CBD", fare: 9.1, status: "enroute_pickup" as TripStatus, time: "Today, 09:11" },
  { id: "FG-88211", passenger: "Rufaro P.", partner: "Tinashe Karimanzira", from: "Chitungwiza CBD", to: "Harare CBD", fare: 5.8, status: "cancelled" as TripStatus, time: "Today, 07:58" },
  { id: "FG-88210", passenger: "Simba N.", partner: "Blessing Moyo", from: "Waterfalls", to: "Mbare Musika", fare: 4.3, status: "completed" as TripStatus, time: "Yesterday, 18:20" },
] as const;

export const sosEvents = [
  { id: "sos-241", trip: "FG-88190", triggeredBy: "Passenger • Nyasha C.", status: "resolved" as const, time: "Yesterday, 21:04" },
  { id: "sos-242", trip: "FG-88214", triggeredBy: "Partner • Blessing Moyo", status: "triggered" as const, time: "Today, 08:51" },
];

export const incidentReports = [
  { id: "IR-20250518-042", category: "Vehicle condition", reporter: "Passenger • Kudzai T.", status: "submitted" as const, time: "Today, 09:20" },
  { id: "IR-20250517-031", category: "Driver behaviour", reporter: "Passenger • Rufaro P.", status: "under_review" as const, time: "Yesterday, 17:40" },
  { id: "IR-20250515-018", category: "Lost item", reporter: "Passenger • Simba N.", status: "resolved" as const, time: "3 days ago" },
];

export const councils = [
  {
    slug: "harare",
    name: "Harare",
    activePartners: 842,
    rules: [
      { key: "requires_operator_permit", label: "Requires operator permit", enabled: true },
      { key: "designated_pickup_only", label: "Designated pickup/drop-off zones only", enabled: false },
      { key: "driver_badge_required", label: "Driver badge must be displayed", enabled: true },
    ],
  },
  {
    slug: "bulawayo",
    name: "Bulawayo",
    activePartners: 214,
    rules: [
      { key: "requires_operator_permit", label: "Requires operator permit", enabled: true },
      { key: "designated_pickup_only", label: "Designated pickup/drop-off zones only", enabled: false },
      { key: "driver_badge_required", label: "Driver badge must be displayed", enabled: false },
    ],
  },
  {
    slug: "chitungwiza",
    name: "Chitungwiza",
    activePartners: 156,
    rules: [
      { key: "requires_operator_permit", label: "Requires operator permit", enabled: true },
      { key: "designated_pickup_only", label: "Designated pickup/drop-off zones only", enabled: true },
      { key: "driver_badge_required", label: "Driver badge must be displayed", enabled: true },
    ],
  },
  {
    slug: "mutare",
    name: "Mutare",
    activePartners: 61,
    rules: [
      { key: "requires_operator_permit", label: "Requires operator permit", enabled: false },
      { key: "designated_pickup_only", label: "Designated pickup/drop-off zones only", enabled: false },
      { key: "driver_badge_required", label: "Driver badge must be displayed", enabled: false },
    ],
  },
  {
    slug: "gweru",
    name: "Gweru",
    activePartners: 9,
    rules: [
      { key: "requires_operator_permit", label: "Requires operator permit", enabled: false },
      { key: "designated_pickup_only", label: "Designated pickup/drop-off zones only", enabled: false },
      { key: "driver_badge_required", label: "Driver badge must be displayed", enabled: false },
    ],
  },
  {
    slug: "victoria-falls",
    name: "Victoria Falls",
    activePartners: 2,
    rules: [
      { key: "requires_operator_permit", label: "Requires operator permit", enabled: false },
      { key: "designated_pickup_only", label: "Designated pickup/drop-off zones only", enabled: false },
      { key: "driver_badge_required", label: "Driver badge must be displayed", enabled: false },
    ],
  },
] as const;

export const passengers = [
  { id: "u-501", name: "Tawanda M.", phone: "+263 77 123 4567", rating: 4.9, totalTrips: 214, joined: "Jan 2024", status: "active" as const },
  { id: "u-502", name: "Nyasha C.", phone: "+263 78 552 9012", rating: 4.7, totalTrips: 88, joined: "May 2024", status: "active" as const },
  { id: "u-503", name: "Kudzai T.", phone: "+263 71 340 7723", rating: 4.5, totalTrips: 41, joined: "Nov 2024", status: "active" as const },
  { id: "u-504", name: "Rufaro P.", phone: "+263 77 902 1188", rating: 4.2, totalTrips: 19, joined: "Feb 2025", status: "flagged" as const },
];

export const fmtMoney = (n: number) =>
  `US$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const fmtCompact = (n: number) =>
  `US$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
