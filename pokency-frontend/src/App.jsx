import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SelectPokemonPage from "./pages/SelectPokemonPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select" element={<SelectPokemonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
