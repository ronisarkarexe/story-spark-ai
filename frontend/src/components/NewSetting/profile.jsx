import React, { useState } from "react";
import "./profile.css";

export const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "Roni Sarkar",
    email: "ronics2021@gmail.com",
    mobileNumber: "",
    skills: "",
    bio: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-card">
      <h2 className="card-title">Welcome back User!</h2>
      <p className="card-subtitle">Manage your profile and social media links here.</p>
      
      <hr className="section-divider" />

      <form onSubmit={(e) => e.preventDefault()} className="profile-form">
        
        <div className="form-grid">
          {/* Full Name */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label"><strong>Full Name</strong></label>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label"><strong>Email Address</strong></label>
            </div>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label"><strong>Mobile Number</strong></label>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="custom-input"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label"><strong>Skills</strong></label>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, UI Design"
                className="custom-input"
              />
            </div>
          </div>

          {/* Biography Textarea */}
          <div className="form-field col-span-2">
            <div className="field-header">
              <label className="field-label"><strong>Bio</strong></label>
            </div>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a brief description about yourself..."
              className="custom-textarea"
            />
          </div>
        </div>

        <hr className="section-divider" />

        <div className="form-section-title"><strong>Social Media Links</strong></div>
        
        <div className="form-grid">
          {/* Facebook */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label"><strong>Facebook</strong></label>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/username"
                className="custom-input"
              />
            </div>
          </div>

          {/* X */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label"><strong>X</strong></label>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://x.com/username"
                className="custom-input"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label"><strong>LinkedIn</strong></label>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="custom-input"
              />
            </div>
          </div>

          {/* Instagram */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label"><strong>Instagram</strong></label>
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
                className="custom-input"
              />
            </div>
          </div>
        </div>

        <div className="form-actions-footer">
          <button type="submit" className="save-form-btn">Save Changes</button>
        </div>

      </form>
    </div>
  );
};