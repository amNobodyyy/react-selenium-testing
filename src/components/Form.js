import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Form = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    country: '',
    gender: '',
    interests: {
      music: false,
      sports: false,
      coding: false
    }
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        interests: {
          ...formData.interests,
          [name.split('-')[1]]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validate name
    if (!formData.fullName || formData.fullName.length < 2) {
      newErrors.fullName = "Name is required and must be at least 2 characters";
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    
    // Validate age
    if (!formData.age || parseInt(formData.age) <= 0) {
      newErrors.age = "Age must be a positive number";
      isValid = false;
    }
    
    // Validate country
    if (!formData.country) {
      newErrors.country = "Please select a country";
      isValid = false;
    }
    
    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Navigate to thank you page with form data
      navigate('/thank-you', { state: { formData } });
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Form Submission</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} noValidate>
                {/* Full Name Field */}
                <div className="mb-3">
                  <label htmlFor="name-input" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name-input"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <div className="text-danger error-msg">{errors.fullName}</div>}
                </div>
                
                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email-input" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="text-danger error-msg">{errors.email}</div>}
                </div>
                
                {/* Age Field */}
                <div className="mb-3">
                  <label htmlFor="age-input" className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    id="age-input"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                  {errors.age && <div className="text-danger error-msg">{errors.age}</div>}
                </div>
                
                {/* Country Dropdown */}
                <div className="mb-3">
                  <label htmlFor="country-select" className="form-label">Country</label>
                  <select
                    className="form-select"
                    id="country-select"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select a country</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                  {errors.country && <div className="text-danger error-msg">{errors.country}</div>}
                </div>
                
                {/* Gender Radio Buttons */}
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender-male"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="gender-male">Male</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender-female"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="gender-female">Female</label>
                  </div>
                  {errors.gender && <div className="text-danger error-msg">{errors.gender}</div>}
                </div>
                
                {/* Interests Checkboxes */}
                <div className="mb-3">
                  <label className="form-label">Interests</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="interest-music"
                      id="interest-music"
                      checked={formData.interests.music}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="interest-music">Music</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="interest-sports"
                      id="interest-sports"
                      checked={formData.interests.sports}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="interest-sports">Sports</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="interest-coding"
                      id="interest-coding"
                      checked={formData.interests.coding}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="interest-coding">Coding</label>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" id="submit-btn">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
