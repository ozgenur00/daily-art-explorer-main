import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, deleteUser } from '../../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';
import '../../styles/main/AccountSettings.css';

const AccountSettings = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
            setError('Please enter your current password to confirm changes.');
            return;
        }
        try {
            await dispatch(updateUser({
                id: user.id,
                username,
                email,
                currentPassword,  // Required for confirmation
                newPassword       // Optional; only update if provided
            })).unwrap();
            alert('Account updated successfully');
        } catch (err) {
            setError(err.message || 'An error occurred while updating the account.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await dispatch(deleteUser(user.id)); 
                alert('Account deleted successfully');
                navigate('/');
            } catch (err) {
                setError(err.message || 'An error occurred while deleting the account.');
            }
        }
    };
    

    return (
        <div className="account-settings-container">
            <form className="account-settings-form" onSubmit={handleUpdate}>
                <h2>Account Settings</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="New Password (leave blank to keep current)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Update Account</button>
                <button type="button" className="delete-account" onClick={handleDelete}>Delete Account</button>
            </form>
        </div>
    );
};

export default AccountSettings;
