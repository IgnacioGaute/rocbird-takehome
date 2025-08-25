import { getReferentes } from "@/services/technical-reference.service";
import { ReferenteTable } from "./components/technical-reference-table";
import { ReferenteColumns } from "./components/technical-reference-columns";
import { Briefcase, Users, Star, Award } from "lucide-react";

export default async function ReferentePage() {
    const referentes = await getReferentes();

    const totalReferentes = referentes?.length || 0;

  
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-500/30">
                <Briefcase className="h-8 w-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Referentes Técnicos
                </h1>
                <p className="text-slate-400 text-lg">
                  Administra los referentes técnicos de la organización
                </p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/30 rounded-lg border border-purple-500/30">
                    <Briefcase className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Total Referentes</p>
                    <p className="text-2xl font-bold text-white">{totalReferentes}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <ReferenteTable
              columns={ReferenteColumns}
              data={referentes || []}
            />
          </div>
        </div>
      </div>
    );
  }
  