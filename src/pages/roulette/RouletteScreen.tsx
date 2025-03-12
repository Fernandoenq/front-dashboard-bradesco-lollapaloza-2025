import { useEffect, useState } from "react";
import { useEventDaysApi } from "../../hooks/useEventDaysApi";
import { useRouletteGroupsApi } from "../../hooks/useRouletteGroupsApi";
import { useAwardsApi } from "../../hooks/useAwardsApi"; // Agora contém as funções de download
import dataOptions from "../../data/dataOptions";
import Popup from "../../components/Popup";

const Roleta: React.FC = () => {
  const { eventDays, loading: loadingDays, error } = useEventDaysApi();
  const { roulettes, loading: loadingRoulette, error: errorRoulette } = useRouletteGroupsApi();
  
  const [selectedEventDayId, setSelectedEventDayId] = useState<number | null>(null);
  const [selectedRouletteId, setSelectedRouletteId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>(dataOptions[0]);

  // Hook que contém os métodos de download
  const { 
    awards, 
    loading: loadingAwards, 
    error: errorAwards, 
    downloadAllPredefinedAwards, 
    downloadAllAwards, 
    loadingDownload 
  } = useAwardsApi(selectedRouletteId, selectedEventDayId, selectedOption);

  // Define automaticamente a primeira data disponível
  useEffect(() => {
    if (eventDays.length > 0 && selectedEventDayId === null) {
      setSelectedEventDayId(eventDays[0].event_day_id);
    }
  }, [eventDays]);

  // Define automaticamente a primeira roleta disponível
  useEffect(() => {
    if (roulettes.length > 0 && selectedRouletteId === null) {
      setSelectedRouletteId(roulettes[0].id);
    }
  }, [roulettes]);

  // Função para determinar qual download executar
  const handleDownload = () => {
    if (selectedOption === "Premiados") {
      downloadAllAwards();
    } else if (selectedOption === "Planilha Base") {
      downloadAllPredefinedAwards();
    }
  };

  // Desabilita o botão caso as condições não sejam atendidas
  const isDownloadDisabled = 
    loadingDownload || 
    (selectedOption === "Premiados" && (selectedEventDayId === null || selectedRouletteId === null));

  return (
    <div>
      <h2>Roleta</h2>

      {/* Popup de mensagens */}
      <Popup show={false} message="" />

      {/* Seletor de Datas */}
      {loadingDays ? (
        <p>Carregando datas...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div className="d-flex justify-content-between mb-3">
          <div className="btn-group">
            {eventDays.map((day) => (
              <button
                key={day.event_day_id}
                className={`btn ${selectedEventDayId === day.event_day_id ? "btn-dark fw-bold" : "btn-light border"}`}
                onClick={() => setSelectedEventDayId(day.event_day_id)}
              >
                {day.description}
              </button>
            ))}
          </div>
          {/* Botão de Baixar Excel */}
          <button
            className="btn btn-success"
            onClick={handleDownload}
            disabled={isDownloadDisabled}
          >
            {loadingDownload ? "📥 Baixando..." : "📥 Baixar Excel"}
          </button>
        </div>
      )}

      {/* Seletor de Roletas */}
      {loadingRoulette ? (
        <p>Carregando roletas...</p>
      ) : errorRoulette ? (
        <p className="text-danger">{errorRoulette}</p>
      ) : (
        <div className="d-flex justify-content-center mb-3">
          <div className="btn-group">
            {roulettes.map((roulette) => (
              <button
                key={roulette.id}
                className={`btn ${selectedRouletteId === roulette.id ? "btn-dark fw-bold" : "btn-light border"}`}
                onClick={() => setSelectedRouletteId(roulette.id)}
              >
                {roulette.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Seletor de Premiados / Planilha Base */}
      <div className="d-flex justify-content-center mb-3">
        <div className="btn-group">
          {dataOptions.map((option) => (
            <button
              key={option}
              className={`btn ${selectedOption === option ? "btn-dark fw-bold" : "btn-light border"}`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Exibição das tabelas */}
      {loadingAwards ? (
        <p>Carregando dados...</p>
      ) : errorAwards ? (
        <p className="text-danger">{errorAwards}</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark text-center">
            <tr>
              <th>Data do Prêmio</th>
              <th>Status</th>
              <th>CPF</th>
              <th>Nome</th>
              <th>Brinde</th>
              <th>Data Programada</th>
            </tr>
          </thead>
          <tbody>
            {awards.length > 0 ? (
              awards.map((row, index) => (
                <tr key={index} className={row.AwardStatus === "Resgatado" ? "table-success" : "table-warning"}>
                  <td>{row.AwardDate || "-"}</td>
                  <td>{row.AwardStatus}</td>
                  <td>{row.Cpf || "-"}</td>
                  <td>{row.PersonName || "-"}</td>
                  <td>{row.GiftName || "-"}</td>
                  <td>{row.PredefinedDateTime.split(" ")[0]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">Nenhum dado encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Roleta;
