import { useEffect, useState } from "react";
import { useMovimentacoesApi } from "../../hooks/useMovementsApi";
import { useEventDaysApi } from "../../hooks/useEventDaysApi";
import Popup from "../../components/Popup";

const Movimentacoes: React.FC = () => {
  const { eventDays, loading: loadingDays, error } = useEventDaysApi();
  const [selectedEventDayId, setSelectedEventDayId] = useState<number | null>(null);
  const { loading, dadosGerais, showPopup, popupMessage, downloadExcel, loadingDownload } = useMovimentacoesApi(selectedEventDayId);

  // Quando as datas forem carregadas, definir a primeira como padrão
  useEffect(() => {
    if (eventDays.length > 0 && selectedEventDayId === null) {
      console.log("🔄 Definindo primeira data automaticamente:", eventDays[0].event_day_id);
      setSelectedEventDayId(eventDays[0].event_day_id);
    }
  }, [eventDays]);

  return (
    <div>
      <h2>Movimentações</h2>

      {/* Popup de mensagens */}
      <Popup show={showPopup} message={popupMessage} />

      {/* Seletor de datas + Botão de Download */}
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
          <button
            className="btn btn-success"
            onClick={downloadExcel}
            disabled={selectedEventDayId === null || loadingDownload}
          >
            {loadingDownload ? "📥 Baixando..." : "📥 Baixar Excel"}
          </button>
        </div>
      )}

      {/* Exibição de Loading */}
      {loading ? (
        <p>Carregando dados...</p>
      ) : (
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
      )}
    </div>
  );
};

export default Movimentacoes;
