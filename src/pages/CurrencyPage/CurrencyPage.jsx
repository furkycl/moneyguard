import React from "react";
import CurrencyTab from "../../components/CurrencyTab/CurrencyTab.jsx";
import CurrencyAreaChart from "../../components/CurrencyAreaChart/CurrencyAreaChart.jsx";
import CryptoChart from "../../components/CryptoChart/CryptoChart.jsx";
import styles from "./CurrencyPage.module.css";

const CurrencyPage = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Currency</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <CurrencyTab />
        </div>
        <div className={styles.card}>
          <CurrencyAreaChart />
        </div>
        <div className={styles.card}>
          <CryptoChart />
        </div>
      </div>
    </div>
  );
};

export default CurrencyPage;
