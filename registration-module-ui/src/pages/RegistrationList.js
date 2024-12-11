import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegistrationList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [searchType, setSearchType] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const baseLink = `https://localhost:7239/api/Registiration/`;
    useEffect(() => {
        fetchRegistrationsCount();
        fetchRegistrations();
    }, [pageIndex]);
    const pageSize = 5;
    const checkIfDisable = () => {
        const totalRegsRendered = (pageIndex + 1) * pageSize;
        if (totalRegsRendered < totalRegistrations)
            return false;
        return true;
    }
    const setLoading = () => {
        setIsLoading(true);
      };
      const stopLoading = () => {
        setIsLoading(false);
      };
    const fetchRegistrations = async () => {
        try {
            setLoading();
            const response = await axios.get(`${baseLink}GetRegistirations?pageIndex=${pageIndex}&pageSize=${pageSize}`);
            stopLoading();
            setRegistrations(response.data);
        } catch (error) {
            stopLoading();
            setRegistrations([])
        }


    };
    const fetchRegistrationsCount = async () => {
        try {
            const response = await axios.get(`${baseLink}GetRegistirationsCount`);

            setTotalRegistrations(response.data);
        } catch (error) {
            setTotalRegistrations(0)
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.post(`${baseLink}Search`, {
                input: searchInput.trim(),
                searchType
            });
            setRegistrations(response.data);
            setTotalRegistrations(response.data.length);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops",
                text: err.response.data?.message || "An error occurred during the request."
            })
        }
    };

    return (
        <div>
            <h2>Registrations</h2>

            <button className="btn btn-success mt-3 mb-5 w-100" onClick={() => navigate('/add')}>
                + Add Registration
            </button>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-control mb-2"
                />
                <div>
                    <label className="me-2">
                        <input
                            type="radio"
                            value={0}
                            checked={searchType === 0}
                            onChange={() => setSearchType(0)}
                        />{' '}
                        Email
                    </label>
                    <label>
                        <input
                            type="radio"
                            value={1}
                            checked={searchType === 1}
                            onChange={() => setSearchType(1)}
                        />{' '}
                        Name
                    </label>
                </div>
                <div className='d-flex justofy-content-start'>
                    <button
                        disabled={searchInput === ""}
                        className="btn btn-primary mt-2 me-2" onClick={handleSearch}>
                        Search
                    </button>
                    <button
                        style={{ marginTop: 'auto' }}
                        className="btn btn-secondary" onClick={() => { fetchRegistrations(); fetchRegistrationsCount(); }}>
                        Reset
                    </button>
                </div>
            </div>
            {isLoading &&  <div className="spinner-border text-primary"></div>}
            {!isLoading && 
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map((reg, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{reg.fullName}</td>
                            <td>{reg.emailAddress}</td>
                            <td>{reg.phoneNumber}</td>
                            <td>{reg.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            }
            <div>
                {Math.min((pageIndex + 1) * pageSize, totalRegistrations)} out of {totalRegistrations}
            </div>
            <div>
                <button
                    className="btn btn-secondary me-2"
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex(pageIndex - 1)}
                >
                    <span>{"<<Previous"}</span>
                </button>
                <button
                    className="btn btn-success"
                    disabled={checkIfDisable()}
                    onClick={() => setPageIndex(pageIndex + 1)}
                >
                    <span>{"Next>>"}</span>
                </button>
            </div>
        </div>
    );
};

export default RegistrationList;