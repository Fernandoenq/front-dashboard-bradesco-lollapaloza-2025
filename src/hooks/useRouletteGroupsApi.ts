import { useState, useEffect } from "react";

const API_BASE_URL = "http://18.231.158.211:3335"; // Base da API

export const useRouletteGroupsApi = () => {
  const [roulettes, setRoulettes] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRouletteGroups = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/Dashboard/RouletteGroup`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar as roletas");
      }

      const result = await response.json();
      console.log("🎰 Roletas recebidas:", result);

      // Substituindo "Grupo" por "Roleta"
      const formattedRoulettes = result.map((roulette: any) => ({
        id: roulette.roulette_group_id,
        name: roulette.description.replace("Grupo", "Roleta"),
      }));

      setRoulettes(formattedRoulettes);
    } catch (err) {
      console.error("🚨 Erro ao buscar as roletas:", err);
      setError("Erro ao carregar as roletas.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRouletteGroups();
  }, []);

  return { roulettes, loading, error };
};
