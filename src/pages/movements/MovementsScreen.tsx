import { useEffect, useState } from "react";
import { useMovimentacoesApi } from "../../hooks/useMovementsApi";
import { useEventDaysApi } from "../../hooks/useEventDaysApi";
import Popup from "../../components/Popup";
import "../../styles/MovementsScreen.css";

const Movimentacoes: React.FC = () => {
  const { eventDays, loading: loadingDays, error } = useEventDaysApi();
  const [selectedEventDayId, setSelectedEventDayId] = useState<number | null>(null);
  const { loading, dadosGerais, showPopup, popupMessage, downloadExcel, loadingDownload } = useMovimentacoesApi(selectedEventDayId);

  useEffect(() => {
    if (eventDays.length > 0 && selectedEventDayId === null) {
      setSelectedEventDayId(eventDays[0].event_day_id);
    }
  }, [eventDays]);

  return (
    <div className="movements-container">
      <h2 className="title">Movimentações</h2>

      <Popup show={showPopup} message={popupMessage} />

      {/* Seletor de datas + Botão de Download */}
      {loadingDays ? (
        <p>Carregando datas...</p>
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
            onClick={downloadExcel}
            disabled={selectedEventDayId === null || loadingDownload}
          >
            {loadingDownload ? "📥 Baixando..." : "📥 Baixar Excel"}
          </button>
        </div>
      )}

      {/* Exibição de Loading */}
      {loading ? (
        <p className="loading-text">Carregando dados...</p>
      ) : (
        <div className="table-container">
          <table className="table table-bordered table-striped">
            <thead className="table-dark text-center">
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Impacto</th>
                <th>Saldo Atual</th>
                <th>Origem</th>
                <th>Justificativa</th>
                <th>Data</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {dadosGerais.length > 0 ? (
                dadosGerais.map((row, index) => (
                  <tr key={index} className={row.Impact > 0 ? "table-success" : "table-danger"}>
                    <td>{row.PersonName}</td>
                    <td>{row.Cpf}</td>
                    <td className="text-center">{row.Impact > 0 ? `+${row.Impact}` : row.Impact}</td>
                    <td className="text-center">{row.BalanceCurrentValue}</td>
                    <td>{row.ImpactOrigin}</td>
                    <td>{row.Justification ? row.Justification : "-"}</td>
                    <td>{row.ImpactDate ? row.ImpactDate.split(" ")[0] : "-"}</td>
                    <td>{row.ImpactDate ? row.ImpactDate.split(" ")[1] : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">Nenhuma movimentação encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Movimentacoes;
