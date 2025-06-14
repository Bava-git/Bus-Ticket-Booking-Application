import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { GetItemById } from '../util/API_HUB';

const Profile = () => {

    const Navigate = useNavigate();
    const [Passenger, setPassenger] = useState('');
    let token = localStorage.getItem("token") || "";
    const decoded = jwtDecode(token);
    let passenger_id = decoded.userId;

    useEffect(() => {

        GetItemById("passenger", passenger_id).then((data) => {
            setPassenger(data);
        });

    }, [])

    return (
        <div className="profilecontainer">
            <div className="profilepage">
                <div className="profileseperator">
                    <div className='profilepersonal'>
                        <h4>Personal Informations</h4>
                        <div className='profilepersonal-field'>
                            <p>Name</p>
                            <p>{Passenger.passenger_name}</p>
                        </div>
                        <div className='profilepersonal-field'>
                            <p>DOB</p>
                            <p>{Passenger.passenger_dob}</p>
                        </div>
                        <div className='profilepersonal-field'>
                            <p>Gender</p>
                            <p>{Passenger.passenger_gender}</p>
                        </div>
                        <div className='profilepersonal-field'>
                            <p>Mobile</p>
                            <p>{Passenger.passenger_mobile}</p>
                        </div>
                        <div className='profilepersonal-field'>
                            <p>Email</p>
                            <p>{Passenger.passenger_email}</p>
                        </div>
                        <div className='profilepersonal-field'>
                            <button className='listcontainer-table-Bns' onClick={() => { Navigate("/changepassword") }}>Change Password</button>
                            <button className='listcontainer-table-Bns' onClick={() => { Navigate(`/passengerform?passenger_id=${passenger_id}`) }}>Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChangePassword = () => {

    const Navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const handleCredential = async (e) => {
        e.preventDefault();

        // Validate username
        if (username.length < 3 || username.length > 30) {
            toast.error("Username must be between 3 to 30 characters long!");
            return;
        }

        // Validate password
        if (newpassword.length < 4 || newpassword.length > 30) {
            toast.error("Password must be between 4 to 30 characters long!");
            return;
        } else if (newpassword != confirmpassword) {
            toast.error("Password mismatch, please update correctly");
            return;
        }

        let registerData = {
            username,
            oldPassword: oldpassword,
            newPassword: newpassword,
        }

        // console.log(registerData);

        try {

            let response = await axios.post("http://localhost:3000/user/changepassword", registerData, {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (response.status === 200) {
                toast.success("Password changed successfully!");
                Navigate("/profile");
            }

        } catch (error) {
            console.log("Change Password Form: " + error);
            // toast.error(error);
        }
    }

    return (
        <div className="formcontainer">
            <div className='formelements'>
                <h2 className='form-title'>Change password</h2>
                <div className="formelements-field">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" autoComplete='off' required
                        onChange={(e) => { setUsername(e.target.value) }} />
                </div>
                <div className="formelements-field">
                    <label htmlFor="password">Old Password:</label>
                    <input type="password" name="password" id="password" autoComplete='off' required
                        onChange={(e) => { setOldPassword(e.target.value) }} />
                </div>
                <div className="formelements-field">
                    <label htmlFor="password">New Password:</label>
                    <input type="password" name="password" id="password" autoComplete='off' required
                        onChange={(e) => { setNewPassword(e.target.value) }} />
                </div>
                <div className="formelements-field">
                    <label htmlFor="confirmpassword">Confirm Password:</label>
                    <input type="password" name="confirmpassword" id="confirmpassword" autoComplete='off' required
                        onChange={(e) => { setConfirmPassword(e.target.value) }} />
                </div>
                <div className="formelements-field">
                    <div></div>
                    <button className='form-submitBn' onClick={(e) => { handleCredential(e) }}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export { ChangePassword, Profile };

