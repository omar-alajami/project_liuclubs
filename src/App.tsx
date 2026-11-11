import { Routes, Route } from "react-router-dom";
import Layout from './layout.tsx';
import Home from './pages/Home.tsx';
import Clubs from './pages/Clubs.tsx';
import LoginPage from './pages/Login.tsx';
import SignupPage from './pages/Signup.tsx';
import RootRedirect from './RootRedirect.tsx';
import ClubLayout from './pages/ClubLayout.tsx';
import ClubOverview from "./pages/clubPages/index.tsx";
import ClubAnnouncements from "./pages/clubPages/Announcements.tsx";
import AddAnnouncement from "./pages/clubPages/CreateAnnouncement.tsx";
import ClubMembers from "./pages/clubPages/Members.tsx";
import EditAnnouncement from "./pages/clubPages/EditAnnouncement.tsx";
import RequestClub from "./pages/RequestClub.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from './pages/profile.tsx';
import AddClub from './pages/AddClub.tsx';
import ViewRequests from './pages/ViewRequests.tsx';
import About from './pages/About.tsx';
import VerifyEmail from './pages/VerifyEmail.tsx';

function App(){
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route element={<Layout/>}>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/request-club" element={<RequestClub />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/clubs/:clubId" element={<ClubLayout />}>
          <Route index element={<ClubOverview />} />
          <Route path="announcements" element={<ClubAnnouncements />} />
          <Route path="announcements/new" element={<AddAnnouncement />} />
          <Route path="announcements/edit" element={<EditAnnouncement />} />
          <Route path="members" element={<ClubMembers />} />
        </Route>
        <Route path="/admin/add-club" element={<AddClub />}/>
        <Route path="/admin/view-requests" element={<ViewRequests />}/>
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/verify" element={<VerifyEmail />} />
    </Routes>
  )
}

export default App;