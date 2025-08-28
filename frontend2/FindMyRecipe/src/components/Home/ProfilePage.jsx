import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import defaultProfileImage from '../../assets/profile.png';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Components ---

const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const Notification = ({ type, message }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
        {type === 'success' ? '🎉' : '🔥'} {message}
    </motion.div>
);

const ProfileSkeleton = () => (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center animate-pulse">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-10 border-t-8 border-gray-200 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-300"></div>
            <div className="h-10 bg-gray-300 rounded-md w-1/2 mx-auto mb-4"></div>
            <div className="space-y-4 max-w-md mx-auto mt-8">
                <div className="h-6 bg-gray-200 rounded-md w-full"></div>
                <div className="h-6 bg-gray-200 rounded-md w-full"></div>
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
            </div>
            <div className="mt-8 h-12 bg-gray-300 rounded-lg w-32 mx-auto"></div>
        </div>
    </div>
);


// --- Main Profile Page Component ---
const ProfilePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    const [editedProfile, setEditedProfile] = useState({});
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchProfile = async () => {
        try {
            const res = await axios.get('https://find-my-recipe-backend.web.app/auth/whoami', { headers: { Authorization: `Bearer ${token}` } });
            if (res.data && res.data.user) {
                const user = res.data.user;
                // Ensure all fields have a fallback to prevent errors
                const fullProfile = { name: '', email: '', phone: '', age: '', bio: '', ...user };
                setProfile(fullProfile);
                setEditedProfile(fullProfile);
            } else {
                showMessage('Failed to load profile', 'error');
            }
        } catch (err) {
            showMessage('Error fetching profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

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
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('name', editedProfile.name);
            formData.append('email', editedProfile.email);
            formData.append('phone', editedProfile.phone || '');
            formData.append('age', editedProfile.age || '');
            formData.append('bio', editedProfile.bio || '');
            if (selectedImageFile) {
                formData.append('image', selectedImageFile);
            }

            const res = await axios.put('https://find-my-recipe-backend.web.app/auth/update-profile', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success && res.data.user) {
                setIsEditing(false);
                setSelectedImageFile(null);
                showMessage('Profile updated successfully!', 'success');
                fetchProfile(); // Refetch profile to get final data
                window.dispatchEvent(new Event('profileUpdated')); // Notify navbar
            } else {
                showMessage(res.data.message || 'Update failed', 'error');
            }
        } catch (err) {
            showMessage('Error updating profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
        setSelectedImageFile(null);
    };
    
    // Determine the correct image source
    let displayImage = defaultProfileImage;
    if (editedProfile.image) {
        // If it's a local file preview (blob URL)
        if (editedProfile.image.startsWith('blob:')) {
            displayImage = editedProfile.image;
        } 
        // If it's a data URL from the database
        else if (editedProfile.image.startsWith('data:image')) {
            displayImage = editedProfile.image;
        }
        // If it's a relative path from the backend
        else {
            displayImage = `https://find-my-recipe-backend.web.app/${editedProfile.image}`;
        }
    }

    if (loading) return <ProfileSkeleton />;

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center p-4 sm:p-6 md:p-10 text-gray-800">
            <header className="w-full max-w-4xl flex justify-between items-center mb-6">
                <button onClick={() => navigate(-1)} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow border transition">
                    ← Back
                </button>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow transition">
                        Edit Profile
                    </button>
                )}
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-4xl rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200"
            >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="relative flex-shrink-0">
                        <img src={displayImage} alt="Profile" className="w-36 h-36 rounded-full border-4 border-white shadow-md object-cover" />
                        {isEditing && (
                            <>
                                <label htmlFor="profilePicInput" className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-2 rounded-full cursor-pointer shadow hover:bg-orange-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                </label>
                                <input type="file" accept="image/*" id="profilePicInput" onChange={handleImageChange} className="hidden" />
                            </>
                        )}
                    </div>
                    <div className="flex-grow w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isEditing ? 'edit' : 'view'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input type="text" name="name" value={editedProfile.name} onChange={handleChange} placeholder="Your Name" className="text-3xl font-bold w-full border-b-2 p-2 focus:outline-none focus:border-orange-500"/>
                                        <input type="email" name="email" value={editedProfile.email} onChange={handleChange} placeholder="Your Email" className="w-full p-2 border rounded-md"/>
                                        <input type="text" name="phone" value={editedProfile.phone} onChange={handleChange} placeholder="Your Phone Number" className="w-full p-2 border rounded-md"/>
                                        <input type="number" name="age" value={editedProfile.age} onChange={handleChange} placeholder="Your Age" className="w-full p-2 border rounded-md"/>
                                        <textarea name="bio" value={editedProfile.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows="3" className="w-full p-2 border rounded-md"/>
                                        <div className="flex justify-end gap-4 pt-4">
                                            <button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition">Cancel</button>
                                            <button onClick={handleSave} disabled={isSaving} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition flex items-center disabled:bg-green-300">
                                               {isSaving && <SpinnerIcon/>}
                                               {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center md:text-left">
                                        <h2 className="text-4xl font-bold text-orange-600">{profile.name}</h2>
                                        <p className="text-gray-500 mt-1">{profile.email}</p>
                                        <div className="mt-6 space-y-3 text-lg text-gray-700">
                                            <p><strong className="w-24 inline-block">Phone:</strong> {profile.phone || 'Not provided'}</p>
                                            <p><strong className="w-24 inline-block">Age:</strong> {profile.age || 'Not provided'}</p>
                                            <p className="text-base italic text-gray-600 mt-4 border-t pt-4">"{profile.bio || 'No bio yet.'}"</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
            
            <AnimatePresence>
                {message.text && <Notification type={message.type} message={message.text} />}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;