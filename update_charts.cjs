const fs = require('fs');

const dashboardPath = 'c:/Users/farha/OneDrive/Desktop/UPCODE INTERSHIP/Expense-Manger/expense-manager/frontend/src/pages/Dashboard.jsx';
let dashboard = fs.readFileSync(dashboardPath, 'utf8');
dashboard = dashboard.replace(/const COLORS = \[.*?\];/, `const COLORS = ['#0F9D7A', '#073B36', '#DDF6F0', '#20B38F', '#0B4E48', '#BEECE1', '#042A27', '#F5A623'];`);
dashboard = dashboard.replace(/fill="#4CAF50"/g, 'fill="#0F9D7A"');
dashboard = dashboard.replace(/fill="#1A1A1A"/g, 'fill="#073B36"');
dashboard = dashboard.replace(/stroke="#1A1A1A"/g, 'stroke="#0F9D7A"');
dashboard = dashboard.replace(/dot=\{\{ fill: '#1A1A1A',/g, "dot={{ fill: '#0F9D7A',");
fs.writeFileSync(dashboardPath, dashboard, 'utf8');

const reportsPath = 'c:/Users/farha/OneDrive/Desktop/UPCODE INTERSHIP/Expense-Manger/expense-manager/frontend/src/pages/Reports.jsx';
let reports = fs.readFileSync(reportsPath, 'utf8');
reports = reports.replace(/const COLORS = \[.*?\];/, `const COLORS = ['#0F9D7A', '#073B36', '#DDF6F0', '#20B38F', '#0B4E48', '#BEECE1', '#042A27', '#F5A623'];`);
reports = reports.replace(/fill="#4CAF50"/g, 'fill="#0F9D7A"');
reports = reports.replace(/fill="#1A1A1A"/g, 'fill="#073B36"');
reports = reports.replace(/stroke="#1A1A1A"/g, 'stroke="#0F9D7A"');
fs.writeFileSync(reportsPath, reports, 'utf8');

const adminPath = 'c:/Users/farha/OneDrive/Desktop/UPCODE INTERSHIP/Expense-Manger/expense-manager/frontend/src/pages/Admin.jsx';
let admin = fs.readFileSync(adminPath, 'utf8');
admin = admin.replace(/const COLORS = \[.*?\];/, `const COLORS = ['#0F9D7A', '#073B36', '#DDF6F0', '#20B38F', '#0B4E48', '#BEECE1'];`);
fs.writeFileSync(adminPath, admin, 'utf8');

console.log('Charts updated successfully!');
