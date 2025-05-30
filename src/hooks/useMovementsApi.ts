import { useState, useEffect } from "react";

const API_BASE_URL = "https://api-back.picbrand.dev.br"; // Base da API

export const useMovimentacoesApi = (selectedEventDayId: number | null) => {
  const [dadosGerais, setDadosGerais] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);

  // Função para buscar as movimentações filtradas pelo event_day_id
  const fetchMovimentacoes = async () => {
    if (selectedEventDayId === null) return; // Não buscar se não houver ID selecionado

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Dashboard/GetAllBalance/${selectedEventDayId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      let result: any = null;
      if (response.status !== 204) {
        try {
          result = await response.json();
        } catch (error) {
          console.warn("⚠️ Resposta da API não contém JSON válido.");
        }
      }

      console.log(`📩 Resposta da API (Movimentações para event_day_id ${selectedEventDayId}):`, result);

      if (response.ok && Array.isArray(result)) {
        setDadosGerais(result);
        setPopupMessage("✅ Dados carregados com sucesso!");
      } else {
        setPopupMessage("❌ Erro ao carregar os dados.");
      }
    } catch (error) {
      setPopupMessage("🚨 Erro de conexão com a API");
    }
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovimentacoes();
  }, [selectedEventDayId]); // Refazer a busca quando a data mudar

  // Função para baixar o Excel
  const downloadExcel = async () => {
    if (selectedEventDayId === null) return;

    setLoadingDownload(true);
    const url = `${API_BASE_URL}/Dashboard/DownloadAllBalance/${selectedEventDayId}`;
    console.log(`📥 Baixando arquivo de: ${url}`);

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao baixar o arquivo.");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Movimentacoes_Dia_${selectedEventDayId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("✅ Download concluído!");
    } catch (error) {
      console.error("🚨 Erro ao baixar o arquivo:", error);
    }

    setLoadingDownload(false);
  };

  return { dadosGerais, loading, showPopup, popupMessage, downloadExcel, loadingDownload };
};
