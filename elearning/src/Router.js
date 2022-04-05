import {
    Routes,
    Route,
    Outlet, Navigate,
    useLocation
} from "react-router-dom";

import { MODERATOR } from './config'
import Home from './pages/Home/Home'
import Infor from './pages/Infor/Infor'
import Login from './pages/Login/Login'
import Orders from './pages/Admin/Orders'
import Course from './pages/Coures/Coures'
import { CustomerApp, AdminApp } from './App'
import Member from './pages/Members/Member.js'
import Schedule from './pages/Schedule/Schedule'
import CourseDetail from './pages/Coures/CourseDetail'
import Notification from './pages/Notification/Notification'
import ExerciseDetail from './pages/Exercise/ExerciseDetail'
import FolderShare from './pages/Folders/FolderShare'

import { useSelector } from 'react-redux'

function CheckLogin() {
    const location = useLocation();
    const { pathname } = location;
    let pathSplit = pathname.split('/');
    let titleName = pathSplit[1].charAt(0).toUpperCase() + pathSplit[1].slice(1)
    document.title = (titleName === '') ? "Elearning" : titleName;
    const isLogin = useSelector(state => state.isLogin.value)
    return (
        isLogin ? <Outlet /> : <Navigate to='/login' />
    );
}
function CheckAdmin() {
    const isLogin = useSelector(state => state.isLogin.value)
    const userRole = useSelector(state => state.infor.roles)
    const isAdmin = userRole.some((role) => (role === MODERATOR))
    console.log(userRole)
    return (
        isAdmin ? <AdminApp /> : (isLogin ? <Outlet /> : <Navigate to='/login' />)
    );
}

function Router() {
    return (
        <Routes>
            <Route element={<CheckLogin />} >
                <Route path="/" element={<CustomerApp />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/course" element={<Course />} />
                    <Route path="/courseDetail" element={<CourseDetail />} />
                    <Route path="/member" element={<Member />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/infor" element={<Infor />} />
                    <Route path="/notification" element={<Notification />} />
                    <Route path="/folderShare" element={<FolderShare />} />
                </Route>
                <Route path="/admin" element={<CheckAdmin />}>
                    <Route path="/admin/*" element={<Orders />} />
                </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/courseDetail" element={<CourseDetail />} />
            <Route path="/home" element={<Home />} />
            <Route path="/course" element={<Course />} /> */}
        </Routes>
    )
}
export default Router;

