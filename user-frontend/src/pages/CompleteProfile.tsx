import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    dob: '',
    location: '',
    bio: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const email = user.email;

      await axios.post('http://localhost:5000/update-profile', {
        ...form,
        email,
      });

      // Update local storage
      user.is_profile_complete = true;
      user.name = form.name;
      user.dob = form.dob;
      user.location = form.location;
      user.bio = form.bio;

      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard'); // redirect to home after profile complete
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center text-purple-700">Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full mb-4 p-3 border border-gray-300 rounded"
          required
        />
        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          className="w-full mb-4 p-3 border border-gray-300 rounded"
          required
        />
        <input
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full mb-4 p-3 border border-gray-300 rounded"
          required
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell us something about you..."
          className="w-full mb-6 p-3 border border-gray-300 rounded h-24"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition"
        >
          Save and Continue
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
