/** Reservas en localStorage; sustituir por llamadas a la API Flask cuando conectes el módulo a PostgreSQL. */

export type ReservationStatus = "activa" | "cancelada" | "completada";

export type Reservation = {
  id: string;
  user_id: string;
  location_name: string;
  space_code: string | null;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  amount: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type ReservationInsert = Omit<Reservation, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ReservationUpdate = Partial<
  Omit<Reservation, "id" | "user_id" | "created_at">
> & { updated_at?: string | null };

const MOCK_KEY = "mockReservations";

function readMock(): Reservation[] {
  const raw = localStorage.getItem(MOCK_KEY);
  return raw ? (JSON.parse(raw) as Reservation[]) : [];
}

function writeMock(data: Reservation[]) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
}

function generateUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function ensureSeed(userId?: string) {
  const current = readMock();
  if (current.length > 0) return;
  const now = new Date();
  const later = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const seed: Reservation[] = [
    {
      id: generateUuid(),
      user_id: userId ?? "demo-user",
      location_name: "Parqueadero Centro",
      space_code: "A-12",
      start_time: now.toISOString(),
      end_time: later.toISOString(),
      status: "activa",
      amount: 8000,
      notes: "Reserva inicial",
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
  ];

  writeMock(seed);
}

export async function listMyReservations(userId: string): Promise<Reservation[]> {
  ensureSeed(userId);
  return readMock().filter((r) => r.user_id === userId);
}

export async function listAllReservations(): Promise<Reservation[]> {
  ensureSeed();
  return readMock().sort((a, b) => (a.start_time < b.start_time ? 1 : -1));
}

export async function createReservation(
  input: Omit<ReservationInsert, "id" | "created_at" | "updated_at">
): Promise<Reservation> {
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
    status: (input.status as ReservationStatus) ?? "activa",
    user_id: input.user_id,
  };

  const data = readMock();
  data.push(newItem);
  writeMock(data);
  return newItem;
}

export async function updateReservation(id: string, updates: ReservationUpdate): Promise<Reservation> {
  const data = readMock();
  const idx = data.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Reserva no encontrada");
  const updated: Reservation = {
    ...data[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  data[idx] = updated;
  writeMock(data);
  return updated;
}

export async function cancelReservation(id: string): Promise<Reservation> {
  return updateReservation(id, { status: "cancelada" });
}

export async function deleteReservation(id: string): Promise<void> {
  const filtered = readMock().filter((r) => r.id !== id);
  writeMock(filtered);
}
