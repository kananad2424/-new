import React, { useState, useEffect } from "react";
import { Employee, LeaveRequest, CustomFile, LeaveType } from "./types";
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS } from "./data";
import { LoginScreen } from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { EmployeeDashboard } from "./components/EmployeeDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { LeaveForm } from "./components/LeaveForm";
import { LeaveCalendarView } from "./components/LeaveCalendarView";
import { PolicyDocs } from "./components/PolicyDocs";
import { Reports } from "./components/Reports";
import { Settings } from "./components/Settings";
import { 
  Bell, 
  HelpCircle, 
  Info, 
  Check, 
  AlertCircle, 
  FileText, 
  User, 
  CornerDownRight, 
  X, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Send
} from "lucide-react";

export default function App() {
  // Global Persisted State initialization
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem("hr_leave_portal_employees");
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [allRequests, setAllRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem("hr_leave_portal_requests");
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem("hr_leave_portal_active_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const [selectedRequestDetail, setSelectedRequestDetail] = useState<LeaveRequest | null>(null);
  const [adminComment, setAdminComment] = useState("");
  
  // Toasts notifications queue
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [isHowToModalOpen, setIsHowToModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // AI Chatbot Helper state
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "bot"; text: string }[]>([
    { sender: "bot", text: "Sawadee ka! I am your HR Connect policy advisor. You can ask me about annual leave balances, carrying rules, or sick leave certification requirements!" }
  ]);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem("hr_leave_portal_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("hr_leave_portal_requests", JSON.stringify(allRequests));
  }, [allRequests]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("hr_leave_portal_active_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("hr_leave_portal_active_user");
    }
  }, [currentUser]);

  // Toast auto dismisser
  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLogin = (employee: Employee) => {
    setCurrentUser(employee);
    setActiveTab("dashboard");
    setIsApplyFormOpen(false);
    triggerToast(`Logged in successfully as ${employee.name}`, "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast("Logged out of session. Access terminated safety.", "info");
  };

  // Submit new leave request handler
  const handleApplyLeaveSubmit = (formData: Omit<LeaveRequest, "id" | "status" | "appliedDate"> & { attachment?: CustomFile }) => {
    const newRequest: LeaveRequest = {
      ...formData,
      id: "REQ" + String(allRequests.length + 101),
      status: "Pending",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    setAllRequests([newRequest, ...allRequests]);
    setIsApplyFormOpen(false);
    triggerToast("Leave request submitted successfully. Awaiting manager approval.", "success");
  };

  // Admin approval processing
  const handleApproveRequest = (requestId: string) => {
    // Find the request
    const request = allRequests.find((r) => r.id === requestId);
    if (!request) return;

    // Update request status
    setAllRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "Approved" } : r))
    );

    // Update corresponding employee leave balances (increase used days)
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) => {
        if (emp.id === request.employeeId) {
          const leaveType = request.leaveType;
          const currentTypeBalance = emp.leaveBalance[leaveType as keyof typeof emp.leaveBalance];
          
          if (currentTypeBalance) {
            return {
              ...emp,
              leaveBalance: {
                ...emp.leaveBalance,
                [leaveType]: {
                  ...currentTypeBalance,
                  used: Math.min(currentTypeBalance.total, currentTypeBalance.used + request.duration),
                },
              },
            };
          }
        }
        return emp;
      })
    );

    // If approved request is of currently logged in employee, sync their session data immediately!
    if (currentUser && currentUser.id === request.employeeId) {
      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        const leaveType = request.leaveType;
        const currentTypeBalance = prevUser.leaveBalance[leaveType as keyof typeof prevUser.leaveBalance];
        if (currentTypeBalance) {
          return {
            ...prevUser,
            leaveBalance: {
              ...prevUser.leaveBalance,
              [leaveType]: {
                ...currentTypeBalance,
                used: Math.min(currentTypeBalance.total, currentTypeBalance.used + request.duration),
              },
            },
          };
        }
        return prevUser;
      });
    }

    setSelectedRequestDetail(null);
    triggerToast(`Approved leave request ${requestId} for ${request.employeeName}`, "success");
  };

  // Admin rejection processing
  const handleRejectRequest = (requestId: string) => {
    const request = allRequests.find((r) => r.id === requestId);
    if (!request) return;

    setAllRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "Rejected" } : r))
    );

    setSelectedRequestDetail(null);
    triggerToast(`Rejected leave request ${requestId} for ${request.employeeName}`, "info");
  };

  const handleProfileUpdate = (updatedData: { name: string; email: string }) => {
    if (!currentUser) return;

    const nextUser = { ...currentUser, ...updatedData };
    setCurrentUser(nextUser);

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === currentUser.id ? { ...emp, ...updatedData } : emp))
    );
  };

  // AI Chat Bot Rule engine simulator
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage.trim();
    const nextHistory = [...chatHistory, { sender: "user" as const, text: userText }];
    setChatHistory(nextHistory);
    setChatMessage("");

    // Simulate thinking then generate matching standard answers
    setTimeout(() => {
      let reply = "I apologize, but I am still indexing that policy document. For critical questions, please check standard rules in the 'Policy Documents' directory tab.";
      const query = userText.toLowerCase();

      if (query.includes("annual") || query.includes("vacation") || query.includes("holiday days")) {
        reply = "Under company codes, all full-time employees are allocated 20 business days of paid Annual Leave. You can carry over a maximum of 5 unused days into next financial year. Requests of over 3 days must be booked 5 days in advance!";
      } else if (query.includes("sick") || query.includes("medical") || query.includes("doctor")) {
        reply = "You receive 10 paid Sick Leave days annually. Please note that if your sick leave covers more than 2 consecutive days, you are strictly required to upload a valid physician's certificate in the supporting documents uploader!";
      } else if (query.includes("maternity") || query.includes("baby") || query.includes("pregnant") || query.includes("paternity")) {
        reply = "Maternity leave covers 16 weeks of fully paid leave, starting up to 4 weeks prior to child delivery. Paternity leave covers 4 consecutive weeks of fully paid time off within first 6 months of delivery.";
      } else if (query.includes("personal") || query.includes("compassionate") || query.includes("emergency")) {
        reply = "You have 5 paid Personal / Compassionate Leave days per calendar year. No advance booking is strictly required during emergencies, but please notify team on phone or Slack before 9:30 AM.";
      } else if (query.includes("thai") || query.includes("ภาษาไทย") || query.includes("ระบบ")) {
        reply = "สวัสดีค่ะ! ระบบจัดการใบลา HR Connect รองรับกฎเกณฑ์ใบลาพักร้อน 20 วัน ลาป่วยได้ 10 วันต่อปี หากลาป่วยต่อเนื่องเกิน 2 วัน จำเป็นต้องอัปโหลดใบรับรองแพทย์ในระบบด้วยนะคะ!";
      }

      setChatHistory([...nextHistory, { sender: "bot", text: reply }]);
    }, 450);
  };

  // Layout Render selector
  const renderTabContent = () => {
    if (!currentUser) return null;

    if (isApplyFormOpen) {
      return (
        <LeaveForm
          currentUser={currentUser}
          onCancel={() => setIsApplyFormOpen(false)}
          onSubmit={handleApplyLeaveSubmit}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return currentUser.role === "Admin" ? (
          <AdminDashboard
            currentUser={currentUser}
            allRequests={allRequests}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onViewRequestDetails={(req) => setSelectedRequestDetail(req)}
            onExportReport={() => triggerToast("Report exported successfully as CSV/PDF spreadsheet file.", "success")}
          />
        ) : (
          <EmployeeDashboard
            currentUser={currentUser}
            myRequests={allRequests.filter((r) => r.employeeId === currentUser.id)}
            onApplyLeaveClick={() => setIsApplyFormOpen(true)}
            onViewRequestDetails={(req) => setSelectedRequestDetail(req)}
          />
        );
      case "requests":
        return currentUser.role === "Admin" ? (
          <AdminDashboard
            currentUser={currentUser}
            allRequests={allRequests}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onViewRequestDetails={(req) => setSelectedRequestDetail(req)}
            onExportReport={() => triggerToast("Report exported successfully as CSV/PDF spreadsheet file.", "success")}
          />
        ) : (
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-extrabold text-[#091426] tracking-tight">Interactive Claim Logs</h1>
                <p className="text-xs text-slate-500 font-semibold">Track approvals and historical leave applications.</p>
              </div>
              <button
                onClick={() => setIsApplyFormOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Apply Leave
              </button>
            </div>
            <EmployeeDashboard
              currentUser={currentUser}
              myRequests={allRequests.filter((r) => r.employeeId === currentUser.id)}
              onApplyLeaveClick={() => setIsApplyFormOpen(true)}
              onViewRequestDetails={(req) => setSelectedRequestDetail(req)}
            />
          </div>
        );
      case "calendar":
        return (
          <LeaveCalendarView
            currentUser={currentUser}
            allRequests={allRequests}
            onApplyLeaveClick={() => setIsApplyFormOpen(true)}
          />
        );
      case "policies":
        return <PolicyDocs />;
      case "reports":
        return <Reports allRequests={allRequests} />;
      case "settings":
        return <Settings currentUser={currentUser} onUpdateProfile={handleProfileUpdate} />;
      default:
        return (
          <div className="p-8 text-center text-slate-500 font-semibold">
            Under Maintenance
          </div>
        );
    }
  };

  // If user is not logged in: render login screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} employees={employees} />;
  }

  // Pending Actions Count for Admin Highlight
  const pendingActionsCount = allRequests.filter((r) => r.status === "Pending").length;

  return (
    <div id="app-root-frame" className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar Panel Left */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsApplyFormOpen(false);
          setActiveTab(tab);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container Right */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative bg-slate-50">
        
        {/* Global Toolbar Header Bar */}
        <header className="h-16 border-b border-slate-200/55 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs/10">
          <div>
            <span className="text-xs font-bold text-slate-400">Sandbox Client Environment</span>
          </div>

          {/* Action Icons right */}
          <div className="flex items-center gap-4">
            
            {/* Quick How-To button */}
            <button
              onClick={() => setIsHowToModalOpen(true)}
              className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-[#4b41e1] transition-all relative cursor-pointer"
              title="How to test"
            >
              <HelpCircle className="w-5 h-5 text-slate-400" />
            </button>

            {/* AI Policy Assistant Trigger icon */}
            <button
              onClick={() => setIsAIChatOpen(!isAIChatOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[#4b41e1] rounded-xl text-xs font-bold transition-all cursor-pointer relative"
              title="HR AI chatbot"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-650" />
              <span>Ask HR AI</span>
              {isAIChatOpen && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />}
            </button>

            {/* Notifications panel toggle */}
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-[#4b41e1] transition-all relative cursor-pointer font-bold"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-400" />
              {pendingActionsCount > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-650 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {pendingActionsCount}
                </span>
              )}
            </button>

            <span className="h-4 w-px bg-slate-200" />

            {/* User Profile display pill */}
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block text-left select-none">
                <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[9px] text-[#4b41e1] font-bold tracking-widest uppercase mt-0.5">{currentUser.role === "Admin" ? "HR Admin" : currentUser.id}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Tabs Wrapper container */}
        <div className="flex-1 pb-12">
          {renderTabContent()}
        </div>

        {/* Floating notifications block if open */}
        {isNotificationOpen && (
          <div className="absolute right-6 top-18 w-80 bg-white border border-slate-150 rounded-2xl shadow-xl p-4 z-45 animate-scale-up space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-indigo-600" /> Live Notifications
              </h4>
              <button onClick={() => setIsNotificationOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar text-xs">
              {currentUser.role === "Admin" ? (
                pendingActionsCount > 0 ? (
                  <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xl leading-relaxed text-slate-700">
                    <p className="font-bold">Pending Review Claims</p>
                    <p className="text-[10px] text-slate-500 mt-1">There are {pendingActionsCount} leave applications awaiting processing in your needs action queue.</p>
                  </div>
                ) : (
                  <p className="text-center py-4 text-slate-400 font-semibold text-[11px]">All notifications processed. Inbox is clean!</p>
                )
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 bg-emerald-50/55 border border-emerald-100 rounded-xl leading-relaxed text-slate-700">
                    <p className="font-bold text-emerald-950">Annual leave request approved</p>
                    <p className="text-[10px] text-emerald-700 mt-1">Your request for Japan Trip (3 days) has been successfully approved by Michael Scott!</p>
                  </div>
                  <div className="p-2.5 bg-indigo-50/55 border border-indigo-100 rounded-xl leading-relaxed text-slate-700">
                    <p className="font-bold text-indigo-950">Sick leave processing</p>
                    <p className="text-[10px] text-indigo-700 mt-1">Your Sick Leave (2 days) is currently in review. No action needed.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interactive Claim Details Detail Modal */}
        {selectedRequestDetail && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-text">
            <div className="bg-white border text-left border-slate-100 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-[#4b41e1]">Leave Application Review</span>
                  <h2 className="text-lg font-extrabold text-[#091426] tracking-tight">{selectedRequestDetail.leaveType}</h2>
                </div>
                <button
                  onClick={() => setSelectedRequestDetail(null)}
                  className="p-1 text-slate-425 hover:text-slate-650 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body details */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs no-scrollbar">
                
                {/* Section 1: Employee metadata */}
                <div className="flex items-center gap-3.5 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm flex justify-center items-center shrink-0 border border-indigo-200">
                    {selectedRequestDetail.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{selectedRequestDetail.employeeName}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">ID: {selectedRequestDetail.employeeId} • Dept: {selectedRequestDetail.department}</p>
                  </div>
                </div>

                {/* Section 2: Date Grid metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-semibold">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">Duration Periods</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      {selectedRequestDetail.startDate} — {selectedRequestDetail.endDate}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      {selectedRequestDetail.duration} {selectedRequestDetail.duration === 1 ? "Day" : "Days"} total
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-semibold">
                    <p className="text-[9px] uppercase tracking-wider text-slate-400">Application Status</p>
                    <div className="mt-1 flex items-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg leading-none ${
                          selectedRequestDetail.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                            : selectedRequestDetail.status === "Rejected"
                            ? "bg-red-50 text-red-700 border border-red-200/50"
                            : "bg-amber-50 text-amber-700 border border-amber-200/50 animate-pulse"
                        }`}
                      >
                        {selectedRequestDetail.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Applied: {selectedRequestDetail.appliedDate}</p>
                  </div>
                </div>

                {/* Section 3: Reason text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-405 uppercase tracking-wider block">Reason For Leave Request</label>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-semibold leading-relaxed">
                    {selectedRequestDetail.reason}
                  </div>
                </div>

                {/* Section 4: Contact info */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-405 uppercase tracking-wider block">Emergency Contacts</label>
                  <p className="text-xs font-bold text-slate-750">{selectedRequestDetail.contactDuringLeave}</p>
                </div>

                {/* Section 5: Documents uploader display */}
                {selectedRequestDetail.attachment && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-405 uppercase tracking-wider block">Supporting Attachments</label>
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-normal">{selectedRequestDetail.attachment.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{selectedRequestDetail.attachment.size} • Security Verified</p>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          triggerToast("Document preview loaded successfully.", "success");
                        }}
                        className="text-xs font-bold text-[#4b41e1] hover:underline"
                      >
                        View cert
                      </a>
                    </div>
                  </div>
                )}

                {/* Decision input space for Admin */}
                {currentUser.role === "Admin" && selectedRequestDetail.status === "Pending" && (
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-extrabold text-slate-405 uppercase tracking-wider block">Decision Comment (Optional)</label>
                    <textarea
                      rows={2}
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      placeholder="e.g. Approved under regional capacity conditions..."
                      className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs shadow-sm leading-relaxed"
                    />
                  </div>
                )}
              </div>

              {/* Process Buttons Footer panel */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setSelectedRequestDetail(null)}
                    className="px-5 py-2 hover:bg-slate-150 border rounded-xl text-slate-700 font-bold transition-all text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* Approvals if Admin User */}
                {currentUser.role === "Admin" && selectedRequestDetail.status === "Pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejectRequest(selectedRequestDetail.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-750 text-white font-bold rounded-xl text-xs transition-transform active:scale-95 cursor-pointer shadow-md shadow-red-100"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    
                    <button
                      onClick={() => handleApproveRequest(selectedRequestDetail.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-transform active:scale-95 cursor-pointer shadow-md shadow-indigo-100"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve Leave</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Global How-To Test Sandbox Modal */}
        {isHowToModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in select-text text-left">
            <div className="bg-white border border-slate-100 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-up space-y-4">
              <div className="flex items-start justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Sandbox Playground Guide</h3>
                </div>
                <button onClick={() => setIsHowToModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed font-semibold text-slate-600">
                <p>This system fully supports live interactive simulation of an HR portal:</p>
                
                <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 border">
                  <p className="text-indigo-800 font-extrabold uppercase text-[9px] tracking-wide">1. Role Switches</p>
                  <p className="text-[11px]">Logout anytime to return to the Login Page, where you can select <b>Alex Rivera</b>, <b>Sarah Jenkins</b> (Employees) or <b>Michael Scott</b> (HR Admin).</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 border">
                  <p className="text-indigo-800 font-extrabold uppercase text-[9px] tracking-wide">2. Live Submissions</p>
                  <p className="text-[11px]">As an employee, apply for leaves. See balances calculate dynamically, and supporting file uploads simulating smooth loading progress!</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 border">
                  <p className="text-indigo-805 font-extrabold uppercase text-[9px] tracking-wide">3. HR Approvals</p>
                  <p className="text-[11px]">Log in as Michael Scott, review the pending list, view the attachments, comment, and click <b>Approve</b> or <b>Reject</b>! The employee balances, tables, and calendars will update immediately!</p>
                </div>
              </div>

              <button
                onClick={() => setIsHowToModalOpen(false)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer text-center shadow-md shadow-indigo-100"
              >
                Let's Play
              </button>
            </div>
          </div>
        )}

        {/* Global Floating AI Chatbot Assistant panel */}
        {isAIChatOpen && (
          <div className="fixed bottom-6 right-6 w-80 bg-white border border-slate-100 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-scale-up h-96 border-b-4 border-b-indigo-600">
            {/* Header */}
            <div className="p-3.5 bg-indigo-600 text-white flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 fill-current" />
                <h3 className="font-extrabold text-xs">HR Connect AI Policy Mate</h3>
              </div>
              <button onClick={() => setIsAIChatOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chats messages layout */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto no-scrollbar text-[11px] bg-slate-50/50">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-2xl leading-normal font-semibold ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white border rounded-bl-none text-slate-800 shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input submission box */}
            <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-1.5 bg-white">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask e.g. sick leave docs..."
                className="flex-1 px-3 py-1.5 border border-slate-200 focus:outline-none focus:border-indigo-600 rounded-xl text-xs placeholder-slate-400"
              />
              <button
                type="submit"
                className="p-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer shrink-0 inline-flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Global Toast Alert Flash */}
        {toast && (
          <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white border border-slate-800 rounded-2xl px-4 py-3.5 shadow-2x shadow-slate-900/50 flex items-center gap-3 max-w-sm animate-slide-up">
            <div className={`p-1.5 rounded-lg shrink-0 ${
              toast.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-indigo-500/20 text-indigo-400"
            }`}>
              {toast.type === "success" ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />}
            </div>
            <p className="text-xs font-semibold leading-normal">{toast.message}</p>
          </div>
        )}

      </main>
    </div>
  );
}
