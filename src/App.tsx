import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";
import { MoviePage } from "./pages/MoviePage";
import { ListPage } from "./pages/ListPage";
import { StatsPage } from "./pages/StatsPage";
import { AccountPage } from "./pages/AccountPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ImportPage } from "./pages/ImportPage";
import { PWAProvider } from "./context/PWAContext";

function App() {
  return (
    <PWAProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/movie/:movieId" element={<MoviePage />} />
          <Route path="/list/:listName" element={<ListPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/:settingName" element={<SettingsPage />} />
          <Route path="/settings/import" element={<ImportPage />} />
        </Routes>
      </BrowserRouter>
    </PWAProvider>
  );
}

export default App;
