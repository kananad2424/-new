import React, { useState } from "react";
import { ChevronLeft, ChevronRight, AlertCircle, Plus, Info } from "lucide-react";
import { Employee, LeaveRequest, LeaveType } from "../types";
import { PUBLIC_HOLIDAYS_2023 } from "../data";

interface LeaveCalendarViewProps {
  currentUser: Employee;
  allRequests: LeaveRequest[];
  onApplyLeaveClick: () => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const LeaveCalendarView: React.FC<LeaveCalendarViewProps> = ({
  currentUser,
  allRequests,
  onApplyLeaveClick,
}) => {
  const [calendarMode, setCalendarMode] = useState<"my" | "team">("my");
  // Default to October 2023 to match screenshot, but fully interactive
  const [currentYear, setCurrentYear] = useState(2023);
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed 9)
  const [selectedEvent, setSelectedEvent] = useState<{
    title: string;
    person?: string;
    details: string;
    status: string;
    duration: string;
  } | null>(null);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate Calendar Grid Cells
  const cells: { dateStr: string; dayNum: number; isPadding: boolean }[] = [];

  // Padding days from previous month
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const paddingMonthStr = String(prevMonth + 1).padStart(2, "0");
    const dayStr = `${prevYear}-${paddingMonthStr}-${String(day).padStart(2, "0")}`;
    cells.push({ dateStr: dayStr, dayNum: day, isPadding: true });
  }

  // Active Month Days
  const monthStr = String(currentMonth + 1).padStart(2, "0");
  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = `${currentYear}-${monthStr}-${String(i).padStart(2, "0")}`;
    cells.push({ dateStr: dayStr, dayNum: i, isPadding: false });
  }

  // Next month padding to fill up grid to 42 cells (6 rows)
  const totalCellsNeeded = 42;
  const paddingNextCount = totalCellsNeeded - cells.length;
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const nextMonthStr = String(nextMonth + 1).padStart(2, "0");

  for (let i = 1; i <= paddingNextCount; i++) {
    const dayStr = `${nextYear}-${nextMonthStr}-${String(i).padStart(2, "0")}`;
    cells.push({ dateStr: dayStr, dayNum: i, isPadding: true });
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2023);
    setCurrentMonth(9); // Reset back to October 2023 for demo matching
  };

  // Filter requests based on mode/view
  const filteredRequests = allRequests.filter((req) => {
    if (req.status === "Rejected") return false; // Don't show rejected in calendar
    if (calendarMode === "my") {
      return req.employeeId === currentUser.id;
    }
    return true; // Team calendar gets everything
  });

  const getEventsForDate = (dateStr: string) => {
    const events: {
      type: "holiday" | "leave";
      id: string;
      label: string;
      category?: LeaveType;
      person?: string;
      status?: string;
      reason?: string;
      duration?: number;
    }[] = [];

    // Check holidays
    const holiday = PUBLIC_HOLIDAYS_2023.find((h) => h.date === dateStr);
    if (holiday) {
      events.push({
        type: "holiday",
        id: holiday.name,
        label: holiday.name,
      });
    }

    // Check Leave Request periods (startDate <= dateStr <= endDate)
    filteredRequests.forEach((req) => {
      const start = req.startDate;
      const end = req.endDate;
      if (dateStr >= start && dateStr <= end) {
        events.push({
          type: "leave",
          id: req.id,
          label: `${req.leaveType === "Annual Leave" ? "Annual" : req.leaveType === "Sick Leave" ? "Sick" : "Personal"}${calendarMode === "team" ? ` (${req.employeeName})` : ""}`,
          category: req.leaveType,
          person: req.employeeName,
          status: req.status,
          reason: req.reason,
          duration: req.duration,
        });
      }
    });

    return events;
  };

  const getBadgeStyle = (event: any) => {
    if (event.type === "holiday") {
      return "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500 font-bold";
    }

    const isPending = event.status === "Pending";
    const borderStyle = isPending ? "border-l-2 border-dashed border-amber-400" : "border-l-2";

    switch (event.category) {
      case "Annual Leave":
        return `${isPending ? "bg-amber-50 text-amber-800" : "bg-indigo-50 text-indigo-700 border-indigo-500"} ${borderStyle}`;
      case "Sick Leave":
        return `${isPending ? "bg-amber-50 text-amber-800" : "bg-purple-50 text-purple-700 border-purple-500"} ${borderStyle}`;
      case "Personal Leave":
        return `${isPending ? "bg-amber-50 text-amber-800 animate-pulse" : "bg-sky-50 text-sky-700 border-sky-500"} ${borderStyle}`;
      default:
        return `${isPending ? "bg-amber-50 text-amber-800" : "bg-pink-50 text-pink-700 border-pink-500"} ${borderStyle}`;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426] tracking-tight">
            Leave Calendar
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            View your scheduled time off, colleagues' calendars, and company public holidays.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Subview pill selector: My Leaves / Team Calendar */}
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200/50 flex">
            <button
              onClick={() => setCalendarMode("my")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                calendarMode === "my"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              My Leaves
            </button>
            <button
              onClick={() => setCalendarMode("team")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                calendarMode === "team"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Team Calendar
            </button>
          </div>

          <button
            onClick={onApplyLeaveClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* Calendar Control Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm select-none">
        {/* Month Title & Brackets */}
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-extrabold text-[#091426] font-sans">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>
          <div className="flex bg-slate-50 rounded-xl border border-slate-200/50 p-0.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white rounded-lg transition-all cursor-pointer text-slate-600 active:text-indigo-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white rounded-lg transition-all cursor-pointer text-slate-600 active:text-indigo-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Today
          </button>
        </div>

        {/* Legend Key */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-indigo-50 border-l-2 border-indigo-500" />
            <span className="text-slate-500">Annual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-purple-50 border-l-2 border-purple-500" />
            <span className="text-slate-500">Sick</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-sky-50 border-l-2 border-sky-500" />
            <span className="text-slate-500">Personal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-50 border-l-2 border-emerald-500" />
            <span className="text-slate-500">Public Holiday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-50 border-l-2 border-dashed border-amber-400" />
            <span className="text-slate-500">Pending</span>
          </div>
        </div>
      </div>

      {/* Months Calendar Grid Display */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-md">
        {/* Day Header row */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-extrabold text-slate-400 uppercase tracking-widest border-r border-slate-100/50 last:border-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Cells Grid */}
        <div className="grid grid-cols-7 grid-rows-6 md:auto-rows-fr select-text">
          {cells.map(({ dateStr, dayNum, isPadding }, idx) => {
            const events = getEventsForDate(dateStr);
            // Highlight current highlighted day: Oct 18, 2023
            const isHighlightedDay = dateStr === "2023-10-18";

            return (
              <div
                key={`${dateStr}-${idx}`}
                className={`min-h-[105px] p-2.5 border-b border-r border-slate-100 last:border-r-0 flex flex-col justify-between group transition-colors hover:bg-slate-50/40 ${
                  isPadding ? "bg-slate-50/10 text-slate-300" : "text-slate-700"
                } ${isHighlightedDay ? "ring-2 ring-indigo-600/30 ring-inset" : ""}`}
              >
                {/* Date Number Badge */}
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-lg leading-none ${
                      isHighlightedDay
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 group-hover:text-indigo-900"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {!isPadding && events.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </div>

                {/* Event badgificates list of day */}
                <div className="space-y-1 overflow-y-auto max-h-[70px] no-scrollbar">
                  {events.map((evt, eIdx) => (
                    <button
                      key={`${evt.id}-${eIdx}`}
                      onClick={() => {
                        if (evt.type === "holiday") {
                          setSelectedEvent({
                            title: evt.label,
                            details: "Official corporate paid calendar public holiday.",
                            status: "Approved",
                            duration: "1 Day (Standard)",
                          });
                        } else {
                          setSelectedEvent({
                            title: `${evt.category} Request`,
                            person: evt.person,
                            details: evt.reason || "Reasons approved by team lead.",
                            status: evt.status || "Approved",
                            duration: `${evt.duration} ${evt.duration === 1 ? "day" : "days"}`,
                          });
                        }
                      }}
                      className={`w-full block text-left text-[10px] px-2 py-1 leading-normal rounded-lg transition-transform hover:scale-[1.01] active:scale-[0.99] font-semibold select-none cursor-pointer truncate ${getBadgeStyle(
                        evt
                      )}`}
                    >
                      {evt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Quick Dialog Popup Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border rounded-2xl max-w-sm w-full p-6 shadow-xl animate-scale-up space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{selectedEvent.title}</h3>
                  {selectedEvent.person && (
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">By: {selectedEvent.person}</p>
                  )}
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 font-bold tracking-wide rounded-md ${
                  selectedEvent.status === "Approved"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {selectedEvent.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600 font-medium leading-relaxed">
                {selectedEvent.details}
              </div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider text-right">
                Duration: {selectedEvent.duration}
              </p>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
