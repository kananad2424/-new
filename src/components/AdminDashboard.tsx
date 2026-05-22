import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Info,
  ChevronDown
} from "lucide-react";
import { Employee, LeaveRequest, LeaveStatus } from "../types";

interface AdminDashboardProps {
  currentUser: Employee;
  allRequests: LeaveRequest[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string, comment?: string) => void;
  onViewRequestDetails: (req: LeaveRequest) => void;
  onExportReport: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  allRequests,
  onApproveRequest,
  onRejectRequest,
  onViewRequestDetails,
  onExportReport,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Needs Action">("All");

  // Calculations for Stat Cards
  const totalRequestsCount = allRequests.length + 1241; // Seed value starting at 1248
  const pendingCount = allRequests.filter((r) => r.status === "Pending").length;
  const approvedCount = allRequests.filter((r) => r.status === "Approved").length + 851;
  const rejectedCount = allRequests.filter((r) => r.status === "Rejected").length + 22;

  // Filter & Search Requests
  const filteredRequests = allRequests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "Pending") {
      return matchesSearch && req.status === "Pending";
    }
    if (statusFilter === "Needs Action") {
      // Pending requests are action claims
      return matchesSearch && req.status === "Pending";
    }
    return matchesSearch;
  });

  // Helper formats
  const getRequestStatusBadge = (status: LeaveStatus) => {
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#4b41e1] bg-indigo-50 border border-indigo-200/50 rounded-xl leading-none animate-pulse">
            Pending
          </span>
        );
    }
  };

  const formatDateRange = (startStr: string, endStr: string, duration: number) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const startDay = start.getDate();
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });
    const endDay = end.getDate();

    const durationStr = `${duration} ${duration === 0.5 ? "Day" : duration === 1 ? "Day" : "Days"}`;

    if (startStr === endStr) {
      return `${startMonth} ${startDay} (${durationStr})`;
    } else if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay} (${durationStr})`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay} (${durationStr})`;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Avatar matching styles
  const avatarColors = [
    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "bg-emerald-100 text-emerald-700 border-emerald-200",
    "bg-amber-100 text-amber-700 border-amber-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-sky-100 text-sky-700 border-sky-200",
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 select-text">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-sm font-semibold tracking-wide text-indigo-600 uppercase font-sans">
            HR Connect
          </span>
          <h1 className="text-2xl font-extrabold text-[#091426] tracking-tight mt-1">
            Management Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Overview of all employee leave balances, team availability, and active pending submissions.
          </p>
        </div>

        <button
          onClick={onExportReport}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Metrics Row of StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Requests metric card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex justify-between items-start">
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">
              Total Requests
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#091426]">{totalRequestsCount}</h3>
              <span className="text-xs font-bold text-emerald-600 flex items-center leading-none">
                ⬈ 12%
              </span>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Action metric card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex justify-between items-start">
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">
              Pending Action
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#091426]">{pendingCount}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg">
                Requires Review
              </span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-500">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Approved Metric Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex justify-between items-start">
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">
              Approved (MTD)
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#091426]">{approvedCount}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-750 rounded-lg">
                This Month
              </span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Rejected Metric Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex justify-between items-start">
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono block">
              Rejected
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-[#091426]">{rejectedCount}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 border border-red-100 text-red-700 rounded-lg">
                This Month
              </span>
            </div>
          </div>
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Segment */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Table Controls (Search + Filters Row) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-base font-extrabold text-[#091426] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
            Recent Leave Requests
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-600 transition-all shadow-sm placeholder-slate-400"
              />
            </div>

            {/* Pill filter selectors */}
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200/30 flex text-xs font-bold leading-none">
              {(["All", "Pending", "Needs Action"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === tab
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No requests found</h3>
            <p className="text-xs text-slate-400">Try structural keywords, different filters, or check employee names.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wildest pb-3.5">
                  <th className="pb-3.5 font-semibold">Employee</th>
                  <th className="pb-3.5 font-semibold">Department</th>
                  <th className="pb-3.5 font-semibold">Type</th>
                  <th className="pb-3.5 font-semibold">Dates</th>
                  <th className="pb-3.5 font-semibold">Status</th>
                  <th className="pb-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 text-xs font-medium text-slate-600">
                {filteredRequests.map((req, idx) => {
                  const avatarColor = avatarColors[idx % avatarColors.length];
                  
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name avatar card item block */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg font-bold text-xs flex justify-center items-center shrink-0 border ${avatarColor}`}>
                            {getInitials(req.employeeName)}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-slate-800 leading-tight truncate">{req.employeeName}</p>
                            <p className="text-[10px] text-slate-450 font-bold mt-0.5 truncate leading-none">ID: {req.employeeId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-4 text-slate-500 font-semibold">{req.department}</td>

                      {/* Type */}
                      <td className="py-4 font-bold text-slate-800">{req.leaveType}</td>

                      {/* Dates duration block */}
                      <td className="py-4 text-slate-500 font-semibold">
                        {formatDateRange(req.startDate, req.endDate, req.duration)}
                      </td>

                      {/* Status */}
                      <td className="py-4">{getRequestStatusBadge(req.status)}</td>

                      {/* Action trigger icon list */}
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {req.status === "Pending" ? (
                            <>
                              <button
                                onClick={() => onApproveRequest(req.id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Approve immediately"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onRejectRequest(req.id)}
                                className="p-1.5 text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : null}
                          <button
                            onClick={() => onViewRequestDetails(req)}
                            className="p-1.5 hover:bg-slate-100 font-semibold text-slate-400 hover:text-indigo-600 rounded-lg transition-all cursor-pointer"
                            title="View full details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
