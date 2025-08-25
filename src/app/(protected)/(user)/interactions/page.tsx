import { getInteracciones } from "@/services/interactions.service";
import { getTalentos } from "@/services/talent.service";
import { InteraccionTable } from "./components/interaction-table";
import { InteraccionColumns } from "./components/interaction-columns";
import { MessageSquare, Users, TrendingUp, Clock } from "lucide-react";

export default async function InteraccionPage() {
    const interacciones = await getInteracciones();
    const talentos = await getTalentos();

    const totalInteracciones = interacciones?.length || 0;
    const interaccionesActivas = interacciones?.filter(i => i.estado !== 'FINALIZADA').length || 0;
    const interaccionesHoy = interacciones?.filter(i => {
      const today = new Date().toDateString();
      const interaccionDate = new Date(i.fecha).toDateString();
      return today === interaccionDate;
    }).length || 0;
  
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-600/20 rounded-xl border border-green-500/30">
                <MessageSquare className="h-8 w-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Gestión de Interacciones
                </h1>
                <p className="text-slate-400 text-lg">
                  Supervisa y administra las interacciones con talentos
                </p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600/30 rounded-lg border border-green-500/30">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Total Interacciones</p>
                    <p className="text-2xl font-bold text-white">{totalInteracciones}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-500/30">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Interacciones Activas</p>
                    <p className="text-2xl font-bold text-white">{interaccionesActivas}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/30 rounded-lg border border-purple-500/30">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Hoy</p>
                    <p className="text-2xl font-bold text-white">{interaccionesHoy}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <InteraccionTable
              columns={InteraccionColumns}
              data={interacciones || []}
              talentos={talentos || []}
            />
          </div>
        </div>
      </div>
    );
  }