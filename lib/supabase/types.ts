/**
 * Database types for the Supabase schema defined in
 * supabase/migrations/0001_init.sql.
 *
 * Hand-authored. If you change the SQL schema, regenerate or update this file.
 * (You can also run: `supabase gen types typescript --project-id <ref>`.)
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type BookingStatus =
  | "pending"
  | "scheduled"
  | "completed"
  | "cancelled";

export type DonationStatus =
  | "pledged"
  | "purchased"
  | "delivered";

// NOTE: these are `type` aliases (not `interface`) on purpose — Supabase's
// generic schema constraint requires assignability to Record<string, unknown>,
// which interfaces do not satisfy (no implicit index signature).
export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSetting = {
  key: string;
  value: Json;
  updated_at: string;
};

export type SavedKundli = {
  id: string;
  user_id: string;
  name: string;
  dob: string;
  tob: string | null;
  pob: string | null;
  chart_data: Json | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  total: number;
  shipping: Json | null;
  payment_method: string | null;
  payment_id: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  slug: string | null;
  price: number;
  quantity: number;
};

export type Booking = {
  id: string;
  user_id: string | null;
  booking_number: string;
  service_id: string;
  service_title: string | null;
  name: string;
  email: string;
  phone: string | null;
  slot_date: string;
  slot_time: string;
  birth_details: Json | null;
  status: BookingStatus;
  zoom_link: string | null;
  amount: number | null;
  payment_id: string | null;
  created_at: string;
};

export type Donation = {
  id: string;
  user_id: string | null;
  donation_number: string;
  donor_name: string | null;
  items: Json | null;
  total: number | null;
  status: DonationStatus;
  proof_photo_url: string | null;
  payment_id: string | null;
  created_at: string;
};

export type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  user_id: string | null;
  created_at: string;
};

export type ContactStatus = "new" | "read" | "replied" | "archived";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactStatus;
  user_id: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Profile>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSetting;
        Insert: { key: string; value?: Json; updated_at?: string };
        Update: Partial<SiteSetting>;
        Relationships: [];
      };
      saved_kundlis: {
        Row: SavedKundli;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          dob: string;
          tob?: string | null;
          pob?: string | null;
          chart_data?: Json | null;
          created_at?: string;
        };
        Update: Partial<SavedKundli>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: {
          id?: string;
          user_id?: string | null;
          order_number: string;
          status?: OrderStatus;
          total: number;
          shipping?: Json | null;
          payment_method?: string | null;
          payment_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Order>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          slug?: string | null;
          price: number;
          quantity?: number;
        };
        Update: Partial<OrderItem>;
        Relationships: [];
      };
      bookings: {
        Row: Booking;
        Insert: {
          id?: string;
          user_id?: string | null;
          booking_number: string;
          service_id: string;
          service_title?: string | null;
          name: string;
          email: string;
          phone?: string | null;
          slot_date: string;
          slot_time: string;
          birth_details?: Json | null;
          status?: BookingStatus;
          zoom_link?: string | null;
          amount?: number | null;
          payment_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Booking>;
        Relationships: [];
      };
      donations: {
        Row: Donation;
        Insert: {
          id?: string;
          user_id?: string | null;
          donation_number: string;
          donor_name?: string | null;
          items?: Json | null;
          total?: number | null;
          status?: DonationStatus;
          proof_photo_url?: string | null;
          payment_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Donation>;
        Relationships: [];
      };
      waitlist: {
        Row: WaitlistEntry;
        Insert: {
          id?: string;
          email: string;
          source?: string;
          user_id?: string | null;
          created_at?: string;
        };
        Update: Partial<WaitlistEntry>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          status?: ContactStatus;
          user_id?: string | null;
          created_at?: string;
        };
        Update: Partial<ContactMessage>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
      booking_status: BookingStatus;
      donation_status: DonationStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
