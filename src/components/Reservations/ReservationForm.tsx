import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/integrations/supabase/reservations";

type FormData = {
  location_name: string;
  space_code?: string | null;
  start_time: string;
  end_time: string;
  amount?: number | null;
  notes?: string | null;
};

export function ReservationForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Reservation;
  onSubmit: (data: FormData) => Promise<void> | void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<FormData>(() => {
    if (initialData) {
      return {
        location_name: initialData.location_name,
        space_code: initialData.space_code,
        start_time: initialData.start_time.slice(0, 16),
        end_time: initialData.end_time.slice(0, 16),
        amount: initialData.amount,
        notes: initialData.notes,
      };
    }
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    return {
      location_name: "",
      space_code: "",
      start_time: toLocalInputValue(now),
      end_time: toLocalInputValue(inOneHour),
      amount: null,
      notes: "",
    };
  });
  const [submitting, setSubmitting] = useState(false);

  function toLocalInputValue(d: Date) {
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
    return iso.slice(0, 16);
  }

  const handleChange =
    (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = key === "amount" ? Number(e.target.value) : e.target.value;
      setForm(prev => ({ ...prev, [key]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        location_name: form.location_name.trim(),
        space_code: form.space_code || null,
        start_time: form.start_time,
        end_time: form.end_time,
        amount: form.amount ?? null,
        notes: form.notes || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="location_name">Ubicación</Label>
        <Input
          id="location_name"
          value={form.location_name}
          onChange={handleChange("location_name")}
          placeholder="Parqueadero Centro"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="space_code">Espacio</Label>
        <Input
          id="space_code"
          value={form.space_code ?? ""}
          onChange={handleChange("space_code")}
          placeholder="A-12"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Inicio</Label>
          <Input
            id="start_time"
            type="datetime-local"
            value={form.start_time}
            onChange={handleChange("start_time")}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">Fin</Label>
          <Input
            id="end_time"
            type="datetime-local"
            value={form.end_time}
            onChange={handleChange("end_time")}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Monto (opcional)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="100"
          value={form.amount ?? 0}
          onChange={handleChange("amount")}
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
        <Button type="submit" disabled={submitting}>
          {initialData ? "Guardar cambios" : "Crear reserva"}
        </Button>
      </div>
    </form>
  );
}


