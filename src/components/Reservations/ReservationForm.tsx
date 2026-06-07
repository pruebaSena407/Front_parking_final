import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import locationService, { type Location } from "@/services/locationService";
import rateService, { type Quote } from "@/services/rateService";
import type { Reservation } from "@/services/reservationService";

export type ReservationFormData = {
  locationId: number;
  vehicleId: string;
  vehicleType: string;
  startDate: string;
  endDate: string;
  spaceCode?: string | null;
  totalPrice?: number | null;
  notes?: string | null;
};

const VEHICLE_TYPES: { value: string; label: string }[] = [
  { value: "car", label: "Carro" },
  { value: "motorcycle", label: "Moto" },
  { value: "bicycle", label: "Bicicleta" },
  { value: "truck", label: "Camión" },
];

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
  const [estimate, setEstimate] = useState<Quote | null>(null);
  const [vehicleType, setVehicleType] = useState<string>("car");

  // El usuario elige UNA fecha de inicio y CUÁNTAS horas reserva.
  const [locationId, setLocationId] = useState<number>(initialData?.locationId ?? 0);
  const [vehicleId, setVehicleId] = useState<string>(initialData?.vehicleId ?? "");
  const [notes, setNotes] = useState<string>((initialData as any)?.notes ?? "");
  const [startDate, setStartDate] = useState<string>(
    initialData ? initialData.startDate.slice(0, 16) : toLocalInputValue(new Date())
  );
  const [hours, setHours] = useState<number>(() => {
    if (initialData) {
      const diff =
        (new Date(initialData.endDate).getTime() - new Date(initialData.startDate).getTime()) /
        3_600_000;
      return diff > 0 ? Math.max(1, Math.round(diff)) : 1;
    }
    return 1;
  });

  useEffect(() => {
    locationService.getLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  // Total calculado por el backend: tarifa (según tipo y ubicación) × horas.
  useEffect(() => {
    if (!locationId || !hours || hours <= 0) {
      setEstimate(null);
      return;
    }
    let cancelled = false;
    rateService
      .getQuote({ locationId: Number(locationId), vehicleType, hours })
      .then((q) => !cancelled && setEstimate(q))
      .catch(() => !cancelled && setEstimate(null));
    return () => {
      cancelled = true;
    };
  }, [locationId, hours, vehicleType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // El fin se calcula a partir del inicio + las horas reservadas.
      const start = new Date(startDate);
      const end = new Date(start.getTime() + hours * 3_600_000);
      await onSubmit({
        locationId: Number(locationId),
        vehicleId: (vehicleId || "").trim(),
        vehicleType,
        startDate,
        endDate: toLocalInputValue(end),
        spaceCode: null,
        // El monto NO lo digita el usuario: lo calcula la tarifa × horas.
        totalPrice: estimate ? estimate.total : null,
        notes: notes || null,
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
          value={locationId ? String(locationId) : ""}
          onValueChange={(value) => setLocationId(Number(value))}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Tipo de vehículo</Label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger id="vehicleType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Placa del vehículo</Label>
          <Input
            id="vehicleId"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            placeholder="ABC123"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha y hora de inicio</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours">Horas a reservar</Label>
          <Input
            id="hours"
            type="number"
            min="1"
            step="1"
            value={hours}
            onChange={(e) => setHours(Math.max(1, Number(e.target.value) || 1))}
            required
          />
        </div>
      </div>

      {/* Total calculado (solo lectura): tarifa × horas */}
      <div className="rounded-md border bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total de la reserva</span>
          <span className="text-2xl font-bold">
            {estimate ? `$${estimate.total.toLocaleString("es-CO")}` : "—"}
            {estimate && <span className="text-sm font-normal text-muted-foreground ml-1">{estimate.currency}</span>}
          </span>
        </div>
        {estimate ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {estimate.units} {estimate.unit === "hour" ? "hora(s)" : "día(s)"} ×
            ${estimate.unitPrice.toLocaleString("es-CO")} ({estimate.rateName})
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">
            Selecciona ubicación, tipo de vehículo y horas para calcular el total.
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground border-t pt-2">
          Este valor corresponde a las horas reservadas. Si el vehículo permanece más
          tiempo, el excedente se cobrará a la salida.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observaciones"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting || !locationId}>
          {initialData ? "Guardar cambios" : "Crear reserva"}
        </Button>
      </div>
    </form>
  );
}
