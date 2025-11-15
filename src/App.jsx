import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/Home.jsx";
import TimeTable from "./components/TimeTable.jsx";
import History from "./components/History.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/:courseId/:branchId/:semId",
    element: 
    <div>
      <TimeTable />
    </div>,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
