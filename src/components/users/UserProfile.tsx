import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Input } from '../ui/input';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const defaultAvatar = '/images/defaultAvatar.jpg'

  return (
    <div className="w-4/5 mx-auto p-6 bg-white border-2 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
      <div className="flex flex-col items-center">
        <img
          src={userInfo?.avatar || defaultAvatar}
          alt={userInfo?.name || 'User Avatar'}
          className="w-24 h-24 rounded-full mb-4"
        />

        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-1">Name</label>
          <Input
            type="text"
            value={userInfo?.name || ''}
            readOnly
            className="w-full border-none focus:outline-none bg-blue-50 focus-visible:ring-0"
          />
        </div>

        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-1">Email</label>
          <Input
            type="text"
            value={userInfo?.email || ''}
            readOnly
            className="w-full border-none focus:outline-none bg-blue-50 focus-visible:ring-0"
          />
        </div>

        <div className="w-full mb-2">
          <label className="block text-gray-700 text-sm font-bold mb-1">Phone</label>
          <Input
            type="text"
            value={userInfo?.phone || 'Please add a phone number'}
            readOnly
            className="w-full border-none focus:outline-none bg-blue-50 focus-visible:ring-0"
          />
        </div>

        <Link to={'/myprofile/update'}><button
          type='button'
          className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Edit Profile
        </button></Link>

        <Link to={'/myprofile/update/password'} className='text-blue-900 mt-3 underline hover:text-blue-700'>Change Password?</Link>
      </div>
    </div>
  )
};

export default UserProfile;
