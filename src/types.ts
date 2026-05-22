export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type LeaveType = "Annual Leave" | "Sick Leave" | "Personal Leave" | "Maternity Leave" | "Paternity Leave" | "Unpaid Leave";

export interface CustomFile {
  name: string;
  size: string;
  isLoading?: boolean;
  progress?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: number;
  approver: string;
  reason: string;
  contactDuringLeave: string;
  status: LeaveStatus;
  appliedDate: string;
  attachment?: CustomFile;
}

export interface LeaveBalance {
  used: number;
  total: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "Employee" | "Admin";
  avatar: string;
  leaveBalance: {
    "Annual Leave": LeaveBalance;
    "Sick Leave": LeaveBalance;
    "Personal Leave": LeaveBalance;
  };
}

export interface LeavePolicy {
  id: string;
  title: string;
  description: string;
  details: string[];
}
