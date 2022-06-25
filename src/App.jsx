import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Navbar from "./components/UI/Navbar/Navbar";

import "./styles/App.css";
import AppRouter from "./components/AppRouter";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<AppRouter />
		</BrowserRouter>
	);
}

export default App;