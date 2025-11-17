import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Reservation = Tables<"reservations">;
type ReservationInsert = TablesInsert<"reservations">;
type ReservationUpdate = TablesUpdate<"reservations">;

const FRONT_ONLY =
  (import.meta as any).env?.VITE_FRONT_ONLY === "true" ||
  !((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY);

// Bandera dinámica: si falla Supabase por tabla inexistente u otro error,
// cambiamos a modo mock sin romper la UI.
let useMock = FRONT_ONLY;

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

function hoursBetween(startISO: string, endISO: string) {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const diff = Math.max(0, end - start);
  return Math.ceil(diff / (60 * 60 * 1000));
}

function ensureSeed(userId?: string) {
  const current = readMock();
  if (current.length > 0) return;
  const now = new Date();
  const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowEnd = new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000);

  const seed: Reservation[] = [
    {
      id: generateUuid(),
      user_id: userId ?? "demo-user",
      location_name: "Parqueadero Centro",
      space_code: "A-12",
      start_time: now.toISOString(),
      end_time: inTwoHours.toISOString(),
      status: "activa" as Reservation["status"],
      amount: 8000,
      notes: "Reserva de ejemplo",
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    {
      id: generateUuid(),
      user_id: userId ?? "demo-user",
      location_name: "Centro Comercial Plaza",
      space_code: "B-03",
      start_time: tomorrow.toISOString(),
      end_time: tomorrowEnd.toISOString(),
      status: "completada" as Reservation["status"],
      amount: 7000,
      notes: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
  ];
  writeMock(seed);
}

function shouldFallbackToMock(error: unknown): boolean {
  if (!error) return false;
  const msg = String((error as any).message || "");
  // Mensajes típicos cuando la tabla no existe o el esquema no está sincronizado
  return (
    msg.includes("schema cache") ||
    msg.includes("not find the table") ||
    msg.includes("relation") && msg.includes("does not exist") ||
    msg.includes("Failed to fetch") // sin red / sin backend
  );
}

export async function listMyReservations(userId: string): Promise<Reservation[]> {
  if (useMock) {
    ensureSeed(userId);
    return readMock().filter(r => r.user_id === userId);
  }
  try {
    const { data, error } = await (supabase as any)
      .from("reservations")
      .select("*")
      .eq("user_id", userId)
      .order("start_time", { ascending: false });
    if (error) throw error;
    return data as Reservation[];
  } catch (e) {
    if (shouldFallbackToMock(e)) {
      console.warn("[reservations] Fallback a mock por error:", e);
      useMock = true;
      ensureSeed(userId);
      return readMock().filter(r => r.user_id === userId);
    }
    throw e;
  }
}

export async function listAllReservations(): Promise<Reservation[]> {
  if (useMock) {
    ensureSeed();
    return readMock().sort((a, b) => (a.start_time < b.start_time ? 1 : -1));
  }
  try {
    const { data, error } = await (supabase as any)
      .from("reservations")
      .select("*")
      .order("start_time", { ascending: false });
    if (error) throw error;
    return data as Reservation[];
  } catch (e) {
    if (shouldFallbackToMock(e)) {
      console.warn("[reservations] Fallback a mock por error:", e);
      useMock = true;
      ensureSeed();
      return readMock().sort((a, b) => (a.start_time < b.start_time ? 1 : -1));
    }
    throw e;
  }
}

export async function createReservation(input: Omit<ReservationInsert, "id" | "created_at" | "updated_at">): Promise<Reservation> {
  if (useMock) {
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
  try {
    const { data, error } = await (supabase as any)
      .from("reservations")
      .insert(input)
      .select("*")
      .single();
    if (error) throw error;
    return data as Reservation;
  } catch (e) {
    if (shouldFallbackToMock(e)) {
      console.warn("[reservations] Fallback a mock por error:", e);
      useMock = true;
      return createReservation(input);
    }
    throw e;
  }
}

export async function updateReservation(id: string, updates: ReservationUpdate): Promise<Reservation> {
  if (useMock) {
    const data = readMock();
    const idx = data.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Reserva no encontrada");
    const current = data[idx];
    const updated: Reservation = { ...current, ...updates, updated_at: new Date().toISOString() };
    data[idx] = updated;
    writeMock(data);
    return updated;
  }
  try {
    const { data, error } = await (supabase as any)
      .from("reservations")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as Reservation;
  } catch (e) {
    if (shouldFallbackToMock(e)) {
      console.warn("[reservations] Fallback a mock por error:", e);
      useMock = true;
      return updateReservation(id, updates);
    }
    throw e;
  }
}

export async function cancelReservation(id: string): Promise<Reservation> {
  return updateReservation(id, { status: "cancelada" } as ReservationUpdate);
}

export async function deleteReservation(id: string): Promise<void> {
  if (useMock) {
    const filtered = readMock().filter(r => r.id !== id);
    writeMock(filtered);
    return;
  }
  try {
    const { error } = await (supabase as any).from("reservations").delete().eq("id", id);
    if (error) throw error;
  } catch (e) {
    if (shouldFallbackToMock(e)) {
      console.warn("[reservations] Fallback a mock por error:", e);
      useMock = true;
      return deleteReservation(id);
    }
    throw e;
  }
}

export type { Reservation };


