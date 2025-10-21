import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Top from './pages/Top'
import MakeAccount from './pages/MakeAccount/MakeAccount'
import MakeAccountEmployee from './pages/MakeAccountEmployee'
import HomeEmployee from './pages/HomeEmployee'
import HomeEmployer from './pages/HomeEmployer'
import Login from './pages/Login'
import MakeAccountEmployer from './pages/MakeAccountEmployer'
import StoreTop from './pages/MakeAccount/StoreTop'
import MakeEmployeeShift from './pages/MakeEmployeeShift'
import { StoreCalendarPage } from './pages/StoreCalendarPage'
import StoreEmployee from './pages/StoreEmployee'
import EmployerShiftEdit from './pages/EmployerShiftEdit'
import EmployerShiftCalendar from './pages/EmployerShiftCalendar'
import EmployeeShiftSituation from './pages/EmployeeShiftSituation'



const AppRoute: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/signin" element={<MakeAccount />} />
        <Route path="/signin/employee/email" element={<MakeAccountEmployee />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin/employer" element={<MakeAccountEmployer />} />
        <Route path="/home/employee" element={<HomeEmployee />} />
        <Route path="/home/employer" element={<HomeEmployer />} />
        <Route path="/store/:id" element={<StoreTop />} />
        <Route path="/store/:id/shift" element={<MakeEmployeeShift />} />
        <Route path="/store/:id/calendar" element={<StoreCalendarPage />} />
        <Route path="/store/:id/employee/detail" element={<StoreEmployee />} />
        <Route path="/store/:id/employee/situation" element={<EmployeeShiftSituation />} />
        <Route path="/store/:id/shifts/calender" element={<EmployerShiftCalendar />} />
        <Route path="/store/:id/shifts/:date" element={<EmployerShiftEdit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoute