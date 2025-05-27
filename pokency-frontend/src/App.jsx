import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SelectPokemonPage from "./pages/SelectPokemonPage";
import BattlePage from "./pages/BattlePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select" element={<SelectPokemonPage />} />
        <Route path="/battle" element={<BattlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
