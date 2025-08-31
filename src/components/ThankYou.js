import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ThankYou = () => {
  const location = useLocation();
  const { formData } = location.state || { formData: null };
  
  // If no form data is available, show an error
  if (!formData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h2>Error: No form data available</h2>
          <Link to="/" className="btn btn-primary">Go back to form</Link>
        </div>
      </div>
    );
  }
  
  // Get selected interests
  const selectedInterests = Object.keys(formData.interests).filter(
    key => formData.interests[key]
  );
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h2>Thank You for Your Submission!</h2>
            </div>
            <div className="card-body">
              <div className="alert alert-success">
                Your form has been successfully submitted.
              </div>
              
              <h3>Your Information:</h3>
              <ul className="list-group mb-4">
                <li className="list-group-item">
                  <strong>Name:</strong> {formData.fullName}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {formData.email}
                </li>
                <li className="list-group-item">
                  <strong>Age:</strong> {formData.age}
                </li>
                <li className="list-group-item">
                  <strong>Country:</strong> {formData.country}
                </li>
                <li className="list-group-item">
                  <strong>Gender:</strong> {formData.gender}
                </li>
                <li className="list-group-item">
                  <strong>Interests:</strong> {
                    selectedInterests.length > 0 
                      ? selectedInterests.join(', ')
                      : 'None selected'
                  }
                </li>
              </ul>
              
              <div className="d-grid">
                <Link to="/" className="btn btn-primary">Fill Another Form</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
