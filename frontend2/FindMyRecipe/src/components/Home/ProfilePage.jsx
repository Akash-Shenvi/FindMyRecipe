import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../../assets/profile.png';

const ProfilePage = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rani Kini',
    phone: '+91 98765 43210',
    email: 'rani@example.com',
    age: 22,
    bio: 'Passionate about food and flavor. Exploring the world one recipe at a time!',
    image: defaultProfileImage,
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setEditedProfile({ ...editedProfile, image: imageURL });
    }
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

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
            src={editedProfile.image}
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
      </div>
    </div>
  );
};

export default ProfilePage;
