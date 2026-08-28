import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// register components
ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart() {
  const data = {
    labels: ["Food", "Travel", "Shopping"],
    datasets: [
      {
        label: "Expenses",
        data: [300, 200, 150],
        backgroundColor: ["red", "blue", "green"],
      },
    ],
  };

  return <Pie data={data} />;
}

export default ExpenseChart;