import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/Home.jsx";
import TimeTable from "./components/TimeTable.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
