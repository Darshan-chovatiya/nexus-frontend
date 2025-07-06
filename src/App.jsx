import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import { LoginPage , AdminPanelPage, CompanyLoginPage, CompanyPanelPage } from './pages';
import {CompanyPrivateRoute, PrivateRoute} from './components/PrivateRoute';
import CompanySignup from './components/company-admin/CompanySignup';
import CompanyDataForm from './components/CompanyDataForm';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/admin/login' element={<LoginPage/>} />
          <Route path='/super-admin' element={<PrivateRoute><AdminPanelPage/></PrivateRoute>} />

          <Route path='/:companyName' element={<CompanyLoginPage/>}/>
          <Route path='/company' element={<CompanyPrivateRoute><CompanyPanelPage/></CompanyPrivateRoute>}/>

          <Route path="*" element={<CompanyLoginPage/>} />
          <Route path='/signup' element={<CompanySignup/>}/>

          <Route path='/user-form/:id' element={<CompanyDataForm/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
