import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { jwtDecode } from "jwt-decode";

import available_seater from '../assets/icons/seater_available.svg'
import available_sleeper from '../assets/icons/sl_available.svg'
import available_female_seater from '../assets/icons/seater_fem.svg'
import available_female_sleeper from '../assets/icons/sl_fem.svg'
import available_male_seater from '../assets/icons/seater_male.svg'
import available_male_sleeper from '../assets/icons/sl_male.svg'
import selected_seater from '../assets/icons/seater_selected.svg'
import selected_sleeper from '../assets/icons/sl_selected.svg'
import selected_male_seater from '../assets/icons/seater_male_selected.svg'
import selected_female_seater from '../assets/icons/seater_female_selected.svg'
import selected_male_slepeer from '../assets/icons/sl_selected_male.svg'
import selected_female_slepeer from '../assets/icons/sl_selected_female.svg'
import blocked_female_seater from '../assets/icons/seat-fem-blocked.svg'
import blocked_male_seater from '../assets/icons/seat-male-blocked.svg'
import blocked_female_sleeper from '../assets/icons/pinkgreysleeper.png'
import blocked_male_sleeper from '../assets/icons/bluegreysleeper.png'

const ResultPage = () => {

    const [searchParams] = useSearchParams();
    const fromCity = searchParams.get("fromCityName");
    const toCity = searchParams.get("toCityName");
    const travelDate = searchParams.get("onward");
    const isFemale = searchParams.get("female");
    const routeInfo_id = searchParams.get("rid");

    const [BusDetails, setBusDetails] = useState([]);
    const [BusLogs, setBusLogs] = useState([]);
    const [Show, setShow] = useState(false);

    const [UpperDeck, setUpperDeck] = useState(false);
    const [BookingSchedule, setBookingSchedule] = useState([]);
    const Navigate = useNavigate();

    let token = localStorage.getItem("token") || "";
    let passenger_id = "";
    if (token) {
        const decoded = jwtDecode(token);
        passenger_id = decoded.userId;
    }
    const [Passenger, setPassenger] = useState([]);

    const [bookingInfo_id, setbookingInfo_id] = useState('');
    const [booked_date, setbooked_date] = useState('');
    const [selectedbus, setselectedbus] = useState('');



    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            let scheduleres = await axios.get(`http://localhost:3000/bookinginfo`, {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            let temparr = scheduleres.data;
            let tempfilter = temparr.filter((element) => {
                return element.routeInfo_id === routeInfo_id;
            })
            setBookingSchedule(tempfilter)


            let busres = await axios.get(`http://localhost:3000/bus`, {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setBusDetails(busres.data);

            let buslogres = await axios.get(`http://localhost:3000/busbookinginfo`, {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setBusLogs(buslogres.data)

            if (passenger_id) {
                let passengerres = await axios.get(`http://localhost:3000/passenger/id/${passenger_id}`, {
                    headers: {
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                setPassenger(passengerres.data)
            }


        } catch (error) {
            console.log("ResultPage " + error);
        }
    }

    const MyArr = [];
    let length = BookingSchedule?.length ?? 0;
    for (let i = 0; i < length; i++) {
        const element = BookingSchedule[i];
        let [hour, minutes] = "";
        if (element.travelTime != undefined) {
            [hour, minutes] = element.travelTime.split(":").map(Number);
        }
        let features = "";
        let seats = 0;
        let price = 0;
        let alocatedbus = {};
        BusDetails.forEach((bus) => {
            if (bus.bus_id === element.bus_id) {
                alocatedbus = bus;
                price = bus.ratePerKm * element.total_distance;
                features = (bus.isACBus === true ? "AC " : "Non-AC ") + (bus.numOfSleeperSeats > 0 ? "Sleeper" : "Seater")
                seats = (bus.numOfSeaterSeats) + (bus.numOfSleeperSeats);

                let blockedSeats = BusLogs.filter((item) => {
                    return item.booked_date === format(element.boardingDateTime, "yyyy-MM-dd");
                })
                blockedSeats = blockedSeats.filter((id) => {
                    return id.bus_id === bus.bus_id;
                })

                seats = seats - blockedSeats.length;
            }

        });
        MyArr.push(
            <div className='resultpage-perbus' key={element.bookingInfo_id}>
                <div className='busdetails'>
                    <div className='bustitle'>
                        <p className='busname'>{element.bus_name}</p>
                        <p className='busamenities'>{features}</p>
                    </div>
                    <div className="bustimings">
                        <p className='busname'>{format(element.boardingDateTime, "dd-MM-yyyy")} - {format(element.droppingDateTime, "dd-MM-yyyy")}</p>
                        <p className='busname'>{format(element.boardingDateTime, "hh:mm")} - {format(element.droppingDateTime, "hh:mm")}</p>
                        <p className='busamenities'>{hour}h {minutes}m {seats} Seats </p>
                    </div>
                    <div className="busprice">
                        <p className='busname'>&#8377;{Math.ceil(price)}</p>
                    </div>
                </div>
                <div className="busBnDiv">
                    <button className='busBn-view' onClick={() => {
                        handleBusLayout(alocatedbus, element);
                        setShow(true);
                    }}
                    >View Seats</button>
                </div>
            </div>);
    }

    // console.log(BusDetails);

    const selectedArr = [];
    const [LocalStore, setLocalStore] = useState([]);

    const [LowerLeft, setLowerLeft] = useState([]);
    const [LowerRight, setLowerRight] = useState([]);
    const [UpperLeft, setUpperLeft] = useState([]);
    const [UpperRight, setUpperRight] = useState([]);
    const [OtherContent, setOtherContent] = useState('');
    const [email, setemail] = useState('');
    const [mobilenum, setmobilenum] = useState('');
    const [paymentmethod, setpaymentmethod] = useState("UPI");
    const [paymentshow, setpaymentshow] = useState(true);

    const handleBusLayout = (Bus, schedule) => {
        setbookingInfo_id(schedule.bookingInfo_id);
        setbooked_date(schedule.boardingDateTime);
        setselectedbus(Bus);
        // console.log(Bus);
        // console.log(schedule);
        let blockedSeatsArr = BusLogs.filter((element) => {
            return element.booked_date === format(schedule.boardingDateTime, "yyyy-MM-dd");
        })
        blockedSeatsArr = blockedSeatsArr.filter((element) => {
            return element.bus_id === Bus.bus_id;
        })
        // console.log(blockedSeats);

        let lowerleftseaterprice = Math.ceil(Bus.ratePerKm * schedule.total_distance);
        let lowerleftsleeperprice = Math.ceil((Bus.ratePerKm + 0.8) * schedule.total_distance);
        let lowerrightseaterprice = Math.ceil((Bus.ratePerKm - 0.2) * schedule.total_distance);
        let lowerrightsleeperprice = Math.ceil((Bus.ratePerKm + 0.4) * schedule.total_distance);

        let upperleftsleeperprice = Math.ceil((Bus.ratePerKm + 0.65) * schedule.total_distance);
        let upperrightsleeperprice = Math.ceil((Bus.ratePerKm + 0.1) * schedule.total_distance);

        setUpperDeck(Bus.isUpperDeck);

        let totalPrice = 0;
        selectedArr.forEach((seat) => {
            if (seat.substring(0, 2) === "LL" && Bus.lower_left === "Seater") {
                totalPrice = totalPrice + lowerleftseaterprice;
            } else if (seat.substring(0, 2) === "LL" && Bus.lower_left === "Sleeper") {
                totalPrice = totalPrice + lowerleftsleeperprice;
            }
            if (seat.substring(0, 2) === "LR" && Bus.lower_right === "Seater") {
                totalPrice = totalPrice + lowerrightseaterprice;
            } else if (seat.substring(0, 2) === "LR" && Bus.lower_right === "Sleeper") {
                totalPrice = totalPrice + lowerrightsleeperprice;
            }
            if (seat.substring(0, 2) === "UL") {
                totalPrice = totalPrice + upperleftsleeperprice;
            } else if (seat.substring(0, 2) === "UR") {
                totalPrice = totalPrice + upperrightsleeperprice;
            }
        });

        setOtherContent(
            <>
                <div className="othercontent-busdetails">
                    <div className="othercontent-field">
                        <p>Bus Name:</p>
                        <p> {Bus.bus_name}</p >
                    </div>
                    <div className="othercontent-field">
                        <p>Bording Date:</p>
                        <p> {booked_date ? format(booked_date, "dd-MM-yyyy") : ""}</p >
                    </div>
                    <div className="othercontent-field">
                        <p>Boarding Time/ Dropping Time:</p>
                        <p> {format(schedule?.boardingDateTime, "HH:mm")} - {format(schedule?.droppingDateTime, "HH:mm")}</p >
                    </div>
                    <div className="othercontent-field">
                        <p>Boarding point:</p>
                        <p>{schedule.origin}</p >
                    </div>
                    <div className="othercontent-field">
                        <p>Dropping point:</p>
                        <p>{schedule.destination}</p >
                    </div>
                </div>
                <div className="othercontent-busdetails">
                    <div className="othercontent-field">
                        <p>Seat No.:</p>
                        <p> {selectedArr.join(", ")}</p >
                    </div>
                    <div className="othercontent-field">
                        <p>Price:</p>
                        <p>&#8377;{totalPrice}</p>
                    </div>
                </div>
                <div className="othercontent-busdetails">
                    <div className="othercontent-field">
                        <p>Contact email: </p>
                        <input type="email" name="email" id="" onChange={(event) => setemail(event.target.value)} />
                    </div>
                    <div className="othercontent-field">
                        <p>Mobile Number: </p>
                        <input type="text" name="mobilenumber" id="" onChange={(event) => setmobilenum(event.target.value)} />
                    </div>
                </div>
                <p className='othercontent-title'>Payment method</p>
                <div className="othercontent-busdetails">
                    <div className="othercontent-field-paymenttype">
                        <div className='paymenttype'>
                            <input type="radio" name="payment" id="" value="UPI" defaultChecked onChange={(e) => {
                                setpaymentshow(true);
                                setpaymentmethod("UPI");
                            }} />
                            <label htmlFor="payment">UPI</label>
                        </div>
                        <div className='paymenttype'>
                            <input type="radio" name="payment" id="" value="CARD" onChange={(e) => {
                                setpaymentshow(false);
                                setpaymentmethod("CARD");
                            }} />
                            <label htmlFor="payment">Credit/Debit card</label>
                        </div>
                    </div>
                </div>
            </>
        );

        const leftseatnum = [];
        let leftseattype = Bus.lower_left;
        let leftRun = 1; // we can find it dont pass below if condition
        leftseattype === "Seater" ? leftRun = 12 : leftRun = 6;
        for (let i = 1; i <= leftRun; i++) {
            leftseatnum.push("LL" + i);
        }
        let AlreadyCreated = [];
        let BookedSeats = [];
        const maleholdSeat = [];
        const femaleholdSeat = [];
        blockedSeatsArr.map((bookedseat) => {
            let seat = bookedseat.bookedSeatNum;
            BookedSeats.push(seat);
            // if (BookedSeats.includes((Number(seat.substring(2)) - 1)) || BookedSeats.includes((Number(seat.substring(2)) + 1))) {
            ((bookedseat.passenger_gender === "Male") ?
                ((Number(seat.substring(2)) % 2 === 0) ?
                    maleholdSeat.push(seat.substring(0, 2) + (Number(seat.substring(2)) - 1)) : maleholdSeat.push(seat.substring(0, 2) + (Number(seat.substring(2)) + 1))) :
                ((Number(seat.substring(2)) % 2 === 0) ?
                    femaleholdSeat.push(seat.substring(0, 2) + (Number(seat.substring(2)) - 1)) : femaleholdSeat.push(seat.substring(0, 2) + (Number(seat.substring(2)) + 1)))
            )
            // }
        })
        setLowerLeft(leftseatnum.map((seat) => (
            blockedSeatsArr.length > 0 ? (
                blockedSeatsArr.map((blockedseats) => (blockedseats.bookedSeatNum === seat) ? AlreadyCreated.push(seat) && (
                    <div className='perseat' key={seat}>
                        < label className='blockedseats' >
                            {leftseattype === "Seater" ?
                                <><img src={blockedseats.passenger_gender === "Male" ? blocked_male_seater : blocked_female_seater} alt="" className='seater-icon' />
                                    <span className='perseatprice'>sold</span></>
                                : <>< img src={blockedseats.passenger_gender === "Male" ? blocked_male_sleeper : blocked_female_sleeper} alt="" className='sleeper-icon' />
                                    <span className='perseatprice'>sold</span></>}
                        </label>
                    </div >
                ) : (!BookedSeats.includes(seat) && !AlreadyCreated.includes(seat)) ? AlreadyCreated.push(seat) && (
                    <div className='perseat' key={seat} >
                        < label className='selector' >
                            <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                            {leftseattype === "Seater" ?
                                <><img src={selectedArr.includes(seat) ? selected_seater : available_seater} alt="" className='seater-icon' />
                                    <span className='perseatprice'>&#8377;{lowerleftseaterprice}</span></>
                                :
                                <><img src={selectedArr.includes(seat) ? selected_sleeper : available_sleeper} alt="" className='sleeper-icon' />
                                    <span className='perseatprice'>&#8377;{lowerleftsleeperprice}</span></>}
                        </label >
                    </div >
                ) : (<>
                </>)
                )
            ) : (
                <div className='perseat' key={seat} >
                    < label className='selector' >
                        <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                        {leftseattype === "Seater" ?
                            <><img src={selectedArr.includes(seat) ? selected_seater : available_seater} alt="" className='seater-icon' />
                                <span className='perseatprice'>&#8377;{lowerleftseaterprice}</span></>
                            :
                            <><img src={selectedArr.includes(seat) ? selected_sleeper : available_sleeper} alt="" className='sleeper-icon' />
                                <span className='perseatprice'>&#8377;{lowerleftsleeperprice}</span></>}
                    </label >
                </div >
            )
        )));




        const rightseatnum = [];
        let rightseattype = Bus.lower_right;
        let rightRun = 1;
        rightseattype === "Seater" ? rightRun = 24 : rightRun = 12;
        for (let i = 1; i <= rightRun; i++) {
            rightseatnum.push("LR" + i);
        }
        AlreadyCreated.length = 0
        setLowerRight(rightseatnum.map((seat) => (
            blockedSeatsArr.length > 0 ? (
                blockedSeatsArr.map((blockedseats) => (blockedseats.bookedSeatNum === seat) ? AlreadyCreated.push(seat) &&
                    (
                        < div className='perseat' key={seat} >
                            < label className='blockedseats' >
                                {rightseattype === "Seater" ?
                                    <><img src={blockedseats.passenger_gender === "Male" ? blocked_male_seater : blocked_female_seater} alt="" className='seater-icon' />
                                        <span className='perseatprice'>sold</span></>
                                    : <>< img src={blockedseats.passenger_gender === "Male" ? blocked_male_sleeper : blocked_female_sleeper} alt="" className='sleeper-icon' />
                                        <span className='perseatprice'>sold</span></>}
                            </label>
                        </div >
                    ) : (!BookedSeats.includes(seat) && !AlreadyCreated.includes(seat) && !maleholdSeat.includes(seat) && !femaleholdSeat.includes(seat)) ? AlreadyCreated.push(seat) && (
                        <div className='perseat' key={seat} >
                            < label className='selector' >
                                <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                                {rightseattype === "Seater" ?
                                    <><img src={selectedArr.includes(seat) ? selected_seater : available_seater} alt="" className='seater-icon' />
                                        <span className='perseatprice'>&#8377;{lowerrightseaterprice}</span></>
                                    :
                                    <><img src={selectedArr.includes(seat) ? selected_sleeper : available_sleeper} alt="" className='sleeper-icon' />
                                        <span className='perseatprice'>&#8377;{lowerrightsleeperprice}</span></>}
                            </label >
                        </div >
                    ) : (!BookedSeats.includes(seat) && !AlreadyCreated.includes(seat) && maleholdSeat.includes(seat)) ? AlreadyCreated.push(seat) && (
                        <div className='perseat' key={seat} >
                            < label className='selector' >
                                <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                                {rightseattype === "Seater" ?
                                    <><img src={selectedArr.includes(seat) ? selected_male_seater : available_male_seater} alt="" className='seater-icon' />
                                        <span className='perseatprice'>&#8377;{lowerrightseaterprice}</span></>
                                    :
                                    <><img src={selectedArr.includes(seat) ? selected_male_slepeer : available_male_sleeper} alt="" className='sleeper-icon' />
                                        <span className='perseatprice'>&#8377;{lowerrightsleeperprice}</span></>}
                            </label >
                        </div >
                    ) : (!BookedSeats.includes(seat) && !AlreadyCreated.includes(seat) && femaleholdSeat.includes(seat)) ? AlreadyCreated.push(seat) && (
                        <div className='perseat' key={seat} >
                            < label className='selector' >
                                <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                                {rightseattype === "Seater" ?
                                    <><img src={selectedArr.includes(seat) ? selected_female_seater : available_female_seater} alt="" className='seater-icon' />
                                        <span className='perseatprice'>&#8377;{lowerrightseaterprice}</span></>
                                    :
                                    <><img src={selectedArr.includes(seat) ? selected_female_slepeer : available_female_sleeper} alt="" className='sleeper-icon' />
                                        <span className='perseatprice'>&#8377;{lowerrightsleeperprice}</span></>}
                            </label >
                        </div >
                    ) : (<></>)
                )
            ) : (
                <div className='perseat' key={seat} >
                    < label className='selector' >
                        <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                        {rightseattype === "Seater" ?
                            <><img src={selectedArr.includes(seat) ? selected_seater : available_seater} alt="" className='seater-icon' />
                                <span className='perseatprice'>&#8377;{lowerrightseaterprice}</span></>
                            :
                            <><img src={selectedArr.includes(seat) ? selected_sleeper : available_sleeper} alt="" className='sleeper-icon' />
                                <span className='perseatprice'>&#8377;{lowerrightsleeperprice}</span></>}
                    </label >
                </div >
            )
        )));


        if (Bus.isUpperDeck) {

            const upperleftseatnum = [];
            let upperleftRun = 6; // we can find it dont pass below if condition
            let upperleftseattype = "";
            for (let i = 1; i <= upperleftRun; i++) {
                upperleftseatnum.push("UL" + i);
            }
            AlreadyCreated.length = 0
            setUpperLeft(upperleftseatnum.map((seat) => (
                blockedSeatsArr.length > 0 ? (
                    blockedSeatsArr.map((blockedseats) => (blockedseats.bookedSeatNum === seat) ? AlreadyCreated.push(seat) && (
                        <div className='perseat' key={seat}>
                            < label className='blockedseats' >
                                {upperleftseattype === "Seater" ?
                                    <><img src={blockedseats.passenger_gender === "Male" ? blocked_male_seater : blocked_female_seater} alt="" className='seater-icon' />
                                        <span className='perseatprice'>sold</span></>
                                    : <>< img src={blockedseats.passenger_gender === "Male" ? blocked_male_sleeper : blocked_female_sleeper} alt="" className='sleeper-icon' />
                                        <span className='perseatprice'>sold</span></>}
                            </label>
                        </div >
                    ) : (!BookedSeats.includes(seat) && !AlreadyCreated.includes(seat)) ? AlreadyCreated.push(seat) && (
                        <div className='perseat' key={seat} >
                            < label className='selector' >
                                <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                                {upperleftseattype === "Seater" ?
                                    <><img src={selectedArr.includes(seat) ? selected_seater : available_seater} alt="" className='seater-icon' />
                                        <span className='perseatprice'>&#8377;{upperleftsleeperprice}</span></>
                                    :
                                    <><img src={selectedArr.includes(seat) ? selected_sleeper : available_sleeper} alt="" className='sleeper-icon' />
                                        <span className='perseatprice'>&#8377;{upperleftsleeperprice}</span></>}
                            </label >
                        </div >
                    ) : (<>
                    </>)
                    )
                ) : (
                    <div className='perseat' key={seat} >
                        < label className='selector' >
                            <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                            {upperleftseattype === "Seater" ?
                                <><img src={selectedArr.includes(seat) ? selected_seater : available_seater} alt="" className='seater-icon' />
                                    <span className='perseatprice'>&#8377;{upperleftsleeperprice}</span></>
                                :
                                <><img src={selectedArr.includes(seat) ? selected_sleeper : available_sleeper} alt="" className='sleeper-icon' />
                                    <span className='perseatprice'>&#8377;{upperleftsleeperprice}</span></>}
                        </label >
                    </div >
                )
            )));

            const upperrightseatnum = [];
            let upperrightseattype = "";
            let upperrightRun = 12;
            for (let i = 1; i <= upperrightRun; i++) {
                upperrightseatnum.push("UR" + i);
            }
            AlreadyCreated.length = 0;
            setUpperRight(upperrightseatnum.map((seat) => (
                blockedSeatsArr.length > 0 ? (
                    blockedSeatsArr.map((blockedseats) => (blockedseats.bookedSeatNum === seat) ? AlreadyCreated.push(seat) &&
                        (
                            < div className='perseat' key={seat} >
                                < label className='blockedseats' >
                                    {upperrightseattype === "Seater" ?
                                        <><img src={blockedseats.passenger_gender === "Male" ? blocked_male_seater : blocked_female_seater} alt="" className='seater-icon' />
                                            <span className='perseatprice'>sold</span></>
                                        : <>< img src={blockedseats.passenger_gender === "Male" ? blocked_male_sleeper : blocked_female_sleeper} alt="" className='sleeper-icon' />
                                            <span className='perseatprice'>sold</span></>}
                                </label>
                            </div >
                        ) : (!BookedSeats.includes(seat) && !AlreadyCreated.includes(seat) && !maleholdSeat.includes(seat) && !femaleholdSeat.includes(seat)) ? AlreadyCreated.push(seat) && (
                            <div className='perseat' key={seat} >
                                < label className='selector' >
                                    <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                                    {upperrightseattype === "Seater" ?
                                        <><img src={selectedArr.includes(seat) ? selected_seater : available_seater} alt="" className='seater-icon' />
                                            <span className='perseatprice'>&#8377;{upperrightsleeperprice}</span></>
                                        :
                                        <><img src={selectedArr.includes(seat) ? selected_sleeper : available_sleeper} alt="" className='sleeper-icon' />
                                            <span className='perseatprice'>&#8377;{upperrightsleeperprice}</span></>}
                                </label >
                            </div >
                        ) : (!BookedSeats.includes(seat) && !AlreadyCreated.includes(seat) && maleholdSeat.includes(seat)) ? AlreadyCreated.push(seat) && (
                            <div className='perseat' key={seat} >
                                < label className='selector' >
                                    <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                                    {upperrightseattype === "Seater" ?
                                        <><img src={selectedArr.includes(seat) ? selected_male_seater : available_male_seater} alt="" className='seater-icon' />
                                            <span className='perseatprice'>&#8377;{upperrightsleeperprice}</span></>
                                        :
                                        <><img src={selectedArr.includes(seat) ? selected_male_slepeer : available_male_sleeper} alt="" className='sleeper-icon' />
                                            <span className='perseatprice'>&#8377;{upperrightsleeperprice}</span></>}
                                </label >
                            </div >
                        ) : (!BookedSeats.includes(seat) && !AlreadyCreated.includes(seat) && femaleholdSeat.includes(seat)) ? AlreadyCreated.push(seat) && (
                            <div className='perseat' key={seat} >
                                < label className='selector' >
                                    <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                                    {upperrightseattype === "Seater" ?
                                        <><img src={selectedArr.includes(seat) ? selected_female_seater : available_female_seater} alt="" className='seater-icon' />
                                            <span className='perseatprice'>&#8377;{upperrightsleeperprice}</span></>
                                        :
                                        <><img src={selectedArr.includes(seat) ? selected_female_slepeer : available_female_sleeper} alt="" className='sleeper-icon' />
                                            <span className='perseatprice'>&#8377;{upperrightsleeperprice}</span></>}
                                </label >
                            </div >
                        ) : (<></>)
                    )
                ) : (
                    <div className='perseat' key={seat} >
                        < label className='selector' >
                            <input type="checkbox" checked={selectedArr.includes(seat)} onChange={(event) => handleSelector(seat, event, Bus, schedule)} />
                            {upperrightseattype === "Seater" ?
                                <><img src={selectedArr.includes(seat) ? selected_seater : available_seater} alt="" className='seater-icon' />
                                    <span className='perseatprice'>&#8377;{upperrightsleeperprice}</span></>
                                :
                                <><img src={selectedArr.includes(seat) ? selected_sleeper : available_sleeper} alt="" className='sleeper-icon' />
                                    <span className='perseatprice'>&#8377;{upperrightsleeperprice}</span></>}
                        </label >
                    </div >
                )
            )));
        }
    }

    const handleSelector = (seat, event, Bus, schedule) => {

        if (event.target.checked) {
            selectedArr.push(seat);
        } else {
            const index = selectedArr.indexOf(seat);
            if (index !== -1) {
                selectedArr.splice(index, 1);
            }
        }
        setLocalStore(selectedArr)
        handleBusLayout(Bus, schedule);
    };

    const handleClose = () => {
        setShow(false);
        selectedArr.length = 0;
    }


    const handleFilter = (e) => {
        switch (e.target.id) {
            case "AC": {
                let ACfilter = BusDetails.filter((element) => {
                    return element.isACBus;
                })

                let Schedulefilter = [];
                for (let i = 0; i < BookingSchedule.length; i++) {
                    for (let j = 0; j < ACfilter.length; j++) {
                        if (BookingSchedule[i].bus_id === ACfilter[j].bus_id) {
                            Schedulefilter.push(BookingSchedule[i]);
                        }
                    }
                }
                setBookingSchedule(Schedulefilter);
            }
                break;
            case "NON-AC": {
                let ACfilter = BusDetails.filter((element) => {
                    return !element.isACBus;
                })

                let Schedulefilter = [];
                for (let i = 0; i < BookingSchedule.length; i++) {
                    for (let j = 0; j < ACfilter.length; j++) {
                        if (BookingSchedule[i].bus_id === ACfilter[j].bus_id) {
                            Schedulefilter.push(BookingSchedule[i]);
                        }
                    }
                }
                setBookingSchedule(Schedulefilter);
            }
                break;
            case "SEATER": {
                let ACfilter = BusDetails.filter((element) => {
                    return element.numOfSeaterSeats > 0;
                })

                let Schedulefilter = [];
                for (let i = 0; i < BookingSchedule.length; i++) {
                    for (let j = 0; j < ACfilter.length; j++) {
                        if (BookingSchedule[i].bus_id === ACfilter[j].bus_id) {
                            Schedulefilter.push(BookingSchedule[i]);
                        }
                    }
                }
                setBookingSchedule(Schedulefilter);
            }
                break;
            case "SLEEPER": {
                let ACfilter = BusDetails.filter((element) => {
                    return element.numOfSleeperSeats > 0;
                })

                let Schedulefilter = [];
                for (let i = 0; i < BookingSchedule.length; i++) {
                    for (let j = 0; j < ACfilter.length; j++) {
                        if (BookingSchedule[i].bus_id === ACfilter[j].bus_id) {
                            Schedulefilter.push(BookingSchedule[i]);
                        }
                    }
                }
                setBookingSchedule(Schedulefilter);
            }
                break;
            case "WATERBOTTLE": {
                let ACfilter = BusDetails.filter((element) => {
                    return element.waterBottle;
                })

                let Schedulefilter = [];
                for (let i = 0; i < BookingSchedule.length; i++) {
                    for (let j = 0; j < ACfilter.length; j++) {
                        if (BookingSchedule[i].bus_id === ACfilter[j].bus_id) {
                            Schedulefilter.push(BookingSchedule[i]);
                        }
                    }
                }
                setBookingSchedule(Schedulefilter);
            }
                break;
            case "CHARGINGPOINT": {
                let ACfilter = BusDetails.filter((element) => {
                    return element.chargingPoint;
                })

                let Schedulefilter = [];
                for (let i = 0; i < BookingSchedule.length; i++) {
                    for (let j = 0; j < ACfilter.length; j++) {
                        if (BookingSchedule[i].bus_id === ACfilter[j].bus_id) {
                            Schedulefilter.push(BookingSchedule[i]);
                        }
                    }
                }
                setBookingSchedule(Schedulefilter);
            }
                break;
            case "BLANKET": {
                let ACfilter = BusDetails.filter((element) => {
                    return element.blanket;
                })

                let Schedulefilter = [];
                for (let i = 0; i < BookingSchedule.length; i++) {
                    for (let j = 0; j < ACfilter.length; j++) {
                        if (BookingSchedule[i].bus_id === ACfilter[j].bus_id) {
                            Schedulefilter.push(BookingSchedule[i]);
                        }
                    }
                }
                setBookingSchedule(Schedulefilter);
            }
                break;

            default:
                fetchData();
                break;
        }
    }

    const handleclear = () => {
        window.location.reload();
    }

    const busStorage = [];
    const passengerStorage = [];

    const handleBooking = async () => {

        if (passenger_id === "") {
            toast.error("Please register before book the ticket");
            Navigate("/passengerform");
            return;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);

        // Validate Mobile
        const isMobileValid = mobilenum.length == 10;

        // Display the error
        if (!isEmailValid) {
            toast.error("Enter a valid email address!");
            return;
        } else if (!isMobileValid) {
            toast.error("Enter a valid mobile number!");
            return;
        }

        const date = new Date();
        const mysqlFormat = date.toISOString().slice(0, 19);
        LocalStore.forEach((seat) => {

            busStorage.push({
                bookedSeatNum: seat,
                bus_id: selectedbus.bus_id,
                booked_date: format(booked_date, "yyyy-MM-dd"),
                passenger_gender: Passenger.passenger_gender,
                busBookingInfo_id: "BBI" + Math.floor(10000 + Math.random() * 90000)
            });

            passengerStorage.push({
                passengerBookingInfo_id: "PBI" + Math.floor(10000 + Math.random() * 90000),
                pnr_Number: Math.floor(1000 + Math.random() * 9000),
                bookingInfo_id: bookingInfo_id,
                paymentType: paymentmethod,
                passenger_id: Passenger.passenger_id,
                passenger_name: Passenger.passenger_name,
                passenger_gender: Passenger.passenger_gender,
                passenger_mobile: mobilenum,
                passenger_email: email,
                booking_datetime: mysqlFormat,
                seat_num: seat,
            });

        });

        try {

            let blockseatres = await axios.post("http://localhost:3000/busbookinginfo/add/all", busStorage, {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            let passres = await axios.post("http://localhost:3000/passengerbookingInfo/add/all", passengerStorage, {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (blockseatres.status === 201) {
                if (passres.status === 201) {
                    toast.success("Tickets are booked successfully!");
                    setTimeout(() => {
                        Navigate("/history");
                    }, 1000);
                }
            }

        } catch (error) {
            console.log("Block seat & book ticket for passenger:", error);
            // if (error.response && error.response.status === 401) {
            //     alert("Session expired. Please log in again.");
            //     localStorage.removeItem("role");  // Remove invalid token
            //     localStorage.removeItem("token");  // Remove invalid token
            //     window.location.href = "/login";  // Redirect to login page
            // } else {
            //     console.error("API Error:", error);
            // }
        }

    }

    return (
        <div className="resultpage">
            <div className="resultpage-filter">
                <div className="resultpage-filter-title">
                    <p>Filters</p>
                    <button className='filter-title-clearbn' onClick={() => handleclear()}>Clear</button>
                </div>
                <div className="filter-field">
                    <input type="checkbox" name="AC" id="AC" onChange={(e) => {
                        if (!e.target.checked) {
                            fetchData();
                        } else {
                            handleFilter(e);
                        }
                    }} />
                    <p>AC</p>
                </div>
                <div className="filter-field">
                    <input type="checkbox" name="nonac" id="NON-AC" onChange={(e) => {
                        if (!e.target.checked) {
                            fetchData();
                        } else {
                            handleFilter(e);
                        }
                    }} />
                    <p>Non-AC</p>
                </div>
                <div className="filter-field">
                    <input type="checkbox" name="Seater" id="SEATER"
                        onChange={(e) => {
                            if (!e.target.checked) {
                                fetchData();
                            } else {
                                handleFilter(e);
                            }
                        }}
                    />
                    <p>Seater</p>
                </div>
                <div className="filter-field">
                    <input type="checkbox" name="Sleeper" id="SLEEPER"
                        onChange={(e) => {
                            if (!e.target.checked) {
                                fetchData();
                            } else {
                                handleFilter(e);
                            }
                        }}
                    />
                    <p>Sleeper</p>
                </div>
                <div className="filter-field">
                    <input type="checkbox" name="waterBottle" id="WATERBOTTLE"
                        onChange={(e) => {
                            if (!e.target.checked) {
                                fetchData();
                            } else {
                                handleFilter(e);
                            }
                        }}
                    />
                    <p>Water Bottle</p>
                </div>
                <div className="filter-field">
                    <input type="checkbox" name="Blanket" id="BLANKET"
                        onChange={(e) => {
                            if (!e.target.checked) {
                                fetchData();
                            } else {
                                handleFilter(e);
                            }
                        }}
                    />
                    <p>Blanket</p>
                </div>
                <div className="filter-field">
                    <input type="checkbox" name="chargingPoint" id="CHARGINGPOINT"
                        onChange={(e) => {
                            if (!e.target.checked) {
                                fetchData();
                            } else {
                                handleFilter(e);
                            }
                        }}
                    />
                    <p>Charging Point</p>
                </div>
            </div>
            <div className="resultpage-results">
                {MyArr}
            </div>
            {Show && (<div className="viewseats" id='viewseats'>
                <div className='viewseats-title'>
                    <div className='title-traveldetails'>
                        <span>{fromCity}</span>
                        <span>&#8594;</span>
                        <span>{toCity}</span>
                    </div>
                    <div className='title-closebndiv'>
                        <button className='closebn' onClick={() => { handleClose() }}>X</button>
                    </div>
                </div>
                <div className='deck'>
                    <div className="lowerdeck">
                        <div className="lowerdeck-field-title">
                            <p>Lower deck</p>
                            <img className='steering-icon'
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAANmUlEQVR4nO1debCWVR1+7goTi7Ev4gJE/ZEXMoJ7WQQR08iADLXMJSEMogQxHUpvhDYjaoshtkoLekNzSm2RLf2nnBorESlEWSwLDJJ7uYH3Xu7C9zW/5mHmeuZ3znve7Vvge2bOzF3OOe9537P8nt9yzgFKKKGEEkoo4dRFDwDjAFwJoB5AA4A/ANgBYB+AJgDtTE382w7meQTAHSw7FkB1vl+mGFEBYDyAFQB+C6ANQDah1AngLwDuAXBxqYPsKAMwDcA6AM0JdkBQOgLgIQAXsA2nPYYCWAXgtRx2QtaS9rEtQ07HXjkHwIMhlqN/APgNgK8D+AyA6QDOAzASQD8uPdX8eRSAGuaRvN8A8DTr8HlWK4C1AM7GaYAzAfwIQEfAR/k3BfJ8AOcm+HypawGJwcGANrRzCR2OUxCVAJYB+K/jA7QBeBzAbOZPG+UApgL4PoBjjna9xaXslGFokwG8FLB2y9LSJ49tlGcvCpBl2wFMQhGjjNS1y/KCe9kRuZgNYWaN6CwvW9qcIWUWal507OlZy0sdBrCQL1+oKOdgabS8wzPFxMYusAjMDIXkwBjK4qcB3AvgKQ9N/UnmXcCyUUb1IJKQjPI+bwCYggLHXNJGs/H7SUPDMrKlAH6VkLJ4hB15UwTmNAPAAQtFFhJSkFhA04TZ6E0caT7oCeBaAFscsieJJHVvBnANn+mDwWyXWVcn6XlB4RZlWmdo2PORFb0BfIHLQDbH6Q22v5dHO+Vdvmx51+UooJlhNrCDIz0IlfwYhz0+3H4ATwD4EoCrAEzg0tOP8qGCP5/J/0me2ylLtOXGTG8CuNmT9V2vKLeZQpgpc5VlShSpWR5lp1L42j5QBsDvAdwKYEwCbX03gNsAPGcR0t31DdGdgvBhAC3K8jU7n2yqVemMKR7+jTWOj9II4Gv8gGnhPbSLNTkGw/0e2vlUpVNaPDs0cT3DpLYdHjNDDH9/dnREPYC+yB3OALDS0THP04AZNFM6FLkkJCAnqFCUvoyHzJhhoa8nAHwPQH/kDwPoFzmhtK/Jg7Jfr8z4rblSflcpjRY25cI8AMeVcnsA1KFwMJmKpWb4vDyg7EqlXH0uGtyl6BnlASxM0yka8mxQtEGWzJ8q7e0KYFHlnBVmmVqkBKGDLyp+C5EnLhZmdkaGs6zQsUxZwuT3KxxlBisU+6W0DKi3KB92eoDMMJepdi5fxYIrFYHdFvDeFynyRExAiUKUraPGQ8RQ6GJTzUpnzEHx4XKlU5oC2NePjfzimBuWZKN+aDzgsMNq20OhtkFTvdDxcWXUP+/QUwYppvsfJBmQYI4Q8WfYsEYRiOKoKnbcrrzXNx35FykrxIgkGvKgUfFOB6uaqoykDTh18DNFjk5y6GuvGPllsMbCEMU8YlMAK2kH6p73nzT4nSo4A8DfjXfc4WBRNyiEYFiSSuBex8M1FibRiEliOAfEWoaZ7qWA7WBq4t/kf98G8CkuuUlieggWVaUETogCGTlIwaxM1kWbP8M0of8EyY3KZQD+pKzhvumvlAFJMZ2Hjfr/4/CnfFaxTkQKW52mWHJtmvWtRt7mBIxrAwF8NeFY3+NkO3HN+UMVNWC5Q/M3LcKRfPHrjEokklBDT8XTJx8yKvoAWB0QvBY3CQ1/DMDoGO2826jzACm/hg1GXjGmhkKlMjI/aMl7rZHvKK2nYVEG4LoA714H5UM9zd7vImmoZOrHv82iZ3FTQPxwO/0i74w4g81Bc7Ul74eMfI1ho2AmKTYrWwWm419ocljUcYNN1uG+XR4xhOgMhg/tDHDfLo0QLvodo56Nlnzy7Q4ZeSeGedAdimXWZlIxjYey28kXo8jtbd7DfwH4nGMpCINymkFsDrIsGdpVIYTu+YoLd6jnsvXFMI03HVBiQtewzMj3QogZ8ZgjCr4NwJ0A3oHkUUZTiGt7goSSLvaMRDEt4DKANCw08omp3gs9lHXXtiXglyE49lkAltAG5BK4T3q4TatoG5OZu4sM8Bh/buD/JI8LPSlnTLbUPTXRtz7VYZ34ilFGImNsq0H3fK2+S+RYo6BoprZ18YiRdwYfPJ7Lw23k7LsDOiHLjprm0b65nvXtZt4gDKJJoz2gviPc+CMz95OUs0IgZioC29Z5rxt5ZdORlw+geyHZuaThAx4fxSft9Fy3y0mHw9SdIT318W2P4uAJ2kzkk95vecZGI5+Xb6jeKCRbwjQsiNHgLnb0ZSEE6OoYz5NO8YVsZbtPYUVhktiwNNxv5BPrQSAajEI3WvLdG7KRbaTIN5GdhcFchYm18QUnUvj24s/fUmRgJoJzrIpl1nlsfzOTDB4fk7zMyEA8ZxSyuSufUihfE9nL3wD8mkbAz/NDRd0SVqXIjNcD1t8aWpq7l9ntIehdGEPFVYL4fgFgG219J42bPoJ9hpFPIjMDYYZ32l7c3KaWtGX3JK5QZoaPMKxRfPppeS1Nu59QYR/CJN8wEKa9/xzPfF6MIQIajOfIMuWLNZ72uLg4z3iOzBwNIz3zvQ2mGX2AZ760tg+/YjxHItt9UWuUlbrSwHDFFKNhoGe+t8Hk49We+Xw3voTFMeM54nvxRW+jrNSVBnoaz5Gl0qZ0++RLpEPS2sd9NEaH9FXCcdJAdZodEnXJimJyj7JkTQxRti5HS9aANJesqEI9ad+1TaiLnuGLB3Ik1M9NU6hHpb21OaS9NR7lxuWQ9talSXtNxfBCT8XQZ09hkophjaPM2BQUQxeu81QMLzLy/c6n8keMQnKigY/pRKygaWGuYjo5Tj2jjoK+N39+QJkZUUwnYXCnp+lksZFvfaEYF7untyhst9BNK1ZXn6CCJIyLQ/mRNnbzqyTxTokaF33N7+MTanxWGc0bFCdVOT9sJgHz+yDa2ZIwtWtJXLuJmd9rjEJiLPR1UCWZ2njSgok5IRxU2jI103GoTBLJ5aAy5dp7fTqkhxLPO9JTsKcxW+o9XLjHmF6mDLS5cG+wHP+RZBJLsIbRRr6WMMr0M55BDks96Z4LvegKna/s0TvZKbZ4pzCYaemMfdwuURPSCmALcpC4AQ03Rg1y0PZCNDiMamYYkLh24364g0adrR6BDy5oG2hOMEAhTojRBKPOTsc5Wo/G2TNjBsoddATKbTbyyhmGcTFScaF6edcsWKt0RhKz7iGjXgmC0FDJgOyoVuv/V2AK7Estea8x8h2NGJpp4hLlI0aZJcMUNiUzIy76K5boT1jyzoobSqr1fkOIYGs5lzAJPGvUK4F5YbFYkRlJRELep4S79vBcrr4b9XAZkxX08dys0xohkMFH+ZTg6bB4Os7a7Qj6a/McLH0V1hrpcJoy5ZgJGW02pvSmkVd27sbFGKPOVxMw3/sYJoNgbns+5Ah7XZLUhh0tTHKfY0vbzQpdlRsI4qC3Ip/iOrjiHudxqWItkMgaDVWKm0JOpEt006ecfKOhQuHkBxJwXGWNlOvy3dGPEfm+R2fMT3rTp0YZdzlMA1OU0SPHh58qHfJzhfnVOQboqzGca87QynZPk7xm0Yw7TbMF0iHasVSy+wqemz2PJ0R0VArc6Dj6tVrZcpBxmF+KoUMWKvX80eHwGqycUhd6X6ELw5WbDeTEZxtGKg3qjOgkyua5Q7SDPhsDYgjWG/mbA46xigSNRUmsqg3TFa4e5dDhbB47ZKHSGW3U0Vy2OF8WFgsaizoY0PNzLBbWe4qgQ1YoZbsCnEqDFavFC2nepjBJse5uCdgQM99yxN/jngdfZnPcIQPo09A6w+aaBb+B6bboDLvbNgpWRmBRH7PsF9/v2P+ejw65xLJPXtr+0QgszMtnHhfaSMg4FMaTuNByPm6GBGFEHjvkLJpDNH99Y4DMAGeOWXZzLu9I0Q577PIYRWc7Dghopy9lUA47pB/lmXbFRpZ72m1RMCdxmSIngw4HTQVTlBdp4RZiF6p5EpsteuQYD4iZkGKHTKRuZTtP5QSVvqqIR43n7Szi2croaOE5JD4EwWRtWSNp/w8Lnzq7p22eH/QjlsP4ZcbkFfMt11UEyRSQDi5V3JtZR7qLYau1XE60iyVrmeeuEPUeor7gQ1G16JUMD0wrCCy3XHKy0lOw9WIdB0J8wKTSfjqXfI7xKCeb0t5VFOeCgi3maWuIw8x68JSEjSlfedRJT+LVIdy5QxR2ebKugpkZmkwx19UstVeJ/A6DoTzI5YmEIg0bqfAtiXDl3UwyJ7POlkKQGUGYbLlLKkOu73tBmLlUnE95tZqd9CI9mI3drs1r5N+28eOv5sx9X0SdYDANhRnLUldINzsEvshWx0hdVOAXS1bQn2G76GVzxIGVV5RRWHYE3IGb1iaaKKgiO9xlaXMXhXohD6ZA1HIJsa3tr3E09s1jG/tStpgBCabVNnVDYa7vlm32vL67Kkdtupghqq6NOs2c6UV3IbEPhtEs0u6hpG2ggyjIlhQGoxmF/qiHMnqcbtec26TygRHcH2gz6mWVTZ6baANbRE/lWHZW/26aen/+bRzzLGbQxSZls4wttTA6JLGAhGLCEGrzexLQM7Ix0x76dXJ23V2hM7IpNL/bqGYaqZGBzzm/CLKYUMENpSt4CJoZ7RIntfJk7FUU6IVEuYsG1TxNYh5dog/zcIPtDk19O/OsZ5l5rCOtA3JKKKGEEkooAfnG/wBDd7YmEmpglgAAAABJRU5ErkJggg=="
                                alt="steering-wheel"></img>
                        </div>
                        <div className='lowerdeck-seats'>
                            <div className="lowerdeck-leftside">
                                {LowerLeft}
                            </div>
                            <div className="lowerdeck-rightside">
                                {LowerRight}
                            </div>
                        </div>
                    </div>
                    {UpperDeck && (<div className="lowerdeck">
                        <div className="lowerdeck-field-title">
                            <p>Upper deck</p>
                        </div>
                        <div className='lowerdeck-seats'>
                            <div className="lowerdeck-leftside">
                                {UpperLeft}
                            </div>
                            <div className="lowerdeck-rightside">
                                {UpperRight}
                            </div>
                        </div>
                    </div>)}
                    <div className='busdetails-payment'>
                        {OtherContent}
                        {paymentshow && (<div className="othercontent-busdetails">
                            <div className="othercontent-field">
                                <p>UPI</p>
                                <input type="text" name="" id="" placeholder='UPI id' />
                            </div>
                        </div>)}
                        {!paymentshow && (<div className="othercontent-busdetails">
                            <div className="othercontent-field">
                                <p>Card Number</p>
                                <div className='expirydate'>
                                    <input type="text" name="" id="" />
                                    <input type="text" name="" id="" />
                                    <input type="text" name="" id="" />
                                    <input type="text" name="" id="" />
                                </div>
                            </div>
                            <div className="othercontent-field">
                                <p>Expiry Date</p>
                                <div className='expirydate'>
                                    <input type="text" name="" id="" placeholder='MM' />
                                    <input type="text" name="" id="" placeholder='YYYY' />
                                </div>
                            </div>
                            <div className="othercontent-field">
                                <p>CCV</p>
                                <div className='ccv'>
                                    <input type="text" name="" id="" placeholder='CCV' />
                                </div>
                            </div>
                        </div>)}
                        <div className="othercontent-field">
                            <div></div>
                            <button className='bookticketBn' onClick={(e) => { handleBooking(e) }}>Book Ticket</button>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    )
}
export default ResultPage;