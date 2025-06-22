using { Currency, managed, cuid } from '@sap/cds/common';

namespace employee.management;

entity Roles : cuid, managed {
  name : String(100) @title: 'Tên Vai Trò';
  baseSalary : Decimal(15,2) @title: 'Lương Cơ Bản';
  allowance : Decimal(15,2) @title: 'Phụ Cấp' default 0;
  employees : Association to many Employees on employees.role = $self;
}

entity Departments : cuid, managed {
  name : String(100) @title: 'Tên Phòng Ban';
  employees : Association to many Employees on employees.department = $self;
}

entity Employees : cuid, managed {
  firstName : String(50) @title: 'Tên' @mandatory;
  lastName : String(50) @title: 'Họ' @mandatory;
  dateOfBirth : Date @title: 'Ngày Sinh';
  gender : String(10) @title: 'Giới Tính';
  email : String(100) @title: 'Email' @mandatory;
  hireDate : Date @title: 'Ngày Vào Làm' @mandatory;
  salary : Decimal(15,2) @title: 'Lương' @readonly;
  performanceRating : Integer @title: 'Xếp Hạng Hiệu Suất' default 3;
  
  // Associations
  role : Association to Roles @title: 'Vai Trò' @mandatory;
  department : Association to Departments @title: 'Phòng Ban' @mandatory;
  leaveRequests : Association to many LeaveRequests on leaveRequests.employee = $self;
}

entity LeaveRequests : cuid, managed {
  employee : Association to Employees @title: 'Nhân Viên' @mandatory;
  startDate : Date @title: 'Ngày Bắt Đầu' @mandatory;
  endDate : Date @title: 'Ngày Kết Thúc' @mandatory;
  status : String(20) @title: 'Trạng Thái' default 'Pending';
  reason : String(500) @title: 'Lý Do';
}

// Views for better data access
view EmployeeDetails as select from Employees {
  *,
  role.name as roleName,
  role.baseSalary,
  role.allowance,
  department.name as departmentName
};

// Annotations for UI
annotate Employees with {
  ID @title: 'ID';
  firstName @title: 'Tên';
  lastName @title: 'Họ';
};

annotate Roles with {
  ID @title: 'ID';
  name @title: 'Tên Vai Trò';
  baseSalary @title: 'Lương Cơ Bản';
};

annotate Departments with {
  ID @title: 'ID';
  name @title: 'Tên Phòng Ban';
};