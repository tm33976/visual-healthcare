
import { supabase } from "@/integrations/supabase/client";
import { isGuestSession } from "./session";

export interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  createdAt?: string;
}

function getLocalAppointments(): Appointment[] {
  return JSON.parse(localStorage.getItem("appointments") || "[]");
}

function setLocalAppointments(appointments: Appointment[]) {
  localStorage.setItem("appointments", JSON.stringify(appointments));
}

export async function fetchAppointments(): Promise<Appointment[]> {
  if (isGuestSession()) {
    return getLocalAppointments();
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return [];
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });
  if (error) {
    // You could use your toast here if needed
    return [];
  }
  return (
    data?.map((row) => ({
      id: row.id,
      doctor: row.doctor,
      specialty: row.specialty,
      date: row.date,
      time: row.time,
      status: row.status,
      notes: row.notes || "",
      createdAt: row.created_at
    })) || []
  );
}

// Add an appointment (guest: localStorage, auth: supabase)
export async function addAppointment(appointment: Appointment): Promise<boolean> {
  if (isGuestSession()) {
    const all = getLocalAppointments();
    setLocalAppointments([...all, appointment]);
    return true;
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return false;
  const { error } = await supabase.from("appointments").insert([
    {
      user_id: user.id,
      doctor: appointment.doctor,
      specialty: appointment.specialty,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes ?? "",
    },
  ]);
  return !error;
}

// Optional: delete, update, etc., if you ever need below (not used in Booking/History now).
export async function removeAppointment(id: string): Promise<boolean> {
  if (isGuestSession()) {
    const all = getLocalAppointments();
    setLocalAppointments(all.filter((a) => a.id !== id));
    return true;
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return false;
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id);
  return !error;
}
