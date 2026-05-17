import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import locationService, { type Location } from "@/services/locationService";
import type { Reservation } from "@/services/reservationService";

export type ReservationFormData = {
  locationId: number;
  vehicleId: string;
  startDate: string;
  endDate: string;
  spaceCode?: string | null;
  totalPrice?: number | null;
  notes?: string | null;
};

function toLocalInputValue(d: Date) {
  // datetime-local exige YYYY-MM-DDTHH:MM en hora local
  const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 16);
}

export function ReservationForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Reservation;
  onSubmit: (data: ReservationFormData) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<ReservationFormData>(() => {
    if (initialData) {
      return {
        locationId: initialData.locationId,
        vehicleId: initialData.vehicleId ?? "",
        startDate: initialData.startDate.slice(0, 16),
        endDate: initialData.endDate.slice(0, 16),
        spaceCode: (initialData as any).spaceCode ?? null,
        totalPrice: initialData.totalPrice ?? null,
        notes: (initialData as any).notes ?? null,
      };
    }
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    return {
      locationId: 0,
      vehicleId: "",
      startDate: toLocalInputValue(now),
      endDate: toLocalInputValue(inOneHour),
      spaceCode: "",
      totalPrice: null,
      notes: "",
    };
  });

  useEffect(() => {
    locationService.getLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  const handleChange =
    (key: keyof ReservationFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = key === "totalPrice" ? Number(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        locationId: Number(form.locationId),
        vehicleId: (form.vehicleId || "").trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        spaceCode: form.spaceCode || null,
        totalPrice: form.totalPrice ?? null,
        notes: form.notes || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="location">Ubicación</Label>
        <Select
          value={form.locationId ? String(form.locationId) : ""}
          onValueChange={(value) => setForm((prev) => ({ ...prev, locationId: Number(value) }))}
        >
          <SelectTrigger id="location">
            <SelectValue placeholder="Selecciona un parqueadero" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>
                {l.name} — {l.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="vehicleId">Vehículo (placa o id)</Label>
        <Input
          id="vehicleId"
          value={form.vehicleId ?? ""}
          onChange={handleChange("vehicleId")}
          placeholder="ABC123"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="space_code">Espacio</Label>
        <Input
          id="space_code"
          value={form.spaceCode ?? ""}
          onChange={handleChange("spaceCode")}
          placeholder="A-12"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Inicio</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={form.startDate}
            onChange={handleChange("startDate")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Fin</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={form.endDate}
            onChange={handleChange("endDate")}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="totalPrice">Monto (opcional)</Label>
        <Input
          id="totalPrice"
          type="number"
          min="0"
          step="100"
          value={form.totalPrice ?? 0}
          onChange={handleChange("totalPrice")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notas</Label>
        <Input
          id="notes"
          value={form.notes ?? ""}
          onChange={handleChange("notes")}
          placeholder="Observaciones"
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting || !form.locationId}>
          {initialData ? "Guardar cambios" : "Crear reserva"}
        </Button>
      </div>
    </form>
  );
}
