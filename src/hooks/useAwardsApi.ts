import { useState, useEffect } from "react";

const API_BASE_URL = "https://api-back.picbrand.dev.br"; // Base da API

export const useAwardsApi = (selectedRouletteId: number | null, selectedEventDayId: number | null, selectedOption: string) => {
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false); // Estado para indicar o download

  useEffect(() => {
    if (selectedOption === "Premiados" && (selectedRouletteId === null || selectedEventDayId === null)) {
      return; // Não buscar se uma das seleções for nula
    }

    const endpoint =
      selectedOption === "Premiados"
        ? `/Dashboard/GetAwards/${selectedRouletteId}/${selectedEventDayId}`
        : `/Dashboard/GetAllPredefinedAwards`;

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

  // 🔽 Função para baixar a "Planilha Base" (DownloadAllPredefinedAwards)
  const downloadAllPredefinedAwards = async () => {
    setLoadingDownload(true);
    const url = `${API_BASE_URL}/Dashboard/DownloadAllPredefinedAwards`;
    console.log(`📥 Baixando arquivo de: ${url}`);

    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        throw new Error("Erro ao baixar o arquivo.");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `PlanilhaBase.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("✅ Download concluído!");
    } catch (error) {
      console.error("🚨 Erro ao baixar o arquivo:", error);
    }

    setLoadingDownload(false);
  };

  // 🔽 Função para baixar os "Premiados" (DownloadAllAwards)
  const downloadAllAwards = async () => {
    if (selectedRouletteId === null || selectedEventDayId === null) {
      console.warn("⚠️ Download cancelado: Selecione uma Roleta e uma Data.");
      return;
    }

    setLoadingDownload(true);
    const url = `${API_BASE_URL}/Dashboard/DownloadAwards/${selectedRouletteId}/${selectedEventDayId}`;
    console.log(`📥 Baixando arquivo de: ${url}`);

    try {
      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        throw new Error("Erro ao baixar o arquivo.");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Premiados_Dia_${selectedEventDayId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("✅ Download concluído!");
    } catch (error) {
      console.error("🚨 Erro ao baixar o arquivo:", error);
    }

    setLoadingDownload(false);
  };

  return { 
    awards, 
    loading, 
    error, 
    downloadAllPredefinedAwards, 
    downloadAllAwards, 
    loadingDownload 
  };
};
