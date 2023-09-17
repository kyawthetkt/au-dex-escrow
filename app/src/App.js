import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
import CreateEscrowPage from './pages/CreateEscrow';
import ListEscrow from './pages/ListEscrow';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Content>
        <Routes>
          <Route path="/" exact element={<ListEscrow />} />
          <Route path="/escrow/create" element={<CreateEscrowPage />} />
        </Routes>
      </Content>
      <Footer />
    </BrowserRouter>

  );
}

export default App;