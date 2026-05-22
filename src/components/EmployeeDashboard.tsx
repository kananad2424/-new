import React, { useState } from "react";
import { CircularProgress } from "./CircularProgress";
import { Plus, Eye, CheckCircle2, AlertTriangle, FileSpreadsheet, EyeOff, Info, HelpCircle } from "lucide-react";
import { Employee, LeaveRequest } from "../types";

interface EmployeeDashboardProps {
  currentUser: Employee;
  myRequests: LeaveRequest[];
  onApplyLeaveClick: () => void;
  onViewRequestDetails: (req: LeaveRequest) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  myRequests,
  onApplyLeaveClick,
  onViewRequestDetails,
}) => {
  // Today's Date formatted: "Tuesday, October 24, 2023" to match template screenshots
  const formattedToday = "Tuesday, October 24, 2023";

  // Balance Metrics
  const annualBalance = currentUser.leaveBalance["Annual Leave"];
  const sickBalance = currentUser.leaveBalance["Sick Leave"];
  const personalBalance = currentUser.leaveBalance["Personal Leave"];

  const statCardsData = [
    {
      title: "ANNUAL LEAVE",
      used: annualBalance.used,
      total: annualBalance.total,
      suffix: "/ 20 days",
      statusText: "Available",
      statusType: "success",
      progress: ((annualBalance.total - annualBalance.used) / annualBalance.total) * 100, // available pct
      color: "#22c55e", // green
    },
    {
      title: "SICK LEAVE",
      used: sickBalance.used,
      total: sickBalance.total,
      suffix: "/ 10 days",
      statusText: "Low Balance",
      statusType: "warning",
      progress: ((sickBalance.total - sickBalance.used) / sickBalance.total) * 100,
      color: "#ef4444", // red
    },
    {
      title: "PERSONAL LEAVE",
      used: personalBalance.used,
      total: personalBalance.total,
      suffix: "/ 5 days",
      statusText: "Accruing",
      statusType: "info",
      progress: ((personalBalance.total - personalBalance.used) / personalBalance.total) * 100,
      color: "#4f46e5", // indigo
    },
  ];

  const getStatusBadge = (type: string, text: string) => {
    switch (type) {
      case "success":
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {text}
          </span>
        );
      case "warning":
        return (
          <span className="flex items-center gap-1.5 text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {text}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {text}
          </span>
        );
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-xl leading-none">
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200/50 rounded-xl leading-none">
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/50 rounded-xl leading-none animate-pulse">
            Pending
          </span>
        );
    }
  };

  // Format date range nicely: "Oct 20 - Oct 24 (3 days)" Or "Sep 12 (1 day)"
  const formatDateRange = (startStr: string, endStr: string, duration: number) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const startDay = start.getDate();
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });
    const endDay = end.getDate();

    const durationStr = `${duration} ${duration === 1 ? "day" : "days"}`;

    if (startStr === endStr) {
      return `${startMonth} ${startDay} (${durationStr})`;
    } else if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay} (${durationStr})`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay} (${durationStr})`;
    }
  };

  const formatDateApplied = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  return (
    <div className="p-6 md:p-8 space-y-8 select-text">
      {/* Dashboard Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 capitalize tracking-wide font-sans mb-1">
            {formattedToday}
          </p>
          <h1 className="text-2xl font-extrabold text-[#091426] tracking-tight">
            Good Morning, {currentUser.name.split(" ")[0]}
          </h1>
        </div>

        <button
          onClick={onApplyLeaveClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-indigo-100 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Row of Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCardsData.map((card, index) => {
          // Available equals Total - Used
          const available = card.total - card.used;

          return (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-2xl p-6 flex justify-between items-center shadow-xs transition-shadow hover:shadow-md relative"
            >
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-[#091426] uppercase tracking-widest font-mono">
                  {card.title}
                </span>
                <div>
                  <h3 className="text-3xl font-extrabold text-[#091426]">
                    {available}
                    <span className="text-xs font-semibold text-slate-400 font-sans ml-1">
                      {card.suffix}
                    </span>
                  </h3>
                </div>
                <div>{getStatusBadge(card.statusType, card.statusText)}</div>
              </div>

              {/* Circular donut visual */}
              <div className="ml-4">
                <CircularProgress percentage={card.progress} color={card.color} size={80} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-base font-extrabold text-[#091426] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
            Recent Requests
          </h2>
          <button
            onClick={onApplyLeaveClick}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-805 transition-colors"
          >
            View All
          </button>
        </div>

        {myRequests.length === 0 ? (
          <div className="text-center p-10 space-y-3">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No requests submitted yet</h3>
            <p className="text-xs text-slate-400">Click the Apply button above to submit your first leave requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3.5 font-semibold">Date Applied</th>
                  <th className="pb-3.5 font-semibold">Leave Type</th>
                  <th className="pb-3.5 font-semibold">Duration</th>
                  <th className="pb-3.5 font-semibold">Status</th>
                  <th className="pb-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 text-xs font-medium text-slate-600">
                {myRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-semibold text-slate-500">
                      {formatDateApplied(req.appliedDate)}
                    </td>
                    <td className="py-4">
                      <span className="font-bold text-slate-800">{req.leaveType}</span>
                    </td>
                    <td className="py-4">
                      {formatDateRange(req.startDate, req.endDate, req.duration)}
                    </td>
                    <td className="py-4">
                      {getRequestStatusBadge(req.status)}
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => onViewRequestDetails(req)}
                        className="p-1.5 hover:bg-slate-100 font-semibold text-slate-400 hover:text-indigo-600 rounded-lg transition-all cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
