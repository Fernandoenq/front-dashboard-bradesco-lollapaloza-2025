import { useEffect, useState } from "react";
import { useEventDaysApi } from "../../hooks/useEventDaysApi";
import { useRouletteGroupsApi } from "../../hooks/useRouletteGroupsApi";
import { useAwardsApi } from "../../hooks/useAwardsApi";
import dataOptions from "../../data/dataOptions";
import Popup from "../../components/Popup";
import "../../styles/RouletteScreen.css";

const Roleta: React.FC = () => {
  const { eventDays, loading: loadingDays, error } = useEventDaysApi();
  const { roulettes, loading: loadingRoulette, error: errorRoulette } = useRouletteGroupsApi();

  const [selectedEventDayId, setSelectedEventDayId] = useState<number | null>(null);
  const [selectedRouletteId, setSelectedRouletteId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>(dataOptions[0]);

  const {
    awards,
    loading: loadingAwards,
    error: errorAwards,
    downloadAllPredefinedAwards,
    downloadAllAwards,
    loadingDownload
  } = useAwardsApi(selectedRouletteId, selectedEventDayId, selectedOption);

  useEffect(() => {
    if (eventDays.length > 0 && selectedEventDayId === null) {
      setSelectedEventDayId(eventDays[0].event_day_id);
    }
  }, [eventDays]);

  useEffect(() => {
    if (roulettes.length > 0 && selectedRouletteId === null) {
      setSelectedRouletteId(roulettes[0].id);
    }
  }, [roulettes]);

  const handleDownload = () => {
    if (selectedOption === "Premiados") {
      downloadAllAwards();
    } else if (selectedOption === "Planilha Base") {
      downloadAllPredefinedAwards();
    }
  };

  const isDownloadDisabled =
    loadingDownload ||
    (selectedOption === "Premiados" && (selectedEventDayId === null || selectedRouletteId === null));

  return (
    <div className="roulette-container">
      <h2 className="title">Roleta</h2>
      <Popup show={false} message="" />

      {/* Seletor de Premiados / Planilha Base (Movido para cima) */}
      <div className="controls">
        <div className="date-buttons">
          {dataOptions.map((option) => (
            <button
              key={option}
              className={`btn ${selectedOption === option ? "btn-dark active-btn" : "btn-light border"}`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Seletor de Datas + Botão de Download (Só aparece para "Premiados") */}
      {selectedOption === "Premiados" && (
        <>
          {loadingDays ? (
            <p className="loading-text">Carregando datas...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="controls">
              <div className="date-buttons">
                {eventDays.map((day) => (
                  <button
                    key={day.event_day_id}
                    className={`btn ${selectedEventDayId === day.event_day_id ? "btn-dark active-btn" : "btn-light border"}`}
                    onClick={() => setSelectedEventDayId(day.event_day_id)}
                  >
                    {day.description}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-success download-btn"
                onClick={handleDownload}
                disabled={isDownloadDisabled}
              >
                {loadingDownload ? "📥 Baixando..." : "📥 Baixar Excel"}
              </button>
            </div>
          )}

          {/* Seletor de Roletas (Só aparece para "Premiados") */}
          {loadingRoulette ? (
            <p className="loading-text">Carregando roletas...</p>
          ) : errorRoulette ? (
            <p className="text-danger">{errorRoulette}</p>
          ) : (
            <div className="controls">
              <div className="date-buttons">
                {roulettes.map((roulette) => (
                  <button
                    key={roulette.id}
                    className={`btn ${selectedRouletteId === roulette.id ? "btn-dark active-btn" : "btn-light border"}`}
                    onClick={() => setSelectedRouletteId(roulette.id)}
                  >
                    {roulette.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Exibição das Tabelas */}
      {loadingAwards ? (
        <p className="loading-text">Carregando dados...</p>
      ) : errorAwards ? (
        <p className="text-danger">{errorAwards}</p>
      ) : (
        <div className="table-container">
          <table className="table table-bordered table-striped">
            <thead className="table-dark text-center">
              <tr>
                {selectedOption === "Premiados" ? (
                  <>
                    <th>Data do Prêmio</th>
                    <th>Status</th>
                    <th>CPF</th>
                    <th>Nome</th>
                    <th>Brinde</th>
                    <th>Data Programada</th>
                  </>
                ) : (
                  <>
                    <th>Brinde</th>
                    <th>Data Programada</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {awards.length > 0 ? (
                awards.map((row, index) => (
                  <tr key={index} className={row.AwardStatus === "Resgatado" ? "table-success" : "table-warning"}>
                    {selectedOption === "Premiados" ? (
                      <>
                        <td>{row.AwardDate || "-"}</td>
                        <td>{row.AwardStatus}</td>
                        <td>{row.Cpf || "-"}</td>
                        <td>{row.PersonName || "-"}</td>
                        <td>{row.GiftName || "-"}</td>
                        <td>{row.PredefinedDateTime || row.AwardDate || "-"}</td> {/* Corrigido para exibir corretamente */}
                      </>
                    ) : (
                      <>
                        <td>{row.GiftName || "-"}</td>
                        <td>{row.PredefinedDateTime || row.AwardDate || "-"}</td> {/* Corrigido para exibir corretamente */}
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedOption === "Premiados" ? 6 : 2} className="text-center">
                    Nenhum dado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Roleta;
