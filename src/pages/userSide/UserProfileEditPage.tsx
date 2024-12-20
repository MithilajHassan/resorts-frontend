import UserHeader from '../../components/users/UserHeader'
import EditUserProfile from '../../components/users/EditUserProfile';

const UserProfileEditPage = () => {

  return (
    <>
      <UserHeader />
      <div className='pt-16 flex items-center justify-center min-h-screen'>
        <EditUserProfile />
      </div>
    </>
  );
}

export default UserProfileEditPage;
