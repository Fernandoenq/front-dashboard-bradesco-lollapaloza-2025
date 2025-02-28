import { useState, useEffect } from "react";

const API_BASE_URL = "http://18.231.158.211:3335"; // Base da API

export const useEventDaysApi = () => {
  const [eventDays, setEventDays] = useState<{ description: string; event_day_id: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventDays = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Dashboard/EventDay`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar os dias do evento");
      }

      const result = await response.json();
      console.log("📅 Dias do evento recebidos:", result);
      setEventDays(result);
    } catch (err) {
      console.error("🚨 Erro ao buscar os dias do evento:", err);
      setError("Erro ao carregar as datas.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEventDays();
  }, []);

  return { eventDays, loading, error };
};
