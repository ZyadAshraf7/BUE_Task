import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddRegistration = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        phoneNumber: '',
        age: '',
    });
    const baseLink = `https://localhost:7239/api/Registiration/`;
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCode, setSelectedCode] = useState("Country Code"); // To hold the current country code


    const navigate = useNavigate();

    const validateField = (fieldName) => {
        const fieldErrors = {};
        const nameRegex = /^[a-zA-Z ]{3,50}$/;
        const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
        const phoneRegex = /^\+\d{1,3}\d{10,15}$/;
        const fullPhoneNumber = `${selectedCode}${formData.phoneNumber}`;

        if (fieldName === 'fullName') {
            if (!nameRegex.test(formData.fullName)) {
                fieldErrors.fullName = 'Name must be 3-50 alphabetic characters.';
            }
        }
        if (fieldName === 'emailAddress') {
            if (!emailRegex.test(formData.emailAddress)) {
                fieldErrors.emailAddress = 'Invalid email format.';
            }
        }
        if (fieldName === 'phoneNumber') {
            if (!phoneRegex.test(fullPhoneNumber)) {
                fieldErrors.phoneNumber = 'Invalid phone number format. Make sure you provided the country code.';
            } 
            if (formData.phoneNumber.length < 10 || formData.phoneNumber.length > 15) {
                fieldErrors.phoneNumber = 'Phone number length must be between 10-15.';
            }
        }
        if (fieldName === 'age') {
            if (formData.age < 18 || formData.age > 99) {
                fieldErrors.age = 'Age must be between 18 and 99.';
            }
        }
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors, ...fieldErrors };
            if (!fieldErrors[fieldName]) {
                delete updatedErrors[fieldName];
            }
            return updatedErrors;
        });
    };
    const setLoading = () => {
        setIsLoading(true);
      };
      const stopLoading = () => {
        setIsLoading(false);
      };
    const handleBlur = (fieldName) => {
        setTouched((prevTouched) => ({ ...prevTouched, [fieldName]: true }));
        validateField(fieldName);
    };
    const isFormValid = () => {
        const nameRegex = /^[a-zA-Z ]{3,50}$/;
        const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
        const phoneRegex = /^\+\d{1,3}\d{10,15}$/;
        const fullPhoneNumber = `${selectedCode}${formData.phoneNumber}`;

        return (
            nameRegex.test(formData.fullName) &&
            emailRegex.test(formData.emailAddress) &&
            phoneRegex.test(fullPhoneNumber) &&
            formData.phoneNumber.length >= 10 &&
            formData.phoneNumber.length <= 15 &&
            formData.age >= 18 &&
            formData.age <= 99
        );
    };
    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!isFormValid()){
            Swal.fire({
                icon: "error",
                title: "Oops",
                text: "Invalid data was provided"
            })
            return;
        }


        const fullPhoneNumber = `${selectedCode}${formData.phoneNumber}`;
        const submissionData = { ...formData, phoneNumber: fullPhoneNumber };
        try {
            setLoading();
            await axios.post(`${baseLink}CreateRegistiration`, submissionData);
            stopLoading();
            Swal.fire({
                icon: "success",
                title: "Registration Created Successfully",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate('/');
            })
        } catch (error) {
            stopLoading();
            Swal.fire({
                icon: "error",
                title: "Oops",
                text: error.response.data?.message || "An error occurred during the request."
            })
        }
    };
    const handleCountryCodeSelect = (code) => {
        setSelectedCode(code);
    };

    const handlePhoneNumberChange = (e) => {
        const numberValue = e.target.value;
        setFormData((prev) => ({
            ...prev, phoneNumber: numberValue,
        }));
    };

    return (
        <div>
            <h2>Add Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        onBlur={() => handleBlur('fullName')}
                        className="form-control"
                        placeholder="Enter Full Name..."
                    />
                    {touched.fullName && errors.fullName && (
                        <small className="text-danger">{errors.fullName}</small>
                    )}
                </div>
                <div className="mb-3">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                        onBlur={() => handleBlur('emailAddress')}
                        className="form-control"
                        placeholder="Enter Email Address..."
                    />
                    {touched.emailAddress && errors.emailAddress && (
                        <small className="text-danger">{errors.emailAddress}</small>
                    )}
                </div>
                <div className="mb-3">
                    <label>Phone Number</label>

                    <div className="input-group mb-3">
                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {selectedCode}
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item"
                                onClick={() => handleCountryCodeSelect("+1")}>+1</a></li>
                            <li><a className="dropdown-item"
                                onClick={() => handleCountryCodeSelect("+20")}>+20</a></li>
                        </ul>
                        <input
                            type="number"
                            value={formData.phoneNumber}
                            onChange={handlePhoneNumberChange}
                            onBlur={() => handleBlur('phoneNumber')}
                            className="form-control"
                            placeholder="e.g., 1234567890"
                        />
                    </div>
                    {touched.phoneNumber && errors.phoneNumber && (
                        <small className="text-danger">{errors.phoneNumber}</small>
                    )}
                </div>
                <div className="mb-3">
                    <label>Age</label>
                    <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        onBlur={() => handleBlur('age')}
                        className="form-control"
                        placeholder="Enter Age..."
                    />
                    {touched.age && errors.age && <small className="text-danger">{errors.age}</small>}
                </div>
                {errors.apiError && <small className="text-danger">{errors.apiError}</small>}
                {isLoading && <div className="spinner-border text-primary"></div>}
                {!isLoading && <button type="submit" className="btn btn-primary">Create</button>}
                
            </form>
        </div>
    );
};
export default AddRegistration;
