import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../firebase';

const ProfileInfo = () => {
  const { firstName, lastName, email, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName,
    lastName,
    email,
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div>
      <h2>Profile Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          New Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
      <div>
        <h2>Profile Information</h2>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
};

export default ProfileInfo;
