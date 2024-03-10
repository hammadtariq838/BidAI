import { Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <>
      <Toaster richColors position="top-center" />
      <article className="prose">
        <Outlet />
      </article>
    </>
  );
};

export default App;
