import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfileImage from '../../assets/profile.png';

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const axiosAuth = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosAuth.get('/auth/whoami');
        if (res.data.success) {
          setProfile(res.data.user);
          setEditedProfile(res.data.user);
        } else {
          setMessage('❌ Failed to load profile');
        }
      } catch (err) {
        console.error(err);
        setMessage('❌ Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImageFile(file);
      setEditedProfile({ ...editedProfile, image: imageURL });
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

    const res = await axios.put('http://localhost:5000/auth/update-profile', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.data && res.data.success && res.data.user) {
  const updatedUser = res.data.user;

  setProfile(updatedUser);
  setEditedProfile(updatedUser);
  setIsEditing(false);
  setMessage('✅ Profile updated!');
  setSelectedImageFile(null);

  // ✅ Save updated info to localStorage
  const imagePath = updatedUser.image;
  const fullImageUrl = imagePath?.startsWith('http')
    ? imagePath
    : `http://localhost:5000/${imagePath}`;
  localStorage.setItem('profileImage', fullImageUrl);
  localStorage.setItem('profileName', updatedUser.name);
  localStorage.setItem('profileEmail', updatedUser.email);

  // ✅ Dispatch custom event for Navbar
  window.dispatchEvent(new Event('profileUpdated'));
    } else {
      setMessage('❌ Update failed: Invalid response');
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-yellow-50 flex flex-col items-center justify-center px-6 py-10 text-gray-800">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded shadow"
      >
        ⬅ Back
      </button>

      {/* Profile Card */}
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
