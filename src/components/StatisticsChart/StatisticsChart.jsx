import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { selectStatisticsSummary } from "../../features/transactions/transactionsSelector";
import styles from "./StatisticsChart.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(Number.isFinite(amount) ? amount : 0);
};

const CHART_COLORS = [
  "#36A2EB",
  "#FF6384",
  "#FF9F40",
  "#FFCD56",
  "#4BC0C0",
  "#9966FF",
  "#C9CBCF",
  "#3366CC",
  "#DC3912",
  "#FF9900",
  "#109618",
];

const StatisticsChart = () => {
  const { categoriesSummary, balanceAfter } = useSelector(
    selectStatisticsSummary
  );
  const chartDataArray = categoriesSummary;

  if (!chartDataArray || chartDataArray.length === 0) {
    return <div className={styles.chartContainer}> </div>;
  }

  const chartData = {
    labels: chartDataArray.map((item) => item.name),
    datasets: [
      {
        data: chartDataArray.map((item) => Math.abs(item.total)),
        backgroundColor: chartDataArray.map(
          (_, index) => CHART_COLORS[index % CHART_COLORS.length]
        ),
        borderColor: "transparent",
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const currentValue = context.parsed;
              const percentage = ((currentValue / total) * 100).toFixed(2);
              label += `${formatCurrency(currentValue)} (${percentage}%)`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className={styles.doughnutWrapper}>
      <Doughnut data={chartData} options={options} />
      <div className={styles.centerText}>
        <p className={styles.totalAmount}>{formatCurrency(balanceAfter)}</p>
      </div>
    </div>
  );
};

export default StatisticsChart;
