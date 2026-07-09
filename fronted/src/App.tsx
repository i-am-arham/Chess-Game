import { createBrowserRouter, RouterProvider } from "react-router";
// import Landing from "./Pages/landing";
import Game from "./Pages/Game";

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Landing />,
  // },
  {
    path: "/",
    element: <Game />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
