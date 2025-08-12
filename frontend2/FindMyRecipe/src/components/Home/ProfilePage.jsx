import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfileImage from '../../assets/profile.png';

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const axiosAuth = axios.create({
    baseURL: 'https://find-my-recipe-backend.web.app',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axiosAuth.get('/auth/whoami');
      if (res.data.success && res.data.user) {
        const user = res.data.user;
        setProfile(user);
        setEditedProfile(user);
      } else {
        setMessage('❌ Failed to load profile');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setSelectedImageFile(file);
      setEditedProfile({ ...editedProfile, image: preview });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editedProfile.name);
      formData.append('email', editedProfile.email);
      formData.append('phone', editedProfile.phone);
      formData.append('age', editedProfile.age);
      formData.append('bio', editedProfile.bio);
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }

      const res = await axios.put('https://find-my-recipe-backend.web.app/auth/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success && res.data.user) {
        setIsEditing(false);
        setMessage('✅ Profile updated!');
        setSelectedImageFile(null);

        // ✅ Refetch profile to get updated data
        fetchProfile();

        // ✅ Notify other components if needed
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        setMessage('❌ Update failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error updating profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setSelectedImageFile(null);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-yellow-50 flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-yellow-500 h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-yellow-50 flex flex-col items-center justify-center px-6 py-10 text-gray-800">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded shadow"
      >
        ⬅ Back
      </button>

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-10 border-t-8 border-yellow-400 text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <img
            src={editedProfile.image || defaultProfileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-yellow-400 object-cover"
          />
          {isEditing && (
            <>
              <label
                htmlFor="profilePicInput"
                className="absolute bottom-0 right-0 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full cursor-pointer shadow hover:bg-yellow-500"
              >
                ✏️
              </label>
              <input
                type="file"
                accept="image/*"
                id="profilePicInput"
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
        </div>

        <h2 className="text-4xl font-bold text-yellow-500 mb-4">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedProfile.name}
              onChange={handleChange}
              className="text-center text-3xl font-bold w-full border-b border-yellow-300 focus:outline-none"
            />
          ) : (
            profile.name
          )}
        </h2>

        <div className="space-y-4 text-lg text-left max-w-md mx-auto">
          {['phone', 'email', 'age', 'bio'].map((field) => (
            <p key={field}>
              <span className="font-semibold capitalize">{field}:</span>{' '}
              {isEditing ? (
                <input
                  type={field === 'age' ? 'number' : 'text'}
                  name={field}
                  value={editedProfile[field]}
                  onChange={handleChange}
                  className="w-full border-b border-yellow-300 focus:outline-none"
                />
              ) : (
                profile[field]
              )}
            </p>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {message && (
          <p className="mt-6 text-center text-red-600 font-semibold text-lg">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
