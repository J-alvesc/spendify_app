import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Invoices } from "./pages/Invoices";
import { Cards } from "./pages/Cards";
import { People } from "./pages/People";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faturas" element={<Invoices />} />
        <Route path="/cartoes" element={<Cards />} />
        <Route path="/pessoas" element={<People />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;