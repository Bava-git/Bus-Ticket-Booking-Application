import './App.css'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

let role = localStorage.getItem("role") || "";

//Modules
import Header from './compenents/Header'
import { PassengerForm, RouteForm, BusForm, BookingForm } from './compenents/Forms'
import { ListPassenger, ListBus, ListRoute, ListBookingInfo } from './compenents/List'
import HomePage from './compenents/HomePage'
import Login from './compenents/Login'
import ResultPage from './compenents/ResultPage'
import { Profile, ChangePassword } from './compenents/Profile'
import PrivateComponents from "./compenents/PrivateComponents";
import { History } from "./compenents/History";


//CSS
import './assets/css/Form.css'
import './assets/css/List.css'
import './assets/css/HomePage.css'
import './assets/css/ResultPage.css'
import './assets/css/Login.css'

function App() {

  return (
    <>
      <Toaster expand={true} richColors position='top-right' closeButton />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<PrivateComponents allowedRoles={["ROLE_PASSENGER", "ROLE_ADMIN"]} />}>
            <Route path="/history" element={<History />} />
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
        </Routes>
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
