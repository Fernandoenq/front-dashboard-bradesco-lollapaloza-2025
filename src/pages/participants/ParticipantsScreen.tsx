import { useEffect, useState } from "react";
import { useParticipantesApi } from "../../hooks/useParticipantesApi";
import { useEventDaysApi } from "../../hooks/useEventDaysApi";
import Popup from "../../components/Popup";
import "../../styles/ParticipantsScreen.css";

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
    <div className="participants-container">
      <h2 className="title">Participantes</h2>

      {/* Popup de mensagens */}
      <Popup show={showPopup} message={popupMessage} />

      {/* Seletor de datas + Botão de Download */}
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
                <th>E-mail</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {participantes.length > 0 ? (
                participantes.map((row, index) => (
                  <tr key={index}>
                    <td>{row.PersonName}</td>
                    <td>{row.Cpf}</td>
                    <td>{row.Mail || "Não informado"}</td>
                    <td>{row.Phone}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">Nenhum participante encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Participantes;
