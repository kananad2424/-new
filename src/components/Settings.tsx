import React, { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, Lock, Smartphone, Save, Check } from "lucide-react";
import { Employee } from "../types";

interface SettingsProps {
  currentUser: Employee;
  onUpdateProfile: (updatedData: { email: string; name: string }) => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentUser, onUpdateProfile }) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [lang, setLang] = useState("EN");
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, email });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 select-text max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#091426] tracking-tight">
          System Settings
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Configure profile settings, regional configurations, security credentials, and system notifications.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl p-4 text-xs font-semibold flex items-center gap-3.5 shadow-sm animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600" />
          <span>Profile configuration saved successfully. Your session profile is updated!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Navigation Categories */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-1">
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold bg-indigo-50/50 border-r-2 border-indigo-600 text-indigo-700">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Profile Information</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-605 hover:bg-slate-50 transition-colors">
            <Bell className="w-4 h-4 text-slate-400" />
            <span>Notification Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-605 hover:bg-slate-50 transition-colors">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Security & Data Privacy</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-605 hover:bg-slate-50 transition-colors">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Password Credentials</span>
          </button>
        </div>

        {/* Configurations Form Block */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-405 uppercase tracking-wide border-b pb-2">Profile Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm shadow-sm font-semibold"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Official Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm shadow-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Employee ID</label>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-sm font-semibold">
                    {currentUser.id}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Company Department</label>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-sm font-semibold">
                    {currentUser.department}
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Rules */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-405 uppercase tracking-wide border-b pb-2">Regional Configurations</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Preferred Timezone/Language</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-850 focus:outline-none focus:border-indigo-600 text-sm shadow-sm cursor-pointer"
                >
                  <option value="EN">English (US corporate standards)</option>
                  <option value="TH">ไทย (ท้องถิ่นภูมิภาคประเทศไทย)</option>
                </select>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-405 uppercase tracking-wide border-b pb-2">Notification Modes</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <div className="text-xs font-semibold text-slate-700">
                    <p>Receive email notification logs</p>
                    <p className="text-[10px] text-slate-400 font-medium">Sends an inbox confirmation trigger whenever claim updates or approvals occur.</p>
                  </div>
                </label>

                <label className="flex items-center gap-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifPush}
                    onChange={(e) => setNotifPush(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <div className="text-xs font-semibold text-slate-700">
                    <p>Enable system pushes and toasts</p>
                    <p className="text-[10px] text-slate-400 font-medium">Show live banner notifications inside browser.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all hover:translate-y-[-1px] active:translate-y-[1px] cursor-pointer shadow-md shadow-indigo-100"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
