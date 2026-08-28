import React, { useState } from "react";

function ExpenseForm({ addExpense }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    addExpense({ amount, category });
    setAmount("");
    setCategory("");
  };

  return (
    <div className="card p-3 mb-3 shadow-sm border-0">
      <h5 className="mb-3 fw-bold">Add Expense</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input
            className="form-control"
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Category (e.g., Food, Travel)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;