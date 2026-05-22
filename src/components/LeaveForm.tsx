import React, { useState, useEffect } from "react";
import { ArrowLeft, UploadCloud, File, Trash2, Calendar, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Employee, LeaveRequest, LeaveType, CustomFile } from "../types";

interface LeaveFormProps {
  currentUser: Employee;
  onCancel: () => void;
  onSubmit: (request: Omit<LeaveRequest, "id" | "status" | "appliedDate"> & { attachment?: CustomFile }) => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({
  currentUser,
  onCancel,
  onSubmit,
}) => {
  const [leaveType, setLeaveType] = useState<LeaveType>("Annual Leave");
  const [approver, setApprover] = useState("Michael Scott (Direct Manager)");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [attachment, setAttachment] = useState<CustomFile | undefined>(undefined);
  const [isDragOver, setIsDragOver] = useState(false);
  const [duration, setDuration] = useState(0);
  const [formError, setFormError] = useState("");

  // Auto-calculate duration when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      
      if (diffTime < 0) {
        setDuration(0);
        return;
      }
      
      // Add 1 to count both start and end dates as inclusive
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays);
    } else {
      setDuration(0);
    }
  }, [startDate, endDate]);

  const handleFileUpload = (fileName: string, fileSize: number) => {
    const sizeString = (fileSize / (1024 * 1024)).toFixed(1) + " MB";
    const newFile: CustomFile = {
      name: fileName,
      size: sizeString,
      isLoading: true,
      progress: 0,
    };
    
    setAttachment(newFile);

    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setAttachment(prev => {
        if (!prev) return undefined;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return { ...prev, isLoading: false, progress: 100 };
        }
        return { ...prev, progress: currentProgress };
      });
    }, 150);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file.name, file.size);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileUpload(file.name, file.size);
    }
  };

  const removeAttachment = () => {
    setAttachment(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!startDate || !endDate) {
      setFormError("Please select both start and end dates.");
      return;
    }

    if (duration <= 0) {
      setFormError("End date must be on or after start date.");
      return;
    }

    // Require attachment for Sick Leave > 2 days
    if (leaveType === "Sick Leave" && duration > 2 && !attachment) {
      setFormError("Supporting medical certificate is required for Sick Leave longer than 2 days.");
      return;
    }

    if (!reason.trim()) {
      setFormError("Please provide a reason for your leave request.");
      return;
    }

    // Check if employee has enough leave balance
    const balance = currentUser.leaveBalance[leaveType as keyof typeof currentUser.leaveBalance];
    if (balance) {
      const available = balance.total - balance.used;
      if (duration > available) {
        setFormError(`Insufficient balance for ${leaveType}. Available balance: ${available} days.`);
        return;
      }
    }

    onSubmit({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      leaveType,
      startDate,
      endDate,
      duration,
      approver,
      reason,
      contactDuringLeave: contact || "+1 (555) 000-0000",
      attachment,
    });
  };

  const isSickLeaveCertRequired = leaveType === "Sick Leave" && duration > 2;

  return (
    <div className="bg-slate-50/50 p-6 md:p-8 min-h-screen">
      {/* Back Button Headers */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onCancel}
          className="p-2 border border-slate-200 bg-white hover:bg-slate-100 rounded-xl transition-all cursor-pointer text-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426] tracking-tight">
            Request New Leave
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Fill in the details below to submit a time off request.
          </p>
        </div>
      </div>

      {formError && (
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm mb-6 flex items-start gap-3 shadow-sm animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Card 1: Employee Information */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 font-sans flex items-center gap-2">
            <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
            Employee Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee Name</label>
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium text-sm select-all">
                {currentUser.name}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee ID</label>
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium text-sm select-all">
                {currentUser.id}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</label>
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium text-sm">
                {currentUser.department}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Leave Details */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-2">
            <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
            Leave Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leave Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <select
                id="leave-type-select"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm font-medium shadow-sm cursor-pointer"
              >
                <option value="Annual Leave">Annual Leave (Vacation)</option>
                <option value="Sick Leave">Sick Leave (Medical/Family care)</option>
                <option value="Personal Leave">Personal Leave (Ad-hoc events)</option>
                <option value="Maternity Leave">Maternity Leave</option>
                <option value="Paternity Leave">Paternity Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>

            {/* Approver Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                Approver <span className="text-red-500">*</span>
              </label>
              <select
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm font-medium shadow-sm cursor-pointer"
              >
                <option value="Michael Scott (Direct Manager)">Michael Scott (Direct Manager)</option>
                <option value="HR Approvals Committee">HR Approvals Committee</option>
                <option value="Pam Beesly (Finance Lead)">Pam Beesly (Finance Lead)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm font-semibold shadow-sm cursor-pointer"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm font-semibold shadow-sm cursor-pointer"
                />
              </div>
            </div>

            {/* Total Duration Widget */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 flex flex-col justify-center items-center text-center h-[46px]">
              <p className="text-[10px] uppercase font-extrabold text-indigo-500 tracking-wider">Total Duration</p>
              <p className="text-sm font-bold text-indigo-700 font-sans mt-0.5">
                {duration} {duration === 1 ? "Day" : "Days"}
              </p>
            </div>
          </div>

          {/* Contact during leave */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Contact During Leave
            </label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Card 3: Reason for Leave */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-2">
            <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
            Reason for Leave <span className="text-red-500">*</span>
          </h2>
          <textarea
            rows={4}
            placeholder="Please provide details about your leave request..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm shadow-sm leading-relaxed"
          />
        </div>

        {/* Card 4: Supporting Documents */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans flex items-center gap-2">
              <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
              Supporting Documents
            </h2>
            {isSickLeaveCertRequired && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Required for Sick Leave &gt; 2 days</span>
              </div>
            )}
          </div>

          {/* Dotted Drag & Drop Container */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
              isDragOver
                ? "border-indigo-600 bg-indigo-50/20"
                : "border-slate-200 hover:border-slate-300 bg-slate-50/30"
            }`}
            onClick={() => document.getElementById("file-picker")?.click()}
          >
            <input
              id="file-picker"
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Drag and drop your files here</h3>
            <p className="text-xs text-indigo-600 font-semibold mt-1 hover:underline">
              or click to browse from your computer
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-2">
              Supported formats: JPG, PNG, PDF (Max 5MB)
            </p>
          </div>

          {/* Attachment Render list if exists */}
          {attachment && (
            <div className="border border-slate-100 rounded-xl p-3.5 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3.5 w-full max-w-[80%]">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <File className="w-5 h-5" />
                </div>
                <div className="w-full shrink">
                  <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                    {attachment.name}
                  </p>
                  
                  {attachment.isLoading ? (
                    <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center gap-3">
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-150"
                          style={{ width: `${attachment.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0">{attachment.progress}%</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      {attachment.size} • <span className="text-emerald-600 font-bold">Ready</span>
                    </p>
                  )}
                </div>
              </div>

              {!attachment.isLoading && (
                <button
                  type="button"
                  onClick={removeAttachment}
                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Buttons submission panel */}
        <div className="flex items-center justify-end gap-3.5 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-sm"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all hover:translate-y-[-1px] active:translate-y-[1px] cursor-pointer shadow-md shadow-indigo-100"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit Request</span>
          </button>
        </div>
      </form>
    </div>
  );
};
