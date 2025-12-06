import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import RestrictedRoute from "./RestrictedRoute";
import { useDispatch } from "react-redux";
import React, { Suspense, useEffect } from "react";
import { refreshUser } from "../features/auth/authOperations";
import { Oval } from "react-loader-spinner";

// Lazy-loaded Sayfalar
const LoginPage = React.lazy(() => import("../pages/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(() =>
  import("../pages/RegistrationPage/RegistrationPage")
);
const DashboardPage = React.lazy(() =>
  import("../pages/DashboardPage/DashboardPage")
);
const CurrencyPage = React.lazy(() =>
  import("../pages/CurrencyPage/CurrencyPage")
);
const NotFoundPage = React.lazy(() =>
  import("../pages/NotFoundPage/NotFoundPage")
);

// İçerik bileşenleri
const HomeTableLazy = React.lazy(() =>
  import("../components/HomeTable/HomeTable")
);
const StatisticsLazy = React.lazy(() =>
  import("../components/Statistics/Statistics")
);

const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <Oval
      height={80}
      width={80}
      color="var(--font-color-purple)"
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="var(--font-color-white-60)"
      strokeWidth={3}
      strokeWidthSecondary={3}
    />
  </div>
);

export default function AppRouter() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Login ve Register */}
          <Route
            path="/login"
            element={
              <RestrictedRoute>
                <LoginPage />
              </RestrictedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RestrictedRoute>
                <RegistrationPage />
              </RestrictedRoute>
            }
          />

          {/* Dashboard + Nested */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            <Route index element={<HomeTableLazy />} />
            <Route path="statistics" element={<StatisticsLazy />} />
            <Route path="currency" element={<CurrencyPage />} />
          </Route>

          {/* Diğer */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
