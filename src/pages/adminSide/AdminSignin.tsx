import SigninForm from "../../components/common/SigninForm"
import AdminHeader from "../../components/admin/AdminHeader"


function AdminSigninPage() {

    return (
        <>
            <AdminHeader />
            <SigninForm role="admin" nextPage="/admin/dashboard" />
        </>
    )
}

export default AdminSigninPage