import React from "react";
import ExpenseItem from "./ExpenseItem";

function ExpenseList({ expenses, deleteExpense, editExpense }) {
  if (!expenses || expenses.length === 0) {
    return <p className="text-center text-muted mt-3">No expenses found. Add some!</p>;
  }

  return (
    <div>
      {expenses.map((exp) => (
        <ExpenseItem
          key={exp.id}
          exp={exp}
          deleteExpense={deleteExpense}
          editExpense={editExpense}
        />
      ))}
    </div>
  );
}

export default ExpenseList;
