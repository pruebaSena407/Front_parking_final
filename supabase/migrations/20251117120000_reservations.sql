-- Reservations module
-- Enum for reservation status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservation_status') THEN
    CREATE TYPE public.reservation_status AS ENUM ('activa', 'cancelada', 'completada');
  END IF;
END$$;

-- Reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  space_code TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status reservation_status NOT NULL DEFAULT 'activa',
  amount NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_start_time ON public.reservations(start_time);

-- Enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policies
-- Clients: can manage their own reservations
CREATE POLICY "Users can view own reservations"
  ON public.reservations FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'empleado') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own reservations"
  ON public.reservations FOR INSERT
  WITH CHECK ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'empleado') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own reservations"
  ON public.reservations FOR UPDATE
  USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'empleado') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'empleado') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete own reservations"
  ON public.reservations FOR DELETE
  USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'empleado') OR public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_reservations_updated_at'
  ) THEN
    CREATE TRIGGER update_reservations_updated_at
      BEFORE UPDATE ON public.reservations
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END$$;


