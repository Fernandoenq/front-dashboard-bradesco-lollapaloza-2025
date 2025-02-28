import { useEffect, useState } from "react";
import { useParticipantesApi } from "../../hooks/useParticipantesApi";
import { useEventDaysApi } from "../../hooks/useEventDaysApi";
import Popup from "../../components/Popup";

const Participantes: React.FC = () => {
  const { eventDays, loading: loadingDays, error } = useEventDaysApi();
  const [selectedEventDayId, setSelectedEventDayId] = useState<number | null>(null);
  const { loading, participantes, showPopup, popupMessage, downloadExcel, loadingDownload } = useParticipantesApi(selectedEventDayId);

  // Definir automaticamente o primeiro event_day_id
  useEffect(() => {
    if (eventDays.length > 0 && selectedEventDayId === null) {
      console.log("🔄 Definindo primeira data automaticamente:", eventDays[0].event_day_id);
      setSelectedEventDayId(eventDays[0].event_day_id);
    }
  }, [eventDays]);

  return (
    <div>
      <h2>Participantes</h2>

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
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Data de Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {participantes.length > 0 ? (
              participantes.map((row, index) => (
                <tr key={index}>
                  <td>{row.PersonName}</td>
                  <td>{row.Cpf}</td>
                  <td>{row.Email}</td>
                  <td>{row.Phone}</td>
                  <td>{row.RegisterDate ? row.RegisterDate.split(" ")[0] : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">Nenhum participante encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Participantes;
