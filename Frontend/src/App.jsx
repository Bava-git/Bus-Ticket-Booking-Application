import './App.css'
import React, { lazy, Suspense } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

//Modules
import Header from './components/Header';
import { PassengerForm, RouteForm, BusForm, BookingForm } from './components/Forms';
import { ListPassenger, ListBus, ListRoute, ListBookingInfo } from './components/List';
import HomePage from './components/HomePage';
import Login from './components/Login';
// import ResultPage from './components/ResultPage';
const ResultPage = lazy(() => import('./components/ResultPage'));
import { Profile, ChangePassword } from './components/Profile';
import PrivateComponents from "./components/PrivateComponents";
import { History, DwldTicket } from "./components/History";
import TestScreen from './test/TestScreen';


//CSS
import './assets/css/Form.css';
import './assets/css/List.css';
import './assets/css/HomePage.css';
import './assets/css/ResultPage.css';
import './assets/css/Login.css';
import './assets/css/History.css';

function App() {

  return (
    <>
      <Toaster expand={true} richColors position='top-right' duration={2000} />
      <BrowserRouter>
        <Header />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route element={<PrivateComponents allowedRoles={["ROLE_PASSENGER", "ROLE_ADMIN"]} />}>
              <Route path="/history" element={<History />} />
              <Route path="/print" element={<DwldTicket />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/changepassword" element={<ChangePassword />} />
            </Route>
            <Route element={<PrivateComponents allowedRoles={["ROLE_ADMIN"]} />}>
              <Route path='/routeform' element={<RouteForm />} />
              <Route path='/busform' element={<BusForm />} />
              <Route path='/bookingform' element={<BookingForm />} />
              <Route path='/passengerlist' element={<ListPassenger />} />
              <Route path='/buslist' element={<ListBus />} />
              <Route path='/bookinginfolist' element={<ListBookingInfo />} />
              <Route path='/routelist' element={<ListRoute />} />
            </Route>

            <Route path='/results' element={<ResultPage />} />
            <Route path='/passengerform' element={<PassengerForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/*" element={<Page404 />} />
            <Route path="/testscreen" element={<TestScreen />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App

const Page404 = () => {
  return (
    <>
      <h1>404 - Page not found</h1>
    </>
  )
}

const LoadingScreen = () => {
  return (
    <main className="main-container">
      <div className='loadingScreenDiv'>
        <h1>Loading...</h1>
      </div>
    </main>
  );
};