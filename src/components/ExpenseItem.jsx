import React from "react";
import { FaMoneyBill, FaTrash, FaEdit } from "react-icons/fa";

const getColor = (category) => {
  if (!category) return "secondary";
  switch (category.toLowerCase()) {
    case "food":
      return "danger";
    case "travel":
      return "primary";
    case "shopping":
      return "success";
    default:
      return "secondary";
  }
};

function ExpenseItem({ exp, deleteExpense, editExpense }) {
  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title fw-bold mb-1">
            <FaMoneyBill className="me-2 text-success" /> ₹{exp.amount}
          </h5>
          <span className={`badge bg-${getColor(exp.category)}`}>
            {exp.category}
          </span>
        </div>

        <div>
          <button
            className="btn btn-outline-warning btn-sm me-2"
            onClick={() => editExpense(exp)}
          >
            <FaEdit /> Edit
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => deleteExpense(exp.id)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseItem;
