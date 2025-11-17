import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Reservation = Tables<"reservations">;
type ReservationInsert = TablesInsert<"reservations">;
type ReservationUpdate = TablesUpdate<"reservations">;

const FRONT_ONLY =
  (import.meta as any).env?.VITE_FRONT_ONLY === "true" ||
  !((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY);

const MOCK_KEY = "mockReservations";

function readMock(): Reservation[] {
  const raw = localStorage.getItem(MOCK_KEY);
  return raw ? (JSON.parse(raw) as Reservation[]) : [];
}

function writeMock(data: Reservation[]) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
}

function generateUuid() {
  // Simple UUID v4 generator for mock mode
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function listMyReservations(userId: string): Promise<Reservation[]> {
  if (FRONT_ONLY) {
    return readMock().filter(r => r.user_id === userId);
  }
  const { data, error } = await (supabase as any)
    .from("reservations")
    .select("*")
    .eq("user_id", userId)
    .order("start_time", { ascending: false });
  if (error) throw error;
  return data as Reservation[];
}

export async function listAllReservations(): Promise<Reservation[]> {
  if (FRONT_ONLY) {
    return readMock().sort((a, b) => (a.start_time < b.start_time ? 1 : -1));
  }
  const { data, error } = await (supabase as any)
    .from("reservations")
    .select("*")
    .order("start_time", { ascending: false });
  if (error) throw error;
  return data as Reservation[];
}

export async function createReservation(input: Omit<ReservationInsert, "id" | "created_at" | "updated_at">): Promise<Reservation> {
  if (FRONT_ONLY) {
    const now = new Date().toISOString();
    const newItem: Reservation = {
      id: generateUuid(),
      created_at: now,
      updated_at: now,
      amount: input.amount ?? null,
      end_time: input.end_time,
      location_name: input.location_name,
      notes: input.notes ?? null,
      space_code: input.space_code ?? null,
      start_time: input.start_time,
      status: (input.status as any) ?? "activa",
      user_id: input.user_id,
    };
    const data = readMock();
    data.push(newItem);
    writeMock(data);
    return newItem;
  }
  const { data, error } = await (supabase as any)
    .from("reservations")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Reservation;
}

export async function updateReservation(id: string, updates: ReservationUpdate): Promise<Reservation> {
  if (FRONT_ONLY) {
    const data = readMock();
    const idx = data.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Reserva no encontrada");
    const current = data[idx];
    const updated: Reservation = { ...current, ...updates, updated_at: new Date().toISOString() };
    data[idx] = updated;
    writeMock(data);
    return updated;
    }
  const { data, error } = await (supabase as any)
    .from("reservations")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Reservation;
}

export async function cancelReservation(id: string): Promise<Reservation> {
  return updateReservation(id, { status: "cancelada" } as ReservationUpdate);
}

export async function deleteReservation(id: string): Promise<void> {
  if (FRONT_ONLY) {
    const filtered = readMock().filter(r => r.id !== id);
    writeMock(filtered);
    return;
  }
  const { error } = await (supabase as any).from("reservations").delete().eq("id", id);
  if (error) throw error;
}

export type { Reservation };


