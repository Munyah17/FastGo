// Hand-maintained until `supabase gen types typescript --local` is wired
// into a script (needs a running local Supabase — see supabase/README.md).
// Mirrors supabase/migrations/0001-0006. Keep in sync when the schema changes.

export type PartnerStatus = "pending_review" | "active" | "suspended" | "deactivated";
export type DocumentType =
  | "drivers_license"
  | "vehicle_registration"
  | "insurance"
  | "roadworthy"
  | "council_permit"
  | "national_id";
export type DocumentStatus = "valid" | "expiring_soon" | "expired";
export type RideStatus =
  | "searching"
  | "matched"
  | "enroute_pickup"
  | "in_progress"
  | "completed"
  | "cancelled";
export type OfferStatus = "pending" | "accepted" | "declined" | "countered" | "expired";
export type PaymentMethod = "ecocash" | "onemoney" | "card" | "paynow" | "cash" | "wallet";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type WalletTxnType =
  | "topup"
  | "withdrawal"
  | "trip_earning"
  | "platform_service_fee"
  | "bonus"
  | "adjustment";
export type SosStatus = "triggered" | "acknowledged" | "resolved" | "false_alarm";

export interface Profile {
  id: string;
  phone: string;
  full_name: string;
  avatar_url: string | null;
  is_partner: boolean;
  is_passenger: boolean;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  status: PartnerStatus;
  primary_council_id: string | null;
  acceptance_rate: number | null;
  total_trips: number;
  partner_since: string;
  bio: string | null;
}

export interface Vehicle {
  id: string;
  partner_id: string;
  make: string;
  model: string;
  year: number | null;
  colour: string | null;
  plate: string;
  seats: number;
  photo_url: string | null;
  is_active: boolean;
}

export interface Trip {
  id: string;
  request_id: string;
  offer_id: string;
  passenger_id: string;
  partner_id: string;
  vehicle_id: string;
  agreed_fare: number;
  status: RideStatus;
  distance_km: number | null;
  duration_min: number | null;
  started_at: string | null;
  completed_at: string | null;
}

// Database["public"]["Tables"] shape expected by @supabase/supabase-js's
// generic client. Extend as more of the schema gets wired to the UI.
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      partners: { Row: Partner; Insert: Partial<Partner>; Update: Partial<Partner> };
      vehicles: { Row: Vehicle; Insert: Partial<Vehicle>; Update: Partial<Vehicle> };
      trips: { Row: Trip; Insert: Partial<Trip>; Update: Partial<Trip> };
    };
  };
}
