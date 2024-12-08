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
    const [selectedCode, setSelectedCode] = useState("Country Code");

    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        const nameRegex = /^[a-zA-Z ]{3,50}$/;
        const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
        const phoneRegex = /^\+\d{1,3}\d{10,15}$/;
        const fullPhoneNumber = `${selectedCode}${formData.phoneNumber}`;

        if (!nameRegex.test(formData.fullName)) errors.fullName = 'Name must be 3-50 alphabetic characters.';
        if (!emailRegex.test(formData.emailAddress)) errors.emailAddress = 'Invalid email format.';
        if (!phoneRegex.test(fullPhoneNumber)) errors.phoneNumber = 'Invalid phone number format. Make sure you provided country code';
        if (formData.phoneNumber.length<10 || formData.phoneNumber.length>15) errors.phoneNumber = 'Invalid phone number format. length between 10-15';
        if (formData.age < 18 || formData.age > 99) errors.age = 'Age must be between 18 and 99.';

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        if (!validate()) return;
        const fullPhoneNumber = `${selectedCode}${formData.phoneNumber}`;
        const submissionData = { ...formData, phoneNumber: fullPhoneNumber };
        try {

            await axios.post(`${baseLink}CreateRegistiration`, submissionData);
            Swal.fire({
                icon: "success",
                title: "Registration Created Successfully",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                //navigate('/');
            })
        } catch (error) {
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
                        className="form-control"
                        placeholder="Enter Full Name..."
                    />
                    {errors.fullName && <small className="text-danger">{errors.fullName}</small>}
                </div>
                <div className="mb-3">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                        className="form-control"
                        placeholder="Enter Email Address..."
                    />
                    {errors.emailAddress && <small className="text-danger">{errors.emailAddress}</small>}
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
                            className="form-control"
                            placeholder="e.g., 1234567890"
                        />
                    </div>
                    {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
                </div>
                <div className="mb-3">
                    <label>Age</label>
                    <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="form-control"
                        placeholder="Enter Age..."
                    />
                    {errors.age && <small className="text-danger">{errors.age}</small>}
                </div>
                {errors.apiError && <small className="text-danger">{errors.apiError}</small>}
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    );
};
export default AddRegistration;
