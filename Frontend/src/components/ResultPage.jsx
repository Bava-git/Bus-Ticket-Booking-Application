import axios from 'axios';
import { format } from 'date-fns';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as apihub from '../util/API_HUB';
import Popup from 'reactjs-popup';

import blocked_male_sleeper from '../assets/icons/bluegreysleeper.png';
import blocked_female_sleeper from '../assets/icons/pinkgreysleeper.png';
import blocked_female_seater from '../assets/icons/seat-fem-blocked.svg';
import blocked_male_seater from '../assets/icons/seat-male-blocked.svg';
import available_seater from '../assets/icons/seater_available.svg';
import available_female_seater from '../assets/icons/seater_fem.svg';
import selected_female_seater from '../assets/icons/seater_female_selected.svg';
import available_male_seater from '../assets/icons/seater_male.svg';
import selected_male_seater from '../assets/icons/seater_male_selected.svg';
import selected_seater from '../assets/icons/seater_selected.svg';
import available_sleeper from '../assets/icons/sl_available.svg';
import available_female_sleeper from '../assets/icons/sl_fem.svg';
import available_male_sleeper from '../assets/icons/sl_male.svg';
import selected_sleeper from '../assets/icons/sl_selected.svg';
import selected_female_slepeer from '../assets/icons/sl_selected_female.svg';
import selected_male_slepeer from '../assets/icons/sl_selected_male.svg';

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

    let token = sessionStorage.getItem("token") || "";
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
            let scheduleres = await axios.get(`http://localhost:3000/bookinginfo/getroutes`,
                {
                    params: { routeInfoId: routeInfo_id, boardingDateTime: travelDate + "T00:00:00" },
                    headers: {
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`
                    }
                });
            setBookingSchedule(scheduleres.data);

            apihub.listItem("bus").then(data => setBusDetails(data));
            apihub.listItem("busbookinginfo").then(data => setBusLogs(data));

            if (passenger_id) {
                apihub.listItem(`passenger/id/${passenger_id}`).then(data => setPassenger(data))
            };


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
            <div className="bus-card" key={element.bookingInfo_id}>
                <div className="bus-details">
                    <div className="bus-info">
                        <h2 className="bus-title">{element.bus_name}</h2>
                        <p className="bus-type">{features}</p>
                    </div>

                    <div className="price-info">
                        <p className="price">₹{Math.ceil(price)}</p>
                        <p className="price-note">per seat</p>
                    </div>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <img
                            className='detail-item-icon'
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE/UlEQVR4nO2bW4iVVRTHfxVFYZKNY/VQBKZNl4GsCFMHp3rsouU4EDVCFtkNXwyxBx8skyarlyQKokLThzIbosiX6qEUumgkBN30oTEorCAtmmxmzokF68Bi8d3P+S7ndP6wmTnn7L32Wv9vX9Zee33QOswD1unfvFBEH5lxGKgD37d5H5lRN6Wd+8iMLgF0CaBLAF0C6GgCZgO3AmuADa5Y5TbkVKL6EJ1uAXryMPx24CNg0ilRxSI6fggsb4Xh84D9FTAqa/kEmJvV+BuA3wLYFaEvAKMVK6LTvoBRKjYMpjX+auAvI+QfYAswh+rjPOAp4KTRX2xZkFTAucC4aTyepnGFIA/xqLHjR2BWkobPmEbHgEtoX8x301imSiTOByZMgxW0P4aNPX/rFAnFg6byZ3QOvjB23R9V8V1T8QE6Bw8Zu96JqvidqbgtR4+u6LLN2PVtFAF/VsB5ybuIjaGo/09KIgJGO6ykJqDT0CWALgG0JQE9eppbDazXbW29fh5MEQD5Re36uR0I6NPT5yGgFrOiTwNfAU9quzAMAC8BS6pMwGLg/Sa3OGm/KKsC9ZII6AV2hDxtOdd/DrwObNUtbat+lu//DWgjcrar3MoTMAD8FDCs9wDLgBkx7Wdo/E/qTzk5R+OGfNkEDGu0yfa7F7iqiRjmG06eyF9ZRQKG3RM7pmHtVkBGznEjW/oZqhIBA+7Jfw1c2OI+rjDX6Y2RIIts6QT0ujn/Q5bFKiHmOBLG9XKnVAJ2mD5OAP3ki8uAP0yfr5ZJwGK31clcLQLL3Ra5sCwC9rrVvki8afp+rwwC+tw+n3Wry4pLza5T05B5oQRsMbLFackLpwIjwN3AKe63t40OjxdNwKEC5v7pwC7Tz13u9zvMbweLJGC2WfxOJnBvs+AsndvWhjtdnbPN2UGmoVwDFkLA0pwvXM4BPnb6Px8wBfwlyUBRBNxn5Iof0ErIdd6XTvdNEfV3mnqriyLgUSP32QSL2CpdyOT/KFzsLnNkmq2NafOcqb+uKAI2GrmbY+qucqPltJB6l7vr70ltG4fNps3GKo6AEafHbuAMV+c64Fd363tbQl1KGQH3plgDZOF60ekiq/uZ+vuNeoZo/HY8ZQpMKWvAUiNXwlgkIME+KSkf6L4+4WII16TU5UAZu0CP7rtp/YAnnE51l/ISFQUOwsyy/AA0dN2QnSaH77EA478BLiI9VpTlCaJx+6xngbXGkzzQRLbaWJyvUM+RgD5jxFSG115uAh5uwo3uc6fBwP7t6irzpdWwlx4SvS0Se0zfkgoUCOtViaPRaiwqKSJkT4E19SMCYZOkHslJme1uD7+SfNHvRvYrUZXXmIqf5qRQr3NhD+eYgityj7itsydNouRQTootcfcCR3IYCf3OeLHr+iQNnzaNfg+LnbUAK93N0IlW5fjrnLfDfipN1ussHSqNxjJcryUfDAXcDe7WAGbWre4tJ28iS8rvgoB0efHNLyCfuwKbnd54YmP6JCWMFYWZauCYcbftnE807IMwGPDCxLS+QfKyelJpMzZHQsJUEjN8LSQ/YFLDWDv1KD2qf3fp90Gv8dR0tW/6/aG5AbG2ZouEq8OwUI++cWkxYaWmW3noPp8Vy/Q4OpkzAQ3M17j9wYBh7cu01tuU44JNA3J8vFlTzqXDtNmacp4PmgJxfcq5/R6NLMlUkr/yWb5P9BZIGP4DaJTptmfBmMgAAAAASUVORK5CYII="
                            alt="today"></img>
                        <span>{format(element.boardingDateTime, "dd-MM-yyyy")}</span>
                    </div>
                    <div className="detail-item">
                        <img
                            className='detail-item-icon'
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD5klEQVR4nO2bTUuVQRSAHwy8pqBgLrqpLUpcWC4ySO0PJNUfCPzaFUJFhqS7drWJ/kBo9g+CIkjLnW1Ls4VhG9OKbCGYCSnGxLkwHN/rx3tn3jtX3gcGLnLvmTNnvs45c4SUlJSUlJQkOQI0Aq1Ap7RW+VsZh5AGoA8YB2aADWA7T9uQ7zwFeoF6SpQKoB+YArZ2GfBezfz2rRgwQwlwFBgElvcY2LLM9LS0mX38Zgm4I30EyVXgS4Tim8Br4B7QAVTvIqNazgTz3Qn5rZa3AFwmIKpkf2tFF4Eh4HgBsrMiYzFC/pj0XVSagU9KsZ/AdaDcYT9G1g2Rbfc1BzRRJM4DP5RC5vSu9djnsYjVZnRoowiDX7WUWAO6E+y/R/rM9b+apBGa1cybZXkhhpwyGUhPTAeoHVix9PiexHaoUnveDL4lpqxeS44xQhxalBE+ApV4ZFwt+zgzn+O+Jct8jku72g6jeKJLHT5mBgnAAIZrSrcrOOaocnLMaU9ABtCr87O44864awk3e64uQAPUKj/hNo6oUH66cXII0ACGAUvmV1cBVL9yb8sDNkBGuc2FnlP/mbIEGr+cgA2A6JiTO+kimbElwv4WGNgkZYCsFUUa3U8UIqzPUtKEp5SAAZCZL9TJ2nG1mBi9VAwwrMLm2Mxagkwyo1QM0GnJ/hBXSBnwxxK0WyYnNANUW7LX42abT6ocnkvMdfXSkv/CQ9LzmyXfHOYHptUSYJKWLnkckeJ6LudMvnbQsNnevmcK3UfTuOVXhAH20w5yok9bvzNjCcoASzEN0J2kAVo9boEHEYN7BTzcpXUnvQUaPR6C5WKEJYkuH3k+BOtDvAZ9UuPiGtTLKNY+KhIXXThCSObHlyvskxFXOcJej8GQT97EvDl2UK/CYRNqho4Oh7MurTlE+Ay5XrV9nlJiPshILtBJLsAWantu5pU2VAbUZDnzLQY9pMVdo9PiN10/jCxYwk2mKDSeWfrN+6gpuqR8dycpZ0fopzFvJTRjVidr8jBZbEyq7rel1xPfz+Nz6jyI+zzuAv08PpNEFVmTKpBYKdJK6FCDN9HfqaQ6b4sokUnyTOhTy97oco6EaZOylG11O5hCJl/UqdM+N/OJDz7HaSlLsRVaEYfE5TWUEZn2ks/t+cSWfT4qJeTMVyiZdVAoabu39mkfVNlsl1RmaEU35a1uWJIqJluTjxpJZoxIEBZVKjsvPkmQVEhlRtSM6X07K5nbd/LZzuFt51lRt0qlajwjt8Kkg3L5CYnqQo5C99zHPeJFvleJVt3W5TujkslxWY8QDGXyVndWnJkO+dxwWP9lJiUlJSWFQPkHmYAZKHCWZDwAAAAASUVORK5CYII="
                            alt="clock--v1"></img>
                        <span>{format(element.boardingDateTime, "hh:mm")} - {format(element.droppingDateTime, "hh:mm")}</span>
                    </div>
                    <div className="detail-item">
                        <img
                            className='detail-item-icon'
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD6ElEQVR4nO2dS0tVURTH/2oFFfSa9RikWA2iQYOiUY9xj3GYmlSEplCzvkAv6wMUNSn8BlnNStCsKO0ThBIEkZGGr5TKE5t2QYt7rle795z1X3f9YA11799ad5993Q8P4DhOeUk8sJSoOHkLJmThBYGu8IKgygvi/IsXRBleEGV4QZSReX4mRYNbs2iUhG0iNyFXFeeVaLTXi/K3GI9Ebl4gAzoVfJVMSKI9i4KsAjCsQDZRHq8BrERGbAYwpEA6URpvYo4yJVS/A8AggCkFSUhyjqmYi/YsR8ZSkB1mJ2H3oRew5kMvYM2HXsCaD72ANR96AWs+9ALWfOgFrPnQC1jzoRew5kMvYM2HXsCaD72ANZ+fQqAWvNQJl+BGx4SQ2ABeNgmXLyBkREjsBi97hMs7EPJYSDSDl1bhEg4z0HFVSDwALz3C5QoIOSwkxgGsBh9rAHwVLgdB+s1kTIhcAB+dwuFTdKOkW8h8BLAePKwD8EE4XAMx4UTjvBC6Ax7uib7PAdgCcuQoCXEG+jlXoN/XYYC1AEaF2HcATdBLM4Afos8jcYI3wV4As0JwAcANZRNkDYDLBZZ9vgHYB2O0FhANMQCgMe/O4XcfBgr0L/S5BUZpio8rKT0bP5l1OY2K8ynHYcNjqw3GORYX5xIFo6UxZVT8WUA8iiphO4D+lETMALhU4eX62tjGTEof+mMfq4pij4ok3j7aVYF2GwD0pbSZ56NTDfUAnmaQoJpFPgDPAewsQzsmqPRoaShhVDDvaFaMhiKJC8/7i0tMXG38mbS5oi+26ZQwWiZTkhhuKe0o4feESflZkeL6qCiRGi+IHhr8kcUxqQ/+56ReX2S0+KS+jGTVERSdnrwSVJ/RB4AKXzpRxIl4AkX74uI4gOMwztmUPRGty+8LpCdlSuJ0FMx7VCxngypsrpniQDyxwbqFOwdgP4wQDjm8F4Jh1/AkuHY2R6MLPTcLPAbaSOa7REQY0bB2UO42eLgr+j7PflDulsGjpN0gZQWAz0Im/MMz9sPWY8q+iJTMkQKnOFivI0wIl0MwcGHnPnjpsXBh54mQOAVeWixcafNLn8qQ18CYvl1JNhZYeKTD/3GAMuRfuewk7D70AtZ86AWs+dALWPOhF7DmQy9gzYdewJoPvYA1H3oBaz70AtZ86AWs+dALWPOhF2DzCa/P64ovmpwu0OFqi2kAL+MefMhNpoSjMG8VJCFRGsNZvjYvVN+LgUVjKKvX53UpkE1IoiOPlxM/ZD/NV8ZTmr15vJxY3qPwN0Xn/PpuOSydnPPjBSmOF0QZXhBl5F4QDxQNLwh0hRcEusILAl3hOA7KxS/JE6PQJGCmJwAAAABJRU5ErkJggg=="
                            alt="empty-hourglass"></img>
                        <span>{hour}h {minutes}m</span>
                    </div>
                    <div className="detail-item">
                        <img
                            className='detail-item-icon'
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwUlEQVR4nO2csWoUURiFT2PKtGrWXt8joEawylNI4lPoa2itoI2+gYimUGvFsEVWsLAxGgSrI8JE5O4mE+7cmXvPv+eD2ySZf74v/87CNgsYY4wxxhhjjDHGGGOMMcasH7zgOQHwFsAegI0C990AsA/goJvNkU8r/r3kxL0HcHVAzBaADxMsoUX/XnKj3gG4lPnKqrkMVvbvZUjUvYyg/QaWwYr+xZgBeJkMf5Mx5yCZ8aJ7Cxgbdf+VXEtkfmTM+JnMmGE61P1XMvQRHO0RXhP/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9w8XRHH/cEEU9//HXQBfVwidngWAnYLXleZOdy9V/yW+nCN1eo4KXleahbj/En1SZz3CudeVRt0/XBDF/XvF+n4+9LrSqPuHC6K4f7ggivuHC6K4f7ggivuHC6KKPzNP6SBOfGr5eyFYg4UcFQhaVFxGTf/iC/kbc7tA0E43q8YyavqPTm5QK6j7hwuiuH+4IIr7hwuiuH+4IIr7hwtia/4seL6vmH9c+B4c8UzhP+lCnqyY/7SBfzQb8p9sId/O+Ga1Wfe72v9sNuI/+kKOu1fWeV9zt9X9TYtvX8cT+xtjJuFX8uhdHjDrSjLrBOOj7r/EYSJxc8CsW8mszxgfdf8lnicSDwbMepjMeobxUfdf4n4i8WrArNfJrD2Mj7r/EjcSid8ANjPmbHbX8r9zHeOj7n+h9+HdjBm7yYxDTIeE/5APOY8y7vd4og98bNS/lyHD5xlB8wYWwYr+vQwZ/jEj6FMDi2BF/16GvLq2M4K2G3lK5pX8jTHGGGOMMcYYY4wxxhhjsE78AQvvP/cReJW7AAAAAElFTkSuQmCC"
                            alt="aircraft-seat-middle"></img>
                        <span>{seats} Seats</span>
                    </div>
                </div>

                <div className="button-container">
                    <button className="view-seats-button" onClick={() => {
                        handleBusLayout(alocatedbus, element);
                        setShow(!Show);
                    }}>
                        <span className="button-text">View Seats</span>
                        <span className="material-symbols-outlined">&#8594;</span>
                    </button>
                </div>
            </div>
        );
    }

    // console.log(BusDetails);

    const selectedArr = [];
    const [LocalStore, setLocalStore] = useState([]);

    const [LowerLeft, setLowerLeft] = useState([]);
    const [LowerRight, setLowerRight] = useState([]);
    const [UpperLeft, setUpperLeft] = useState([]);
    const [UpperRight, setUpperRight] = useState([]);
    const [OtherContent, setOtherContent] = useState('');
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
            <div key={Bus.bus_id}>
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
                <p className='othercontent-title'>Payment method</p>
                <div className="othercontent-busdetails">
                    <div className="othercontent-field-paymenttype">
                        <div className='paymenttype'>
                            <input type="radio" name="payment" className='is_upi' id="" value="UPI" defaultChecked onChange={(e) => {
                                setpaymentshow(true);
                                setpaymentmethod("UPI");
                            }} />
                            <span className='form-span'>UPI</span>
                        </div>
                        <div className='paymenttype'>
                            <input type="radio" name="payment" className='is_card' id="" value="CARD" onChange={(e) => {
                                setpaymentshow(false);
                                setpaymentmethod("CARD");
                            }} />
                            <span className='form-span'>Card</span>
                        </div>
                    </div>
                </div>
            </div>
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
        setShow(!Show);
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

        const date = new Date();
        const mysqlFormat = date.toISOString().slice(0, 19);
        const pnr_Number = Math.floor(1000 + Math.random() * 9000);
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
                pnr_Number: pnr_Number,
                bookingInfo_id: bookingInfo_id,
                paymentType: paymentmethod,
                passenger_id: Passenger.passenger_id,
                booking_datetime: mysqlFormat,
                seat_num: seat,
            });

        });

        apihub.saveAllItem("passengerbookingInfo/add/all", passengerStorage)
            .then(passengerStorageStatus => {
                if (passengerStorageStatus === 201) {
                    apihub.saveAllItem("busbookinginfo/add/all", busStorage)
                        .then(busStorageStatus => {
                            if (busStorageStatus === 201) {
                                toast.success("Tickets are booked successfully!");
                                setTimeout(() => {
                                    Navigate("/history");
                                }, 1000);
                            }
                        });
                }
            });

    }

    const busFilters = [
        { key: "AC", value: "AC" },
        { key: "NON-AC", value: "NON-AC" },
        { key: "SEATER", value: "Seater" },
        { key: "SLEEPER", value: "Sleeper" },
        { key: "WATERBOTTLE", value: "Water Bottle" },
        { key: "BLANKET", value: "Blanket" },
        { key: "CHARGINGPOINT", value: "Charging Point" },
    ];

    return (
        <div className="resultpage">
            <div className="resultpage-filter">
                <div className="resultpage-filter-title">
                    <p>Filters</p>
                </div>
                {busFilters.map(element => (
                    <div className="filter-field" key={element.key}>
                        <input type="checkbox" name={element.key} id={element.key} className={element.key} onChange={(e) => {
                            if (!e.target.checked) {
                                fetchData();
                            } else {
                                handleFilter(e);
                            }
                        }} />
                        <p>{element.value}</p>
                    </div>
                ))}
                <button className='filter-title-clearbn' onClick={() => handleclear()}>Clear</button>
            </div>
            <div className="resultpage-results">
                {MyArr != 0 ? MyArr : (
                    <div className='errorDiv'>
                        <h1 className='errorMassage'>No bus available for {fromCity} to {toCity}</h1>
                    </div>)}
            </div>
            <Popup open={Show} onClose={() => !Show}
                contentStyle={{ maxHeight: '90dvh', overflowY: 'auto', scrollbarWidth: "thin" }}
                model>
                <div className="viewseats" id='viewseats'>
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
                                    src="data:image/png;base64,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"
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
                </div>
            </Popup>
        </div>
    )
}
export default ResultPage;