import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { createItem, GetItemById, listItem, RegisterNewPassenger, updateItem } from '../util/API_HUB';

const PassengerForm = () => {

    const Navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const passenger_id = searchParams.get("passenger_id");

    const RefForm = useRef(null);
    const [FormData, setFormData] = useState({
        passenger_id: "P" + Math.floor(10000 + Math.random() * 90000),
        passenger_name: "",
        passenger_dob: "",
        passenger_gender: "",
        passenger_email: "",
        passenger_mobile: ""
    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [Registered, setRegistered] = useState(false);

    useEffect(() => {
        if (passenger_id) {
            GetItemById("passenger", passenger_id).then((data) => {
                setFormData({
                    passenger_id: data.passenger_id,
                    passenger_name: data.passenger_name,
                    passenger_dob: data.passenger_dob,
                    passenger_gender: data.passenger_gender,
                    passenger_email: data.passenger_email,
                    passenger_mobile: data.passenger_mobile,
                });
            });
            setRegistered(true);
        }
    }, []);


    const handleUpdate = async (e) => {
        e.preventDefault();

        const hasErrors = Object.keys(FormData).some((key) => FormData[key] === "");
        if (hasErrors) {
            toast.error("Please fill the form correctly");
            return;
        }

        updateItem("passenger", passenger_id, FormData).then((status) => {
            if (status === 200) {
                toast.success("Passenger details updated successfully!");
                resetTheForm();
                Navigate("/profile");
            }
        })
    }


    const handleChanges = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    };

    const handleCredential = async (e) => {
        e.preventDefault();

        // Validate username
        if (username.length < 3 || username.length > 30) {
            toast.error("Username must be between 3 to 30 characters long!");
            return;
        }

        // Validate password
        if (password.length < 4 || password.length > 30) {
            toast.error("Password must be between 4 to 30 characters long!");
            return;
        } else if (password != confirmpassword) {
            toast.error("Password mismatch, please update correctly");
            return;
        }

        let registerData = {
            passenger_id: FormData.passenger_id,
            username,
            password,
            user_role: "ROLE_PASSENGER"
        }

        // console.log(registerData);

        RegisterNewPassenger(registerData).then((status) => {
            if (status === 201) {
                toast.success("Credential created successfully!");
                setRegistered(true);
            }
        });

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEmpty = Object.keys(FormData).some((key) => FormData[key] === "");
        if (isEmpty) {
            toast.error("All fields must be filled!");
            return;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(FormData.passenger_email);

        // Validate Mobile
        const isMobileValid = FormData.passenger_mobile.length == 10;

        // Validate DOB
        const birthDate = new Date(FormData.passenger_dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        const isAgeValid = age >= 15;

        // Validate Name
        if (FormData.passenger_name.length < 3 || FormData.passenger_name.length > 30) {
            toast.error("Passenger name must be between 3 to 30 characters long!");
            return;
        }

        // Display the error
        if (!isEmailValid) {
            toast.error("Enter a valid email address!");
            return;
        } else if (!isMobileValid) {
            toast.error("Enter a valid mobile number!");
            return;
        } else if (!isAgeValid) {
            toast.error("Enter a valid Age!");
            return;
        }

        // console.log(FormData);

        createItem("passenger", FormData).then((status) => {
            if (status === 201) {
                toast.success("Passenger added successfully!");
                resetTheForm();
                Navigate("/login");
            }
        });

    }


    const resetTheForm = () => {
        RefForm.current.reset();
        setFormData({
            passenger_id: "P" + Math.floor(10000 + Math.random() * 90000),
            passenger_name: "",
            passenger_dob: "",
            passenger_gender: "",
            passenger_email: "",
            passenger_mobile: ""
        });
        setUsername("");
        setPassword("");
        setConfirmPassword("");
    }



    return (
        <div className="formcontainer">
            {!Registered && (<div className='formelements'>
                <h2 className='form-title'>Passenger Credential</h2>
                <form ref={RefForm}>
                    <div className="formelements-field">
                        <label htmlFor="username">Username:</label>
                        <input type="text" name="username" id="username" autoComplete='off' required
                            onChange={(e) => { setUsername(e.target.value) }} />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" id="password" autoComplete='off' required
                            onChange={(e) => { setPassword(e.target.value) }} />
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
                </form>
            </div>)}
            {Registered && (<div className="formelements">
                <h2 className='form-title'>Passenger Signup</h2>
                <form ref={RefForm}>
                    <div className="formelements-field">
                        <label htmlFor="passenger_name">Name:</label>
                        <input type="text" name="passenger_name" id="passenger_name" autoComplete='off' required
                            value={FormData.passenger_name} onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="passenger_dob">Date of Brith:</label>
                        <input type="date" name="passenger_dob" id="passenger_dob" autoComplete='off' required
                            value={FormData.passenger_dob} onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="passenger_gender">Gender:</label>
                        <div>
                            <input type="radio" name='passenger_gender' className='form-radio' id='passenger_gender' value="Male"
                                checked={FormData.passenger_gender === "Male"} onChange={handleChanges} />
                            <span className='form-span'>Male</span>
                            <input type="radio" name='passenger_gender' className='form-radio' value="Female"
                                checked={FormData.passenger_gender === "Female"} onChange={handleChanges} />
                            <span className='form-span'>Female</span>
                        </div>
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="passenger_email">Email:</label>
                        <input type="text" name="passenger_email" id="passenger_email" autoComplete='off' required
                            value={FormData.passenger_email} onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="passenger_mobile">Mobile Number:</label>
                        <input type="text" name="passenger_mobile" id="passenger_mobile" autoComplete='off' required
                            value={FormData.passenger_mobile} onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <div></div>
                        {!passenger_id ?
                            (<button className='form-submitBn' onClick={(e) => { handleSubmit(e) }}>Submit</button>)
                            :
                            (<button className='form-submitBn' onClick={(e) => { handleUpdate(e) }}>Update</button>)
                        }
                    </div>
                </form >
            </div >)}
        </div >
    )
}


const RouteForm = () => {

    const Navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const routeInfo_id = searchParams.get("routeInfo_id");

    const RefForm = useRef(null);
    const [FormData, setFormData] = useState({
        routeInfo_id: "RI" + Math.floor(10000 + Math.random() * 90000),
        routeInfo_origin: "",
        routeInfo_destination: "",
        routeInfo_distance: "",
        routeInfo_traveltime: "",
    });

    const handleChanges = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    };

    useEffect(() => {
        if (routeInfo_id) {
            GetItemById("routes", routeInfo_id).then((data) => {
                setFormData({
                    routeInfo_id: data.routeInfo_id,
                    routeInfo_origin: data.routeInfo_origin,
                    routeInfo_destination: data.routeInfo_destination,
                    routeInfo_distance: data.routeInfo_distance,
                    routeInfo_traveltime: data.routeInfo_traveltime,
                });
            });
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const hasErrors = Object.keys(FormData).some((key) => FormData[key] === "");
        if (hasErrors) {
            toast.error("Please fill the form correctly");
            return;
        }

        updateItem("routes", routeInfo_id, FormData).then((status) => {
            if (status === 200) {
                toast.success("Route details updated successfully!");
                resetTheForm();
                Navigate("/routelist");
            }
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate data
        const isOk = Object.keys(FormData).some((key) => { FormData[key].length < 3 });
        if (isOk) {
            toast.error("All fields must be filled!");
            return;
        }

        // console.log(FormData);

        createItem("routes", FormData).then((status) => {
            if (status === 201) {
                toast.success("Route added successfully!");
                resetTheForm();
            }
        });

    }

    const resetTheForm = () => {
        RefForm.current.reset();
        setFormData({
            routeInfo_id: "RI" + Math.floor(10000 + Math.random() * 90000),
            routeInfo_origin: "",
            routeInfo_destination: "",
            routeInfo_distance: "",
            routeInfo_traveltime: "",
        });
    }

    return (
        <div className="formcontainer">
            <div className="formelements">
                <h2 className='form-title'>Register Route</h2>
                <form ref={RefForm}>
                    <div className="formelements-field">
                        <label htmlFor="routeInfo_origin">Origin:</label>
                        <input type="text" name="routeInfo_origin" id="routeInfo_origin" autoComplete='off' required
                            value={FormData.routeInfo_origin} onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="routeInfo_destination">Destination:</label>
                        <input type="text" name="routeInfo_destination" id="routeInfo_destination" autoComplete='off' required
                            value={FormData.routeInfo_destination} onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="routeInfo_distance">Distance:</label>
                        <input type="text" name="routeInfo_distance" id="routeInfo_distance" autoComplete='off' required
                            value={FormData.routeInfo_distance} onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="routeInfo_traveltime">Travel Time:</label>
                        <input type="time" name="routeInfo_traveltime" id="routeInfo_traveltime" autoComplete='off' required
                            value={FormData.routeInfo_traveltime} onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <div></div>
                        {!routeInfo_id ?
                            (<button className='form-submitBn' onClick={(e) => { handleSubmit(e) }}>Submit</button>)
                            :
                            (<button className='form-submitBn' onClick={(e) => { handleUpdate(e) }}>Update</button>)
                        }
                    </div>
                </form >
            </div >
        </div >
    )
}

const BusForm = () => {

    const Navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pbusId = searchParams.get("bus_id");

    const RefForm = useRef(null);
    const [bus_id, setbus_id] = useState("B" + Math.floor(10000 + Math.random() * 90000));
    const [bus_name, setbus_name] = useState('');
    const [ratePerKm, setratePerKm] = useState('');
    const [lower_left, setlower_left] = useState('');
    const [lower_right, setlower_right] = useState('');
    const [isUpperDeck, setisUpperDeck] = useState(false);
    const [isACBus, setisACBus] = useState(false);
    const [waterBottle, setwaterBottle] = useState(false);
    const [blanket, setblanket] = useState(false);
    const [chargingPoint, setchargingPoint] = useState(false);

    useEffect(() => {
        if (pbusId) {
            GetItemById("bus", pbusId).then((data) => {
                setbus_id(data.bus_id);
                setbus_name(data.bus_name);
                setlower_left(data.lower_left);
                setlower_right(data.lower_right);
                setratePerKm(data.ratePerKm);
                setisUpperDeck(data.isUpperDeck);
                setisACBus(data.isACBus);
                setwaterBottle(data.waterBottle);
                setblanket(data.blanket);
                setchargingPoint(data.chargingPoint);
            });
        }
    }, []);


    const handleUpdate = async (e) => {
        e.preventDefault();

        let numOfSeaterSeats = 0;
        let numOfSleeperSeats = 0;
        let SeaterRowCount = 12;
        let SleeperRowCount = 6;

        // seater 12
        // sleeper 6
        if (lower_left === "Seater" && lower_right === "Seater") {
            numOfSeaterSeats = (SeaterRowCount * 3);
        } else if (lower_left === "Sleeper" && lower_right === "Sleeper") {
            numOfSleeperSeats = (SleeperRowCount * 3);
        }

        if (lower_left === "Sleeper" && lower_right === "Seater") {
            numOfSleeperSeats = (SleeperRowCount * 1);
            numOfSeaterSeats = (SeaterRowCount * 2);
        } else if (lower_left === "Seater" && lower_right === "Sleeper") {
            numOfSleeperSeats = (SleeperRowCount * 2);
            numOfSeaterSeats = (SeaterRowCount * 1);
        }

        if (isUpperDeck) {
            numOfSleeperSeats = numOfSleeperSeats + (SleeperRowCount * 3);
        }

        let busData = {
            bus_id,
            bus_name,
            ratePerKm,
            lower_left,
            lower_right,
            numOfSeaterSeats,
            numOfSleeperSeats,
            isUpperDeck,
            isACBus,
            waterBottle,
            blanket,
            chargingPoint
        }

        const hasErrors = Object.keys(busData).some((key) => busData[key] === "");
        if (hasErrors) {
            toast.error("Please fill the form correctly");
            return;
        }

        updateItem("bus", pbusId, busData).then((status) => {
            if (status === 200) {
                toast.success("Bus details updated successfully!");
                resetTheForm();
                Navigate("/buslist");
            }
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let numOfSeaterSeats = 0;
        let numOfSleeperSeats = 0;
        let SeaterRowCount = 12;
        let SleeperRowCount = 6;

        // seater 12
        // sleeper 6
        if (lower_left === "Seater" && lower_right === "Seater") {
            numOfSeaterSeats = (SeaterRowCount * 3);
        } else if (lower_left === "Sleeper" && lower_right === "Sleeper") {
            numOfSleeperSeats = (SleeperRowCount * 3);
        }

        if (lower_left === "Sleeper" && lower_right === "Seater") {
            numOfSleeperSeats = (SleeperRowCount * 1);
            numOfSeaterSeats = (SeaterRowCount * 2);
        } else if (lower_left === "Seater" && lower_right === "Sleeper") {
            numOfSleeperSeats = (SleeperRowCount * 2);
            numOfSeaterSeats = (SeaterRowCount * 1);
        }

        if (isUpperDeck) {
            numOfSleeperSeats = numOfSleeperSeats + (SleeperRowCount * 3);
        }


        let busData = {
            bus_id,
            bus_name,
            ratePerKm,
            lower_left,
            lower_right,
            numOfSeaterSeats,
            numOfSleeperSeats,
            isUpperDeck,
            isACBus,
            waterBottle,
            blanket,
            chargingPoint
        }

        // console.log(busData);

        // Validate data
        const isOk = Object.keys(busData).some((key) => { busData[key] === "" });
        if (isOk) {
            toast.error("All fields must be filled!");
            return;
        }

        createItem("bus", busData).then((status) => {
            if (status === 201) {
                toast.success("Bus added successfully!");
                resetTheForm();
            }
        });

    }

    const resetTheForm = () => {
        RefForm.current.reset();
        setbus_id("B" + Math.floor(10000 + Math.random() * 90000));
        setbus_name("");
        setlower_left("");
        setlower_right("");
        setratePerKm("");
        setisUpperDeck(false);
        setisACBus(false);
        setwaterBottle(false);
        setblanket(false);
        setchargingPoint(false);
    }

    return (
        <div className="formcontainer">
            <div className="formelements">
                <h2 className='form-title'>Register Bus</h2>
                <form ref={RefForm}>
                    <div className='form-border'>
                        <div className="formelements-field-bus">
                            <label htmlFor="bus_name">Bus Name:</label>
                            <input type="text" name="bus_name" id="bus_name" autoComplete='off' required
                                value={bus_name} onChange={(e) => { setbus_name(e.target.value) }}
                            />
                        </div>
                        <div className="formelements-field-bus">
                            <label htmlFor="ratePerKm">Rate Per Km:</label>
                            <input type="text" name="ratePerKm" id="ratePerKm" autoComplete='off' required
                                value={ratePerKm} onChange={(e) => { setratePerKm(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className='form-lower'>
                        <div className='form-lower-title'>
                            <p>Lower Deck</p>
                            <div>
                                <select name="upper_Right" id="upper_Right" disabled>
                                    <option value={true}>Available</option>
                                    <option value={false}>Not Available</option>
                                </select>
                            </div>
                        </div>
                        <div className='form-side'>
                            <div className='form-lower'>
                                <p>Left Side</p>
                                <select name="lower_Left" id="lower_Left" required
                                    value={lower_left} onChange={(e) => { setlower_left(e.target.value) }}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Seater">Seater</option>
                                    <option value="Sleeper">Sleeper</option>
                                </select>
                            </div>
                            <div className='form-lower'>
                                <p>Right Side</p>
                                <select name="lower_Right" id="lower_Right" required
                                    value={lower_right} onChange={(e) => { setlower_right(e.target.value) }}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Seater">Seater</option>
                                    <option value="Sleeper">Sleeper</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='form-lower'>
                        <div className='form-lower-title'>
                            <p> Upper Deck</p>
                            <div>
                                <select name="upper_Right" id="upper_Right" value={isUpperDeck} onChange={(e) => setisUpperDeck(e.target.value)}>
                                    <option value={false}>Not Available</option>
                                    <option value={true}>Available</option>
                                </select>
                            </div>
                        </div>
                        <div className='form-side'>
                            <div className='form-lower'>
                                <p>Left Side</p>
                                <select name="upper_Left" id="upper_Left" value={isUpperDeck ? "Sleeper" : ""} disabled>
                                    <option value="">Select Type</option>
                                    <option value="Seater">Seater</option>
                                    <option value="Sleeper">Sleeper</option>
                                </select>
                            </div>
                            <div className='form-lower'>
                                <p>Right Side</p>
                                <select name="upper_Right" id="upper_Right" value={isUpperDeck ? "Sleeper" : ""} disabled>
                                    <option value="">Select Type</option>
                                    <option value="Seater">Seater</option>
                                    <option value="Sleeper">Sleeper</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='form-lower'>
                        <div className='formelements-checkboxs'>
                            <div className="formelements-amenities">
                                <input type="checkbox" name="ac" id="ac" autoComplete='off'
                                    checked={isACBus} onChange={(e) => {
                                        if (e.target.checked) {
                                            setisACBus(true);
                                        } else {
                                            setisACBus(false);
                                        }
                                    }}
                                />
                                <label htmlFor="ac">AC</label>
                            </div>
                            <div className="formelements-amenities">
                                <input type="checkbox" name="waterbottle" id="waterbottle" autoComplete='off'
                                    checked={waterBottle} onChange={(e) => {
                                        if (e.target.checked) {
                                            setwaterBottle(true);
                                        } else {
                                            setwaterBottle(false);
                                        }
                                    }}
                                />
                                <label htmlFor="waterbottle">Water Bottle</label>
                            </div>
                            <div className="formelements-amenities">
                                <input type="checkbox" name="blanket" id="blanket" autoComplete='off'
                                    checked={blanket} onChange={(e) => {
                                        if (e.target.checked) {
                                            setblanket(true);
                                        } else {
                                            setblanket(false);
                                        }
                                    }}
                                />
                                <label htmlFor="blanket">Blanket</label>
                            </div>
                            <div className="formelements-amenities">
                                <input type="checkbox" name="chargingPoint" id="chargingPoint" autoComplete='off'
                                    checked={chargingPoint} onChange={(e) => {
                                        if (e.target.checked) {
                                            setchargingPoint(true);
                                        } else {
                                            setchargingPoint(false);
                                        }
                                    }}
                                />
                                <label htmlFor="chargingPoint">Charging Port</label>
                            </div>
                        </div>
                    </div>
                    <div className="formelements-field">
                        <div></div>
                        {!pbusId ?
                            (<button className='form-submitBn' onClick={(e) => { handleSubmit(e) }}>Submit</button>)
                            :
                            (<button className='form-submitBn' onClick={(e) => { handleUpdate(e) }}>Update</button>)
                        }
                    </div>
                </form >
            </div >
        </div >
    )
}

const BookingForm = () => {

    const RefForm = useRef(null);
    const [FormData, setFormData] = useState({
        bookingInfo_id: "BI" + Math.floor(10000 + Math.random() * 90000),
        bus_id: "",
        bus_name: "",
        availableSeaterSeats: "",
        availableSleeperSeats: "",
        routeInfo_id: "",
        boardingDateTime: "",
        droppingDateTime: "",
        origin: "",
        destination: "",
        total_distance: "",
        travelTime: ""
    });
    const [ListOfBuses, setListOfBuses] = useState([]);
    const [ListOfRoutes, setListOfRoutes] = useState([]);
    const [TravelDateTime, setTravelDateTime] = useState();



    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {

        listItem("bus").then(data => setListOfBuses(data));
        listItem("routes").then(data => setListOfRoutes(data));

    }

    const handleChanges = (event) => {
        let selectDateTime = event.target.value;
        const ConvertToselectDateTime = new Date(event.target.value);
        const [hours, minutes, seconds] = TravelDateTime.split(":").map(Number);
        const totalMilliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);

        let calDropDateTime = new Date(ConvertToselectDateTime.getTime() + totalMilliseconds);
        const drop_year = calDropDateTime.getFullYear();
        const drop_month = String(calDropDateTime.getMonth() + 1).padStart(2, "0");
        const drop_day = String(calDropDateTime.getDate()).padStart(2, "0");
        const drop_hours = String(calDropDateTime.getHours()).padStart(2, "0");
        const drop_minutes = String(calDropDateTime.getMinutes()).padStart(2, "0");

        setFormData((prevData) => ({
            ...prevData,
            boardingDateTime: selectDateTime,
            droppingDateTime: `${drop_year}-${drop_month}-${drop_day}T${drop_hours}:${drop_minutes}`,
        }));

    };

    const handleSelectBus = (e) => {
        if (e.target.value) {
            const selectedBus = JSON.parse(e.target.value);
            setFormData((prevData) => ({
                ...prevData,
                bus_id: selectedBus.bus_id,
                bus_name: selectedBus.bus_name,
                availableSeaterSeats: selectedBus.numOfSeaterSeats,
                availableSleeperSeats: selectedBus.numOfSleeperSeats,
            }));
        }
    };

    const handleSelectRoute = (e) => {
        if (e.target.value) {
            const selectedRoute = JSON.parse(e.target.value);
            setFormData((prevData) => ({
                ...prevData,
                routeInfo_id: selectedRoute.routeInfo_id,
                origin: selectedRoute.routeInfo_origin,
                destination: selectedRoute.routeInfo_destination,
                total_distance: selectedRoute.routeInfo_distance,
                travelTime: selectedRoute.routeInfo_traveltime
            }));
            setTravelDateTime(selectedRoute.routeInfo_traveltime);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(FormData);
        const isEmpty = Object.keys(FormData).some((key) => FormData[key] === "");
        if (isEmpty) {
            toast.error("All fields must be filled!");
            return;
        }

        createItem("bookinginfo", FormData).then((status) => {
            if (status === 201) {
                toast.success("Bus Route added successfully!");
                resetTheForm();
            }
        });
    }


    const resetTheForm = () => {
        RefForm.current.reset();
        setFormData({
            bookingInfo_id: "BI" + Math.floor(10000 + Math.random() * 90000),
            bus_id: "",
            bus_name: "",
            availableSeaterSeats: "",
            availableSleeperSeats: "",
            routeInfo_id: "",
            boardingDateTime: "",
            droppingDateTime: "",
            origin: "",
            destination: "",
            total_distance: "",
            travelTime: ""
        });
    }



    return (
        <div className="formcontainer">
            <div className="formelements">
                <h2 className='form-title'>New Travel Route</h2>
                <form ref={RefForm}>
                    <div className="formelements-field">
                        <label htmlFor="busid">Bus ID:</label>
                        <select name="busid" id="busid" onChange={handleSelectBus} >
                            <option value="">Select Bus</option>
                            {ListOfBuses.map((element) => (
                                <option key={element.bus_id} value={JSON.stringify(element)}>
                                    {element.bus_id + " " + element.bus_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="busname">Bus Name:</label>
                        <input type="text" name="busname" id="busname" autoComplete='off' disabled
                            value={FormData.bus_name}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="availableSeaterSeats">Seater:</label>
                        <input type="text" name="availableSeaterSeats" id="availableSeaterSeats" autoComplete='off' disabled
                            value={FormData.availableSeaterSeats}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="availableSleeperSeats">Sleeper:</label>
                        <input type="text" name="availableSleeperSeats" id="availableSleeperSeats" autoComplete='off' disabled
                            value={FormData.availableSleeperSeats}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="busrouteid">Route ID:</label>
                        <select name="busrouteid" id="busrouteid" onChange={handleSelectRoute} >
                            <option value="">Select Route</option>
                            {ListOfRoutes.map((element) => (
                                <option key={element.routeInfo_id} value={JSON.stringify(element)}>
                                    {element.routeInfo_id + " " + element.routeInfo_origin + " " + element.routeInfo_destination}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="routeorigin">Origin:</label>
                        <input type="text" name="routeorigin" id="routeorigin" autoComplete='off' disabled
                            value={FormData.origin}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="routedes">Destination:</label>
                        <input type="text" name="routedes" id="routedes" autoComplete='off' disabled
                            value={FormData.destination}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="routedistance">Distance:</label>
                        <input type="text" name="routedistance" id="routedistance" autoComplete='off' disabled
                            value={FormData.total_distance ? FormData.total_distance + " KM" : ""}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="TravelDateTime">Total Travel Time:</label>
                        <input type="text" name="TravelDateTime" id="TravelDateTime" autoComplete='off' disabled
                            value={TravelDateTime}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="boardingDateTime">Boarding Date/Time:</label>
                        <input type="datetime-local" name="boardingDateTime" id="boardingDateTime" autoComplete='off'
                            onChange={handleChanges}
                        />
                    </div>
                    <div className="formelements-field">
                        <label htmlFor="droppingDateTime">Dropping Date/Time:</label>
                        <input type="datetime-local" name="droppingDateTime" id="droppingDateTime" autoComplete='off' disabled
                            value={FormData.droppingDateTime}
                        />
                    </div>
                    <div className="formelements-field">
                        <div></div>
                        <button className='form-submitBn' onClick={(e) => { handleSubmit(e) }}>Submit</button>
                    </div>
                </form >
            </div >
        </div >
    )
}


export { BookingForm, BusForm, PassengerForm, RouteForm };

