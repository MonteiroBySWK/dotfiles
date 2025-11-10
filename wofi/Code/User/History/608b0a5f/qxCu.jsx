import { useEffect, useState } from "react";
import { ContraturnoCalendar } from "../ui/ContraturnoCalendar";
import { ContraturnoSection } from "../ui/ContraturnoSection";
import RegisterContraturno from "./RegisterContraturno";
import { SupabaseController } from "../../hooks/SupabaseController";
import UpdateContraturno from "./UpdateContraturno";

export default function ContraturnoManager() {
    const [isRegisterContraturnoOpen, setIsRegisterContraturnoOpen] = useState(false);
    const [isUpdateContraturnoOpen, setIsUpdateContraturnoOpen] = useState(false);
    const [viewMode, setViewMode] = useState('calendar');
    const [selectedContraturno, setSelectedContraturno] = useState(null);
    const [contraturnos, setContraturnos] = useState([]);

    useEffect(() => {
        fetchContraturnos();
    }, []);

    async function handleDelete(id) {
        try {
            await SupabaseController.deleteContraturno(id);
            setContraturnos(prev => prev.filter(item => item.id !== id))
        } catch (error) {
            console.error("Error deleting contraturno:", error);
        }
    };

    async function handleUpdate(id, contraturnoData) {
        try {
            await SupabaseController.updateContraturno(id, contraturnoData);
            setContraturnos(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, ...contraturnoData }
                        : item
                )
            );
        } catch (error) {
            console.error("Erro on update:", error);

        }
    };

    const handleOpenRegisterContraturno = () => {
        setIsRegisterContraturnoOpen(prev => !prev)
    }

    const handleOpenUpdateContraturno = (contraturno) => {
        setSelectedContraturno(contraturno);
        setIsUpdateContraturnoOpen(true);
    };

    const handleCloseUpdateContraturno = () => {
        setSelectedContraturno(null);
        setIsUpdateContraturnoOpen(false);
    };

    async function fetchContraturnos() {
        try {
            const data = await SupabaseController.fetchContraturnos();
            setContraturnos(data);
        } catch (error) {
            console.error("Erro:" + error);
        }
    }

    return (
        <div className="w-[96%] h-[700px] bg-[#161616] rounded-4xl flex justify-center ">
            <div className="w-[98%] h-[100%] mt-6 flex flex-col justfy-center align-flex-start">
                Calendário
                <div className="w-full h-[90%] mb-4 mt-2 pb-4 rounded-2xl flex flex-col bg-black">
                    <div className="w-full h-[7%] flex flex-row items-center justify-end gap-4 px-4 mt-2">
                        <div className="h-full bg-[#161616] rounded-md flex items-center justify-evenly mt-2 px-1 gap-2">
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`h-[85%] px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'bg-black text-white shadow-sm'
                                    }`}
                            >
                                Calendário
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`h-[85%] px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'bg-black text-white shadow-sm'
                                    }`}
                            >
                                Lista
                            </button>
                        </div>
                        {isRegisterContraturnoOpen && (
                            <RegisterContraturno
                                handleOpenRegisterContraturno={handleOpenRegisterContraturno}
                                onSuccess={fetchContraturnos}
                                contraturnos={contraturnos}
                            />
                        )}

                        {isUpdateContraturnoOpen && selectedContraturno && (
                            <UpdateContraturno
                                contraturno={selectedContraturno}
                                handleClose={handleCloseUpdateContraturno}
                                onUpdate={handleUpdate}
                            />
                        )}
                        <button onClick={handleOpenRegisterContraturno} className="h-[90%] mt-2 bg-[#0054B3] hover:bg-[#0569da] text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl">
                            <span>+ Novo Contraturno</span>
                        </button>
                    </div>
                    {viewMode === 'calendar' ? (
                        <ContraturnoCalendar
                            contraturnos={contraturnos}
                            onDelete={handleDelete}
                            onUpdate={handleOpenUpdateContraturno} />
                    ) : (
                        <div className="bg-[#161616] text-white rounded-2xl shadow-lg overflow-auto mt-2 w-[98%] h-[98%] mx-auto">
                            <div className="w-full h-[7%] flex flex-row items-center justify-start gap-4 px-4 mt-2">contraturno agendados({contraturnos.length})</div>
                            <div className="w-full h-[90%] flex flex-col justify-center items-center gap-3">
                                <div className="w-[95%] h-[95%] overflow-y-auto flex flex-col gap-3 py-3">
                                    {contraturnos.map((ct) => {
                                        const hora = ct.time ? new Date(ct.time).toLocaleTimeString("pt-BR", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }) : "";
                                        const [year, month, day] = ct.data.split("-").map(Number);
                                        const localDate = new Date(year, month - 1, day);
                                        const data = localDate.toLocaleDateString("pt-BR");

                                        return (
                                            <ContraturnoSection
                                                key={ct.id}
                                                contraturno={{
                                                    ...ct,
                                                    data,
                                                    time: hora
                                                }}
                                                onDelete={handleDelete}
                                                onUpdate={handleOpenUpdateContraturno} />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}