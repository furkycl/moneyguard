import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { RotatingLines } from "react-loader-spinner";

import {
  updateTransactionThunk,
  closeEditModal,
} from "../../../features/transactions/transactionsSlice";
import { showSuccess, showError, showCommentLimit } from "../../../utils/toast";
import selectStyles from "../../../utils/selectStyles";
import styles from "./EditTransactionForm.module.css";

const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(0.01, "Amount must be greater than 0.")
    .required("Amount is required."),
  transactionDate: Yup.date()
    .required("Date is required.")
    .max(new Date(), "Transaction date cannot be in the future."),
  categoryId: Yup.string().when("type", {
    is: (type) => type === "EXPENSE",
    then: () => Yup.string().required("Expense category is required."),
    otherwise: () => Yup.string().notRequired(),
  }),
  comment: Yup.string().max(30, "Comment cannot exceed 30 characters."),
  type: Yup.string().oneOf(["INCOME", "EXPENSE"]).required("Type is required."),
});

const EditTransactionForm = ({ onClose, onSaveSuccess }) => {
  const dispatch = useDispatch();
  const editingTransaction = useSelector(
    (state) => state.transactions.editingTransaction
  );
  const expenseCategories = useSelector(
    (state) => state.categories.expenseCategories
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      dispatch(closeEditModal());
    }
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getInitialValues = (tx) => {
    if (!tx)
      return {
        id: null,
        amount: "",
        transactionDate: new Date().toISOString().split("T")[0],
        type: "EXPENSE",
        categoryId: "",
        comment: "",
      };

    const type = tx.type?.toUpperCase() || "EXPENSE";
    const amount = Math.abs(tx.amount ?? tx.sum ?? "");
    const transactionDateStr = tx.transactionDate
      ? new Date(tx.transactionDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    const initialCategoryId =
      tx.categoryId && type === "EXPENSE" ? String(tx.categoryId) : "";

    return {
      id: tx.id,
      amount,
      transactionDate: transactionDateStr,
      type,
      categoryId: initialCategoryId,
      comment: tx.comment || "",
    };
  };

  const categoryOptions = useMemo(
    () =>
      (expenseCategories || []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [expenseCategories]
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const finalAmount =
        values.type === "EXPENSE"
          ? -Math.abs(Number(values.amount))
          : Math.abs(Number(values.amount));
      if (values.type === "EXPENSE" && !values.categoryId) {
        showError("Expense category is required.");
        setSubmitting(false);
        setIsLoading(false);
        return;
      }

      const payload = {
        id: values.id,
        amount: finalAmount,
        transactionDate: values.transactionDate,
        type: values.type,
        comment: values.comment,
        categoryId:
          values.type === "EXPENSE" ? String(values.categoryId) : null,
      };

      const resultAction = await dispatch(updateTransactionThunk(payload));
      if (updateTransactionThunk.fulfilled.match(resultAction)) {
        showSuccess("Transaction updated successfully");
        if (onSaveSuccess) {
          onSaveSuccess();
        } else {
          handleClose();
        }
      } else {
        showError("An error occurred while updating");
      }
    } catch (error) {
      console.error("Update error:", error);
      showError("Unexpected error");
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (!editingTransaction) {
    return <div className={styles.editFormLoadingMessage}>No transaction to edit.</div>;
  }

  return (
    <div className={styles.content}>
      <Formik
        initialValues={getInitialValues(editingTransaction)}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const today = new Date();
          return (
            <Form className={styles.editForm}>
              <div className={styles.typeTitleGroup}>
                <p
                  className={
                    values.type === "INCOME"
                      ? styles.incomeActive
                      : styles.typeInactive
                  }
                >
                  Income
                </p>
                <span className={styles.typeSeparator}>/</span>
                <p
                  className={
                    values.type === "EXPENSE"
                      ? styles.expenseActive
                      : styles.typeInactive
                  }
                >
                  Expense
                </p>
              </div>

              {values.type === "EXPENSE" && (
                <div className={styles.editFormGroup}>
                  <label className="select-category-txt">Select a category</label>
                  <Select
                    instanceId="edit-category-select"
                    name="categoryId"
                    options={categoryOptions}
                    value={
                      values.categoryId
                        ? categoryOptions.find(
                            (o) => o.value === values.categoryId
                          ) || null
                        : null
                    }
                    onChange={(opt) =>
                      setFieldValue("categoryId", opt ? String(opt.value) : "")
                    }
                    placeholder="Select a category"
                    menuPortalTarget={
                      typeof document !== "undefined" ? document.body : null
                    }
                    styles={selectStyles}
                    classNamePrefix="rs"
                  />
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className={styles.editFormError}
                  />
                </div>
              )}

              <div className={styles.editFormAmountDateGroup}>
                <div className={styles.editFormGroup}>
                  <Field
                    type="text"
                    name="amount"
                    inputMode="decimal"
                    placeholder="Amount"
                    className={styles.editFormInput}
                    onKeyDown={(e) =>
                      ["-", "+", "e"].includes(e.key) && e.preventDefault()
                    }
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className={styles.editFormError}
                  />
                </div>

                <div className={styles.editFormGroupDate}>
                  <DatePicker
                    selected={
                      values.transactionDate
                        ? new Date(values.transactionDate)
                        : null
                    }
                    onChange={(date) =>
                      setFieldValue(
                        "transactionDate",
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    dateFormat="dd.MM.yyyy"
                    maxDate={today}
                    placeholderText="Date"
                    className={`${styles.editFormInput} ${styles.editFormDateInput}`}
                    calendarClassName={styles.calendar}
                  />
                  <svg
                    className={styles.calendarIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1.5A1.5 1.5 0 0 1 16 2.5v11A1.5 1.5 0 0 1 14.5 15h-13A1.5 1.5 0 0 1 0 13.5v-11A1.5 1.5 0 0 1 1.5 1H3V.5a.5.5 0 0 1 .5-.5zM1 4v9.5a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 .5-.5V4H1z" />
                  </svg>
                </div>
              </div>

              <div className={styles.editFormGroup}>
                <Field
                  as="textarea"
                  name="comment"
                  placeholder="Comment"
                  className={styles.editFormInput}
                  rows="2"
                  value={values.comment}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 30) {
                      setFieldValue("comment", val);
                    } else {
                      showCommentLimit();
                    }
                  }}
                />
                <div className={styles.commentCounter}>
                  {values.comment.length}/30
                </div>
                <ErrorMessage
                  name="comment"
                  component="div"
                  className={styles.editFormError}
                />
              </div>

              <div className={styles.editFormButtonGroup}>
                <button
                  type="submit"
                  className={`${styles.editFormSaveButton} form-button`}
                  disabled={isSubmitting || isLoading}
                  aria-busy={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <RotatingLines
                      width="20"
                      strokeColor="#fff"
                      strokeWidth="3"
                      animationDuration="0.75"
                      ariaLabel="saving"
                    />
                  ) : (
                    "SAVE"
                  )}
                </button>
                <button
                  type="button"
                  className={`${styles.editFormCancelButton} form-button-register`}
                  onClick={handleClose}
                  disabled={isSubmitting || isLoading}
                >
                  CANCEL
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default EditTransactionForm;
