import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getTransactions,
  toggleModal,
} from "../../features/transactions/transactionsSlice";
import { getCategories } from "../../features/categories/categoriesSlice";

import TransactionsList from "../../components/Transactions/TransactionsList/TransactionsList";
import ModalAddTransaction from "../../components/Transactions/ModalAddTransaction/ModalAddTransaction";

import styles from "./HomeTable.module.css";

export default function DashboardPage() {
  const dispatch = useDispatch();

  const isModalOpen = useSelector((state) => state.transactions?.isModalOpen);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getCategories());
      await dispatch(getTransactions());
    };
    loadData();
  }, [dispatch]);

  const handleOpenModal = () => dispatch(toggleModal(true));

  return (
    <>
      {isModalOpen && <ModalAddTransaction />}

      <div className={styles.dashboardLayout}>
        <TransactionsList />
      </div>

      <button onClick={handleOpenModal} className={styles.fabButton}>
        +
      </button>
    </>
  );
}
