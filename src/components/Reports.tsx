import React from "react";
import { BarChart3, TrendingUp, Calendar, Users, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { LeaveRequest } from "../types";

interface ReportsProps {
  allRequests: LeaveRequest[];
}

export const Reports: React.FC<ReportsProps> = ({ allRequests }) => {
  // Compute some basic mock analytics on our leave requests to build the beautiful dashboards
  const annualCount = allRequests.filter((r) => r.leaveType === "Annual Leave" && r.status === "Approved").length + 24;
  const sickCount = allRequests.filter((r) => r.leaveType === "Sick Leave" && r.status === "Approved").length + 12;
  const personalCount = allRequests.filter((r) => r.leaveType === "Personal Leave" && r.status === "Approved").length + 8;
  const totalApproved = annualCount + sickCount + personalCount;

  // Department absences
  const deptData = [
    { name: "Engineering", count: 18, color: "bg-indigo-600" },
    { name: "Product Design", count: 14, color: "bg-purple-650 animate-pulse" },
    { name: "Marketing", count: 8, color: "bg-sky-500" },
    { name: "Human Resources", count: 4, color: "bg-emerald-500" },
    { name: "Finance", count: 3, color: "bg-amber-505" }
  ];

  const maxCount = 20;

  return (
    <div className="p-6 md:p-8 space-y-6 select-text">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#091426] tracking-tight">
          Analytical Reports
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Real-time company-wide leave distribution analytics, department load, and monthly trends.
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Utilization Rate</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">84.2%</h3>
            <p className="text-[10px] font-semibold text-emerald-650 mt-0.5">Optimal capacity maintained</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Avg Approval Time</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">1.2 Hrs</h3>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Automated workflows active</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Active On-Leave</span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-1">3 Employees</h3>
            <p className="text-[10px] font-semibold text-slate-405 mt-0.5">Cross-team cover is secure</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department absence load chart (pure HTML/CSS) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-[#091426] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
              Monthly Absences by Department
            </h2>
          </div>

          <div className="space-y-4">
            {deptData.map((dept, idx) => {
              const percentage = (dept.count / maxCount) * 100;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>{dept.name}</span>
                    <span className="text-slate-500 font-semibold">{dept.count} Days Off</span>
                  </div>
                  <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                    <div
                      className={`h-full rounded-full bg-indigo-600 transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave distribution breakdown */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-[#091426] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
              Leave Category Distributions (Approved)
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center items-end">
            <div className="space-y-2">
              <p className="text-2xl font-black text-indigo-700 font-sans">{annualCount}</p>
              <div className="w-full bg-indigo-100 border border-indigo-200 text-indigo-805 text-[10px] py-1 font-bold rounded-lg uppercase tracking-wide">
                Annual
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-black text-purple-700 font-sans">{sickCount}</p>
              <div className="w-full bg-purple-100 border border-purple-200 text-purple-805 text-[10px] py-1 font-bold rounded-lg uppercase tracking-wide">
                Sick Leave
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-black text-sky-700 font-sans">{personalCount}</p>
              <div className="w-full bg-sky-100 border border-sky-200 text-sky-805 text-[10px] py-1 font-bold rounded-lg uppercase tracking-wide">
                Personal
              </div>
            </div>
          </div>

          {/* Sparkles advice block */}
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3 text-indigo-805 mt-4">
            <Sparkles className="w-5 h-5 shrink-0 text-indigo-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-indigo-900">AI Intelligence Analytics Tip</h4>
              <p className="text-[11px] text-indigo-700 leading-relaxed font-semibold">
                Leave usage patterns suggest optimum team vitality indices throughout October. Unplanned sick leaves have decreased by 14.5% compared to the previous quarter, indicating exceptional wellness scores and robust organizational capacity mapping!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
