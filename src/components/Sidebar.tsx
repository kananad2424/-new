import React from "react";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Sliders
} from "lucide-react";
import { Employee } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: Employee;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
}) => {
  const isHRAdmin = currentUser.role === "Admin";

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "requests", label: isHRAdmin ? "All Requests" : "My Requests", icon: FileText },
    { id: "calendar", label: "Leave Calendar", icon: Calendar },
    { id: "team", label: "Team Management", icon: Users, adminOnly: true },
    { id: "policies", label: "Policy Documents", icon: BookOpen },
    { id: "reports", label: "Reports", icon: BarChart3 }
  ];

  return (
    <aside id="sidebar-panel" className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand/Logo Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-100">
              HR
            </div>
            <div>
              <h2 className="font-extrabold text-[#091426] text-base leading-tight">
                {isHRAdmin ? "HR Portal" : "SCPT festival"}
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Management System</p>
            </div>
          </div>
        </div>

        {/* User Info Quick Badge */}
        <div className="p-4 mx-3 my-4 bg-white border border-slate-100 rounded-xl flex items-center gap-3 shadow-sm">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div className="truncate">
            <h4 className="font-bold text-slate-800 text-xs truncate leading-tight">
              {currentUser.name}
            </h4>
            <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.5 font-bold tracking-wider rounded bg-indigo-50 text-indigo-700 uppercase">
              {currentUser.role === "Admin" ? "HR Manager" : currentUser.id}
            </span>
          </div>
        </div>

        {/* Navigation Menus */}
        <nav className="px-3 space-y-1">
          {mainNavItems.map((item) => {
            // Hide adminOnly items from regular users
            if (item.adminOnly && !isHRAdmin) return null;

            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? "bg-indigo-50/75 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                      isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {/* Right side colored active bar indicator */}
                {isActive && (
                  <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Nav Settings & Logout */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-1">
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-indigo-50/75 text-indigo-700"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
