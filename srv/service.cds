using {ojt_employ} from '../db/data-model';

@path: 'employee'
@requires: 'authenticated-user'
service EmployeeService {
  entity Roles         as projection on ojt_employ.Roles;
  entity Departments   as projection on ojt_employ.Departments;
  entity Employees     as projection on ojt_employ.Employees;
  entity LeaveRequests as projection on ojt_employ.LeaveRequests;
  action   calculateSalary(employeeID : UUID)                 returns Decimal(10, 2);
  action   updateLeaveStatus(leaveID : UUID, status : String) returns String;

  function userInfo()                                         returns {
    id     : String;
    name   : String;
    email  : String;
    scopes : array of String;
  };
}
