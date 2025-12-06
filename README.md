# MoneyGuard

MoneyGuard is a personal finance web application that helps you track income and expenses, stay on top of your balance, and review monthly statistics.

Live demo: https://aurora-fintech.github.io/moneyguard/  
Backend API: https://wallet.b.goit.study/  
Upstream repo: https://github.com/Aurora-Fintech/moneyguard

## Features
- Authentication with JWT (register, login, refresh, logout)
- Dashboard with balance, recent transactions, and currency/crypto widgets
- Add, edit, and delete income/expense transactions with categories
- Monthly statistics with donut chart and category table
- Currency rates (USD/TRY, EUR/TRY) with trends and crypto sparkline
- Redux Persist keeps the session after refresh

## Tech Stack
- React + Vite
- React Router, Redux Toolkit, Redux Persist
- Formik, Yup, react-hook-form, react-select, react-datepicker
- Chart.js / react-chartjs-2, Recharts
- Axios for API calls
- CSS Modules + Normalize.css
