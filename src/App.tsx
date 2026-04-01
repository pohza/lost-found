import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import HomePage from "./pages/Home";
import ReportPage from "./pages/Report";
import ReportLostPage from "./pages/ReportLost";
import ReportFoundPage from "./pages/ReportFound";
import ItemDetailPage from "./pages/ItemDetail";
import ClaimPage from "./pages/Claim";
import ClaimsSubmittedPage from "./pages/ClaimsSubmitted";
import ClaimsStatusPage from "./pages/ClaimsStatus";
import ProfilePage from "./pages/Profile";
import MyPostsPage from "./pages/MyPosts";
import NotificationsPage from "./pages/Notifications";
import NotificationDetailPage from "./pages/NotificationDetail";
import MessagesPage from "./pages/Messages";
import MessageDetailPage from "./pages/MessageDetail";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/item/:id" element={<ItemDetailPage />} />
      <Route path="/claim/:id" element={<ClaimPage />} />
      <Route path="/claims" element={<ClaimsSubmittedPage />} />
      <Route path="/claims/status" element={<ClaimsStatusPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/my-posts" element={<MyPostsPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/notifications/:id" element={<NotificationDetailPage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/messages/:id" element={<MessageDetailPage />} />
      <Route path="/report" element={<ReportPage />} />
      <Route path="/report/lost" element={<ReportLostPage />} />
      <Route path="/report/found" element={<ReportFoundPage />} />
      <Route path="/report/found/:id/edit" element={<ReportFoundPage />} />
      <Route path="/report/lost/:id/edit" element={<ReportLostPage />} />
    </Routes>
  );
}

export default App;