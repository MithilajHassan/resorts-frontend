import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/userSide/HomePage";
import UserSignup from "../pages/userSide/Signup";
import UserSignin from "../pages/userSide/Signin";
import ResortDetailsPage from "../pages/userSide/ResortDetailsPage";
import NotFound from "../components/common/404";
import UserPrivateRoutes from "../components/users/UserPrivateRoutes";
import SearchResultsPage from "../pages/userSide/SearchResultPage";
import UserProfilePage from "../pages/userSide/UserProfilePage";
import Checkout from "../pages/userSide/Checkout";
import BookingSuccessPage from "../pages/userSide/BookingSuccessPage";
import BookingsPage from "../pages/userSide/BookingsPage";
import BookingDetailsPage from "../pages/userSide/BookingDetailsPage";
import UserProfileEditPage from "../pages/userSide/UserProfileEditPage";
import WishlistPage from "../pages/userSide/WishlistPage";
import PasswordChangingPage from "../pages/userSide/PasswordChangingPage";
import WalletPage from "../pages/userSide/WalletPage";

const UserRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/signup' element={<UserSignup />} />
            <Route path='/signin' element={<UserSignin />} />
            <Route path='/search' element={<SearchResultsPage />} />
            <Route path='/resortdetails/:id' element={<ResortDetailsPage />} />
            
            <Route path="" element={<UserPrivateRoutes/>} >
                <Route path='/myprofile' element={<UserProfilePage />} />
                <Route path='/myprofile/update' element={<UserProfileEditPage />} />
                <Route path='/myprofile/update/password' element={<PasswordChangingPage />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path="/booking-success" element={<BookingSuccessPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/bookings/:id" element={<BookingDetailsPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/wallet" element={<WalletPage />} />

            </Route>

            <Route path='*' element={<NotFound baseRoute="/" />} />
        </Routes>
    );
};

export default UserRoutes;