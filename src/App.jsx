import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import ArticleDashboard from "./pages/ArticleDashboard";
import DetailArticle from "./pages/DetailArticle";
import "./index.css";
import Trash from "./pages/Trash";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ArticleDashboard />} />
        <Route path="/detail/:id" element={<DetailArticle />} />
        <Route path="/trash" element={<Trash />} />
      </Routes>
    </>
  );
}

export default App;
