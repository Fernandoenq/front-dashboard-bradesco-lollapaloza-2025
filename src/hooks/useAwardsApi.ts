import { useState, useEffect } from "react";

const API_BASE_URL = "https://api-back.picbrand.dev.br"; // Base da API

export const useAwardsApi = (selectedRouletteId: number | null, selectedEventDayId: number | null, selectedOption: string) => {
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedOption === "Premiados" && (selectedRouletteId === null || selectedEventDayId === null)) {
      return; // Não buscar se uma das seleções for nula
    }

    const endpoint =
      selectedOption === "Premiados"
        ? `/Dashboard/GetAwards/${selectedRouletteId}/${selectedEventDayId}`
        : `/Dashboard/GetAllPredefinedAwards `;

    console.log(`📡 Fazendo requisição para: ${endpoint}`); // Exibe o caminho no console

    const fetchAwards = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os dados");
        }

        // 🔥 Ler a resposta como texto para evitar erro de parsing
        let textResponse = await response.text();

        // 🔄 Substituir NaN por null na string antes de parsear para JSON
        textResponse = textResponse.replace(/NaN/g, "null");

        // 📌 Converter o texto para JSON agora que está corrigido
        let result = JSON.parse(textResponse);
        console.log(`🎁 Dados carregados (${selectedOption}):`, result);

        setAwards(result);
      } catch (err) {
        console.error("🚨 Erro ao buscar os dados:", err);
        setError("Erro ao carregar os dados.");
      }

      setLoading(false);
    };

    fetchAwards();
  }, [selectedRouletteId, selectedEventDayId, selectedOption]);

  return { awards, loading, error };
};
