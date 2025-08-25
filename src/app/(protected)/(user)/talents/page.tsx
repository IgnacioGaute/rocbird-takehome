import { getTalentos } from "@/services/talent.service";
import { TalentoTable } from "./components/talent-table";
import { getReferentes } from "@/services/technical-reference.service";
import { TalentoColumns } from "./components/talent-columns";
import { Users, Briefcase, TrendingUp } from "lucide-react";

export default async function TalentoPage() {
    const talentos = await getTalentos();
    const referentes = await getReferentes();

    const totalTalentos = talentos?.length || 0;
    const talentosActivos = talentos?.filter(t => t.estado === 'ACTIVO').length || 0;
  
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Gestión de Talentos
                </h1>
                <p className="text-slate-400 text-lg">
                  Administra y supervisa el talento de tu organización
                </p>
              </div>
            </div>
            
                         {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-500/30">
                     <Users className="h-5 w-5 text-blue-400" />
                   </div>
                   <div>
                     <p className="text-sm text-gray-300 font-medium">Total Talentos</p>
                     <p className="text-2xl font-bold text-white">{totalTalentos}</p>
                   </div>
                 </div>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-600/30 rounded-lg border border-green-500/30">
                     <TrendingUp className="h-5 w-5 text-green-400" />
                   </div>
                   <div>
                     <p className="text-sm text-gray-300 font-medium">Talentos Activos</p>
                     <p className="text-2xl font-bold text-white">{talentosActivos}</p>
                   </div>
                 </div>
               </div>
               
               <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-600/30 rounded-lg border border-purple-500/30">
                     <Briefcase className="h-5 w-5 text-purple-400" />
                   </div>
                   <div>
                     <p className="text-sm text-gray-300 font-medium">Referentes</p>
                     <p className="text-2xl font-bold text-white">{referentes?.length || 0}</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>

                     {/* Table Section */}
           <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <TalentoTable
              columns={TalentoColumns}
              data={talentos || []}
              referentes={referentes || []}
            />
          </div>
        </div>
      </div>
    );
  }
 