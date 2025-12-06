import React from "react";
import { useDispatch } from "react-redux";
import { closeEditModal } from "../../../features/transactions/transactionsSlice";
import EditTransactionForm from "../EditTransactionForm/EditTransactionForm";

import styles from "./ModalEditTransaction.module.css";

const ModalEditTransaction = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeEditModal());
  };

  return (
    <div className={styles.editModalOverlay} onClick={handleClose}>
      <div
        className={styles.editModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.editModalCloseButton} onClick={handleClose}>
          &times;
        </button>

        <h2 className={styles.editModalTitle}>Edit Transaction</h2>

        <EditTransactionForm onSaveSuccess={handleClose} onClose={handleClose} />
      </div>
    </div>
  );
};

export default ModalEditTransaction;

