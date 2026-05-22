import { Employee, LeaveRequest, LeavePolicy } from "./types";

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "EMP-1042",
    name: "Alex Rivera",
    email: "alex.rivera@company.com",
    department: "Engineering",
    role: "Employee",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    leaveBalance: {
      "Annual Leave": { used: 8, total: 20 },
      "Sick Leave": { used: 3, total: 10 },
      "Personal Leave": { used: 1, total: 5 },
    },
  },
  {
    id: "EMP-2023-084",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@company.com",
    department: "Product Design",
    role: "Employee",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    leaveBalance: {
      "Annual Leave": { used: 4, total: 20 },
      "Sick Leave": { used: 2, total: 10 },
      "Personal Leave": { used: 2, total: 5 },
    },
  },
  {
    id: "EMP-ADMIN",
    name: "Michael Scott",
    email: "m.scott@company.com",
    department: "Human Resources",
    role: "Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
    leaveBalance: {
      "Annual Leave": { used: 2, total: 20 },
      "Sick Leave": { used: 1, total: 10 },
      "Personal Leave": { used: 0, total: 5 },
    },
  },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "REQ001",
    employeeId: "EMP-1042",
    employeeName: "Alex Rivera",
    department: "Engineering",
    leaveType: "Annual Leave",
    startDate: "2023-10-20",
    endDate: "2023-10-24",
    duration: 3,
    approver: "Michael Scott (Direct Manager)",
    reason: "Family autumn vacation trip to Japan.",
    contactDuringLeave: "+1 (555) 124-8899",
    status: "Approved",
    appliedDate: "2023-10-15",
  },
  {
    id: "REQ002",
    employeeId: "EMP-1042",
    employeeName: "Alex Rivera",
    department: "Engineering",
    leaveType: "Sick Leave",
    startDate: "2023-10-10",
    endDate: "2023-10-11",
    duration: 2,
    approver: "Michael Scott (Direct Manager)",
    reason: "Intense seasonal flu and fever, will rest at home.",
    contactDuringLeave: "+1 (555) 124-8899",
    status: "Pending",
    appliedDate: "2023-10-10",
    attachment: {
      name: "medical_certificate_v2.pdf",
      size: "1.2 MB",
    },
  },
  {
    id: "REQ003",
    employeeId: "EMP-1042",
    employeeName: "Alex Rivera",
    department: "Engineering",
    leaveType: "Personal Leave",
    startDate: "2023-09-12",
    endDate: "2023-09-12",
    duration: 1,
    approver: "Michael Scott (Direct Manager)",
    reason: "Urgent vehicle maintenance and DMV appointment.",
    contactDuringLeave: "+1 (555) 124-8899",
    status: "Rejected",
    appliedDate: "2023-09-05",
  },
  {
    id: "REQ004",
    employeeId: "EMP-2023-084",
    employeeName: "Sarah Jenkins",
    department: "Product Design",
    leaveType: "Annual Leave",
    startDate: "2023-10-12",
    endDate: "2023-10-15",
    duration: 4,
    approver: "Michael Scott (Direct Manager)",
    reason: "Attending design conference and workshop.",
    contactDuringLeave: "+1 (555) 000-0000",
    status: "Pending",
    appliedDate: "2023-10-11",
  },
  {
    id: "REQ005",
    employeeId: "EMP-105",
    employeeName: "Michael Chen",
    department: "Marketing",
    leaveType: "Sick Leave",
    startDate: "2023-10-10",
    endDate: "2023-10-10",
    duration: 0.5,
    approver: "Michael Scott (Direct Manager)",
    reason: "Morning dental surgery checkup.",
    contactDuringLeave: "+1 (555) 987-6543",
    status: "Approved",
    appliedDate: "2023-10-10",
  },
  {
    id: "REQ006",
    employeeId: "EMP-2023-084",
    employeeName: "Sarah Jenkins",
    department: "Product Design",
    leaveType: "Personal Leave",
    startDate: "2023-10-17",
    endDate: "2023-10-17",
    duration: 1,
    approver: "Michael Scott (Direct Manager)",
    reason: "Moving apartments, sorting out registry details.",
    contactDuringLeave: "+1 (555) 000-0000",
    status: "Pending",
    appliedDate: "2023-10-10",
  },
  {
    id: "REQ007",
    employeeId: "EMP-108",
    employeeName: "Emma Watson",
    department: "Human Resources",
    leaveType: "Annual Leave",
    startDate: "2023-11-20",
    endDate: "2023-11-24",
    duration: 5,
    approver: "Michael Scott (Direct Manager)",
    reason: "Thanksgiving week pre-vacation trip.",
    contactDuringLeave: "+1 (555) 234-5678",
    status: "Pending",
    appliedDate: "2023-10-21",
  }
];

export const POLICIES: LeavePolicy[] = [
  {
    id: "POL001",
    title: "Annual Leave Policy",
    description: "Guidelines and allowances for paid vacation days allocated annually.",
    details: [
      "All full-time employees are allocated 20 business days of paid Annual Leave per calendar year.",
      "Leave requests should be submitted at least 5 business days in advance when booking more than 3 consecutive days.",
      "A maximum of 5 unused annual leave days can be carried over to the next financial year.",
      "Approvals depend on team capacity and require direct manager signature."
    ]
  },
  {
    id: "POL002",
    title: "Sick Leave & Medical Certification",
    description: "Protocol for unplanned absences due to personal illness or medical appointments.",
    details: [
      "Employees are allocated 10 paid Sick Leave days per year.",
      "For sick leave exceeding 2 consecutive days, a valid physician's medical certificate or supporting document must be uploaded.",
      "Unused sick days do not accumulate or carry over to the next financial year.",
      "Immediate notification to the team via phone/Slack is expected before 9:30 AM."
    ]
  },
  {
    id: "POL003",
    title: "Maternity & Paternity Leave",
    description: "Support guidelines for new parents following child delivery or adoption.",
    details: [
      "Maternity leave covers 16 weeks of fully paid leave, starting up to 4 weeks prior to the expected delivery date.",
      "Paternity leave covers 4 consecutive weeks of fully paid time off within the first 6 months of childcare.",
      "Supporting official birth or adoption documentation is required for registration.",
      "Extension via unpaid parental leave is available subject to request discussions."
    ]
  },
  {
    id: "POL004",
    title: "Personal & Compassionate Leave",
    description: "Allowances for critical personal situations, bereavement, or sudden household emergencies.",
    details: [
      "Employees are entitled to 5 paid Personal / Compassionate Leave days annually.",
      "Used for family emergencies, relocation, close member bereavement, or crucial legal summonings.",
      "No advance booking is strictly required in emergency cases, but retrospective submission is expected within 48 hours."
    ]
  }
];

export const PUBLIC_HOLIDAYS_2023 = [
  { date: "2023-10-09", name: "Thanksgiving Holiday" },
  { date: "2023-11-23", name: "Thanksgiving Dinner" },
  { date: "2023-12-25", name: "Christmas Day" },
  { date: "2023-01-01", name: "New Year's Day" },
];
