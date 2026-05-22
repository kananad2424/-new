import React, { useState } from "react";
import { BookOpen, Search, ChevronRight, FileText, CornerDownRight, CheckCircle2 } from "lucide-react";
import { POLICIES } from "../data";
import { LeavePolicy } from "../types";

export const PolicyDocs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<LeavePolicy | null>(POLICIES[0]);

  const filteredPolicies = POLICIES.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 select-text">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#091426] tracking-tight">
          Company Policy Documents
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Review standard corporate leave, medical certifications, carrying limits and maternity allowances.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Policies Directory list */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search company code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm placeholder-slate-400"
            />
          </div>

          <div className="space-y-1">
            {filteredPolicies.map((policy) => {
              const isSelected = selectedPolicy?.id === policy.id;
              return (
                <button
                  key={policy.id}
                  onClick={() => setSelectedPolicy(policy)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left border transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-indigo-50/50 border-indigo-100 text-indigo-700"
                      : "border-transparent text-slate-600 hover:bg-slate-50/80 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{policy.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{policy.id}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-0 transition-opacity shrink-0 ${isSelected ? "opacity-100 text-indigo-600" : "group-hover:opacity-50 text-slate-400"}`} />
                </button>
              );
            })}
            {filteredPolicies.length === 0 && (
              <p className="text-center py-6 text-xs text-slate-400 font-semibold">No policies match search.</p>
            )}
          </div>
        </div>

        {/* Right Side: Deep Details of Selected Policy */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 min-h-[300px]">
          {selectedPolicy ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-indigo-600">Company Standard Handbooks</span>
                <h2 className="text-xl font-extrabold text-[#091426] tracking-tight mt-1">
                  {selectedPolicy.title}
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-2 leading-relaxed">
                  {selectedPolicy.description}
                </p>
              </div>

              {/* Bullet Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Policy Rules & Stipulations:</h3>
                <div className="space-y-3">
                  {selectedPolicy.details.map((bullet, idx) => (
                    <div key={idx} className="flex gap-3.5 items-start p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="p-1 text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* HR note flag */}
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3 text-indigo-805">
                <BookOpen className="w-5 h-5 shrink-0 text-indigo-500 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-indigo-900 leading-normal">Regulatory Compliance Statement</h4>
                  <p className="text-[11px] text-indigo-700 leading-relaxed font-semibold">
                    All compliance requests are processed relative to standard labor legislation. Please consult your human resources advisor if you require ad-hoc arrangements or compassionate allocations during difficult periods.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <BookOpen className="w-12 h-12 text-slate-300" />
              <h3 className="text-sm font-bold text-slate-600">No policy selected</h3>
              <p className="text-xs text-slate-400">Select a directory category from the adjacent navigation tree to read guidelines.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
