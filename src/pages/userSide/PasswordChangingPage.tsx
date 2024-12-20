import UserHeader from '../../components/users/UserHeader'
import ChangePasswordForm from '../../components/users/ChangePasswordForm';

export default function PasswordChangingPage() {

  return (
    <>
      <UserHeader />
      <div className='pt-16 flex items-center justify-center min-h-screen'>
        <ChangePasswordForm />
      </div>
    </>
  )
}