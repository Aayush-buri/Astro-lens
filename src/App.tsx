import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { IdentifyPage } from '@/pages/IdentifyPage';
import { ObjectDetailPage } from '@/pages/ObjectDetailPage';
import { TargetPage } from '@/pages/TargetPage';
import { NightSkyPage } from '@/pages/NightSkyPage';
import { GuidePage } from '@/pages/GuidePage';
import { AssistantPage } from '@/pages/AssistantPage';
import { HistoryPage } from '@/pages/HistoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/identify" element={<IdentifyPage />} />
          <Route path="/object/:id" element={<ObjectDetailPage />} />
          <Route path="/target" element={<TargetPage />} />
          <Route path="/night-sky" element={<NightSkyPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
