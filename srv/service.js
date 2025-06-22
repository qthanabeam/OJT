const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
  const { Employees, Roles, LeaveRequests } = this.entities;

  // Calculate years of service
  const getYearsOfService = (hireDate) => {
    const today = new Date();
    const hire = new Date(hireDate);
    return Math.floor((today - hire) / (1000 * 60 * 60 * 24 * 365));
  };

  // Calculate salary
  this.on('calculateSalary', async (req) => {
    const { employeeID } = req.data;
    const employee = await SELECT.one.from(Employees).where({ ID: employeeID }).columns('*', { role: { '*' } });
    if (!employee) req.error(404, 'Employee not found');

    const yearsOfService = getYearsOfService(employee.hireDate);
    const baseSalary = employee.role.baseSalary || 0;
    const allowance = employee.role.allowance || 0;
    const serviceBonus = yearsOfService * 1000;
    const performanceBonus = (employee.performanceRating || 1) * 500;

    const totalSalary = baseSalary + allowance + serviceBonus + performanceBonus;

    await UPDATE(Employees).set({ salary: totalSalary }).where({ ID: employeeID });
    return totalSalary;
  });

  // Restrict access based on roles
  this.before(['CREATE', 'UPDATE', 'DELETE'], [Employees, LeaveRequests], async (req) => {
    const user = req.user;
    if (!user.is('Admin')) {
      req.error(403, 'Admin role required for this operation');
    }
  });

  // Restrict LeaveRequests updates to Admins
  this.before('UPDATE', LeaveRequests, async (req) => {
    const user = req.user;
    if (!user.is('Admin')) {
      req.error(403, 'Only Admins can approve/reject leave requests');
    }
  });
});