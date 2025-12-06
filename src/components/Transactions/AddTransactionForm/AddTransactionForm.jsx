import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { RotatingLines } from "react-loader-spinner";

import { getCategories } from "../../../features/categories/categoriesSlice";
import { addNewTransaction } from "../../../features/transactions/transactionsSlice";

import styles from "./AddTransactionForm.module.css";

import { showSuccess, showError, showCommentLimit } from "../../../utils/toast";
import selectStyles from "../../../utils/selectStyles";

const validationSchema = Yup.object().shape({
  sum: Yup.number()
    .typeError("The amount must be a valid number.")
    .positive("The amount must be positive.")
    .required("Amount is required."),
  date: Yup.date().required("Date is required."),
  category: Yup.mixed().when("$isIncome", {
    is: false,
    then: (s) => s.required("Expense category is required."),
    otherwise: (s) => s.notRequired(),
  }),
  comment: Yup.string().max(30, "Comment cannot exceed 30 characters."),
});

const AddTransactionForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const { incomeCategories, expenseCategories } = useSelector(
    (state) => state.categories
  );

  const [isIncome, setIsIncome] = useState(true);
  const datePickerRef = useRef(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const toggleSwitch = () => setIsIncome((p) => !p);

  const categoriesToShow = isIncome ? incomeCategories : expenseCategories;
  const options = useMemo(
    () =>
      (categoriesToShow || []).map((c) => ({
        value: c.id,
        label: c.name,
      })),
    [categoriesToShow]
  );

  const maxDate = new Date();

  return (
    <div className={styles.content}>
      <h2 className={`${styles.title} transaction-header`}>Add transaction</h2>

      <div className={styles.switchWrapper}>
        <span
          className={styles.switchText}
          style={{
            color: isIncome ? "var(--yellow)" : "var(--font-color-white)",
          }}
        >
          Income
        </span>
        <div className={styles.switchBackground} onClick={toggleSwitch}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSwitch();
            }}
            className={`${styles.switchButton} ${
              isIncome ? styles.income : styles.expense
            }`}
          >
            {isIncome ? "+" : "-"}
          </button>
        </div>
        <span
          className={styles.switchText}
          style={{
            color: !isIncome ? "var(--red)" : "var(--font-color-white)",
          }}
        >
          Expense
        </span>
      </div>

      <Formik
        initialValues={{
          category: null,
          sum: "",
          date: new Date(),
          comment: "",
        }}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange={false}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            const amount = isIncome
              ? parseFloat(values.sum)
              : -Math.abs(parseFloat(values.sum));

            const categoryId = isIncome
              ? incomeCategories?.[0]?.id || null
              : values.category?.value || null;

            if (values.comment.length > 30) {
              showCommentLimit();
              setSubmitting(false);
              return;
            }

            const payload = {
              transactionDate: values.date.toISOString(),
              amount,
              categoryId,
              type: isIncome ? "INCOME" : "EXPENSE",
              comment: values.comment || "",
            };

            await dispatch(addNewTransaction(payload)).unwrap();
            showSuccess("Transaction added successfully");
            resetForm();
            onCancel?.();
          } catch (err) {
            console.error(err);
            showError(err?.message || "Transaction could not be added");
          } finally {
            setSubmitting(false);
          }
        }}
        context={{ isIncome }}
      >
        {({ values, setFieldValue, touched, errors, isSubmitting }) => (
          <Form className={styles.form}>
            {!isIncome && (
              <div className={styles.inputGroup}>
                <Select
                  instanceId="category-select"
                  name="category"
                  options={options}
                  value={values.category}
                  onChange={(opt) => setFieldValue("category", opt)}
                  placeholder="Select a category"
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                  styles={selectStyles}
                  classNamePrefix="rs"
                />
                {errors.category && (
                  <div className={styles.errorText}>{errors.category}</div>
                )}
              </div>
            )}

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <Field
                  name="sum"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  className={`${styles.input} ${
                    touched.sum && errors.sum ? styles.inputError : ""
                  }`}
                  onKeyDown={(e) =>
                    ["-", "+", "e"].includes(e.key) && e.preventDefault()
                  }
                />
                {touched.sum && errors.sum && (
                  <div className={styles.errorText}>{errors.sum}</div>
                )}
              </div>

              <div className={styles.inputGroup} style={{ position: "relative" }}>
                <DatePicker
                  ref={datePickerRef}
                  selected={values.date}
                  onChange={(date) => setFieldValue("date", date)}
                  dateFormat="dd.MM.yyyy"
                  maxDate={maxDate}
                  filterDate={(d) => d <= maxDate}
                  className={`${styles.input} ${
                    touched.date && errors.date ? styles.inputError : ""
                  }`}
                  calendarClassName={styles.calendar}
                />
                <svg
                  onClick={() => datePickerRef.current.setOpen(true)}
                  className={styles.calendarIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{ cursor: "pointer" }}
                >
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1.5A1.5 1.5 0 0 1 16 2.5v11A1.5 1.5 0 0 1 14.5 15h-13A1.5 1.5 0 0 1 0 13.5v-11A1.5 1.5 0 0 1 1.5 1H3V.5a.5.5 0 0 1 .5-.5zM1 4v9.5a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 .5-.5V4H1z" />
                </svg>
                {touched.date && errors.date && (
                  <div className={styles.errorText}>{errors.date}</div>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <Field
                as="textarea"
                name="comment"
                placeholder="Comment"
                className={styles.textarea}
                rows="2"
                value={values.comment}
                onChange={(e) => {
                  const val = e.target.value;
                  const MAX_LENGTH = 30;

                  if (val.length <= MAX_LENGTH) {
                    setFieldValue("comment", val);
                  } else {
                    e.preventDefault();
                    setTimeout(() => {
                      showCommentLimit();
                    }, 0);
                  }
                }}
              />
              <div className={styles.commentCounter}>
                {values.comment.length}/30
              </div>
              {touched.comment && errors.comment && (
                <div className={styles.errorText}>{errors.comment}</div>
              )}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={`${styles.submitBtn} form-button`}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <RotatingLines
                    width="20"
                    strokeColor="#fff"
                    strokeWidth="3"
                    animationDuration="0.75"
                    ariaLabel="adding"
                  />
                ) : (
                  "ADD"
                )}
              </button>
              <button
                type="button"
                className={`${styles.cancelBtn} form-button-register`}
                onClick={onCancel}
              >
                CANCEL
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTransactionForm;
