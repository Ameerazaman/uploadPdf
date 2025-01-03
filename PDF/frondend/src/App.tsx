import React, { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loading from './Pages/Loading';



const Login = lazy(() => import('./Componants/Login'))
const PdfDetail = lazy(() => import('./Pages/PdfDetail'))
const Signup = lazy(() => import('./Componants/Signup'))
const Home = lazy(() => import('./Componants/Home'))
function App() {
  return (
    <div>
      <Router>
        <Suspense fallback={<div><Loading /></div>} >
        <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/pdf-detail/:id' element={<PdfDetail />}></Route>
        </Routes>
      </Suspense>
    </Router>
    </div >
  );
}

export default App;
