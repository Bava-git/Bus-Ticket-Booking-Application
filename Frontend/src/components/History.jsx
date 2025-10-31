import { format, isAfter } from "date-fns";
import html2pdf from "html2pdf.js";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { listItem } from '../util/API_HUB';
import * as supUtil from '../util/supportUtils';

const History = () => {

    const [PassengerHistory, setPassengerHistory] = useState([]);
    const [ViewMode, setViewMode] = useState('upcoming');

    let token = sessionStorage.getItem("token") || "";
    const decoded = jwtDecode(token);
    let passenger_id = decoded.userId;
    const Navigate = useNavigate();
    let getTitles = [];

    useEffect(() => {
        if (passenger_id) {
            listItem(`passengerbookingInfo/pid/${passenger_id}`).then((data) => {
                handleTableData(data);
            });
        };
    }, [ViewMode]);

    const handleTableData = async (data) => {

        data = supUtil.groupingItems(data, "pnr_Number");
        getTitles = Object.keys(data);
        let length = getTitles?.length ?? 0;
        const mainArr = [];
        for (let i = 0; i < length; i++) {
            let bookingInfo = "";
            const passengerBookingData = data[getTitles[i]];
            let allSeatNumbers = passengerBookingData.map(item => item.seat_num).join(', ');
            await listItem(`bookinginfo/id/${passengerBookingData[0].bookingInfo_id}`).then(data => bookingInfo = data);
            let isExried = isAfter(new Date(bookingInfo?.boardingDateTime), new Date());

            if (ViewMode === "upcoming" && isExried) {
                mainArr.push(
                    {
                        prnNumber: passengerBookingData[0]?.pnr_Number,
                        busName: bookingInfo?.bus_name,
                        busOrigin: bookingInfo?.origin,
                        busBoardingDateTime: bookingInfo?.boardingDateTime,
                        busDestination: bookingInfo?.destination,
                        busDroppingDateTime: bookingInfo?.droppingDateTime,
                        allSeatNumbers: allSeatNumbers
                    }
                );
            } else if (ViewMode === "past" && !isExried) {
                mainArr.push(
                    {
                        prnNumber: passengerBookingData[0]?.pnr_Number,
                        busName: bookingInfo?.bus_name,
                        busOrigin: bookingInfo?.origin,
                        busBoardingDateTime: bookingInfo?.boardingDateTime,
                        busDestination: bookingInfo?.destination,
                        busDroppingDateTime: bookingInfo?.droppingDateTime,
                        allSeatNumbers: allSeatNumbers
                    }
                );
            }


        };
        setPassengerHistory(supUtil.safeSortAscending(mainArr, "busBoardingDateTime"));

    }

    const handleNavigation = (id) => {
        Navigate(`/print?id=${id}`);
    }

    return (
        <div className="historyContainer" >
            <div className="historyContainer-header">
                <h3 className='history-title'>Past Bookings</h3>
                <div className='switchHistory'>
                    <div className='switchDiv'>
                        <input type="radio" name="couple" id="upcoming" value="upcoming" defaultChecked
                            onChange={() => setViewMode("upcoming")}
                        />
                        <span>Upcoming</span>
                    </div>
                    <div className='switchDiv'>
                        <input type="radio" name="couple" id="past" value="past"
                            onChange={() => setViewMode("past")}
                        />
                        <span>Past</span>
                    </div>
                </div>
            </div>
            <div className="historyList" >
                <table className="table-full text-left">
                    <thead className="thead-bg">
                        <tr>
                            <th className="th-cell">PNR</th>
                            <th className="th-cell">Bus Name</th>
                            <th className="th-cell">Origin</th>
                            <th className="th-cell">Departure Date/Time</th>
                            <th className="th-cell">Destination</th>
                            <th className="th-cell">Droping Date/Time</th>
                            <th className="th-cell">Seat Numbers</th>
                            <th className="th-cell">Status</th>
                        </tr>
                    </thead>
                    <tbody className="tbody-divider">
                        {
                            PassengerHistory?.length > 0 ?
                                (
                                    PassengerHistory.map((element, index) => (
                                        <tr key={index} onClick={() => handleNavigation(element.prnNumber)}>
                                            <td className="td-cell">{element.prnNumber}</td>
                                            <td className="td-cell">{element.busName}</td>
                                            <td className="td-cell">{element.busOrigin}</td>
                                            <td className="td-cell">{format(element.busBoardingDateTime ?? 0, "dd-MM-yyyy hh:mm a")}</td>
                                            <td className="td-cell">{element.busDestination}</td>
                                            <td className="td-cell">{format(element.busDroppingDateTime ?? 0, "dd-MM-yyyy hh:mm a")}</td>
                                            <td className="td-cell">{element.allSeatNumbers}</td>
                                            <td className="td-cell">
                                                {isAfter(new Date(element.busBoardingDateTime), new Date()) ? <span className="green">Confirmed</span> : <span className="gray">Expried</span>}
                                            </td>
                                        </tr>))
                                )
                                :
                                (
                                    <tr>
                                        <td colSpan={8} className="errorInTable">No booking yet</td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>

            </div>
        </div >
    )
}

const DwldTicket = () => {


    const contentRef = useRef();
    const [searchParams] = useSearchParams();
    const prnId = searchParams.get("id");
    const [BusSchedule, setBusSchedule] = useState({});
    const [Passenger, setPassenger] = useState({});
    const [PassengerBookingInfo, setPassengerBookingInfo] = useState({});
    const [busSeatType, setbusSeatType] = useState([]);

    useEffect(() => {

        if (prnId) {
            listItem(`passengerbookingInfo/print/${prnId}`).then((data) => {
                setBusSchedule(data.busSchedule);
                setPassenger(data.passenger);
                setPassengerBookingInfo(data.passengerBookingInfo);
                setbusSeatType(data.busSeatType);
            });
        }

    }, []);

    const generatePDF = () => {

        const element = contentRef.current;
        const options = {
            filename: `PNR${prnId}` || "ticket.pdf",
            margin: 30,
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: "px",
                format: [794, 1121],
                orientation: "portrait"
            }
        };

        html2pdf().set(options).from(element).save();
    };

    return (
        <main className="main-container">
            <div className="content-wrapper" ref={contentRef}>
                <div className="dwldTicket-header">
                    <div className="dwldTicket-header-leftside">
                        <img className="logo logo-m"
                            src="data:image/png;base64,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"
                            alt="bus"></img>
                        <div>
                            <p className="header-title">Blue Bus</p>
                            <p className="dwldTicket-header-com">www.bluebus.com</p>
                        </div>
                    </div>
                    <h3 className="page-title">Ticket - PNR{prnId || ""}</h3>
                </div>
                <div className="section-stack" >
                    <section className="card">
                        <div className="card-body">
                            <h2 className="section-title">Passenger Information</h2>
                            <dl className="details-grid">
                                <div className="detail-item">
                                    <p className="label">Passenger Name
                                        <span className="value"> {Passenger?.passenger_name ?? ""}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Gender
                                        <span className="value"> {Passenger?.passenger_gender ?? ""}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Mobile Number
                                        <span className="value"> {Passenger?.passenger_mobile ?? ""}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Email
                                        <span className="value"> {Passenger?.passenger_email ?? ""}</span>
                                    </p>
                                </div>
                            </dl>
                        </div>
                        <div className="card-body">
                            <h2 className="section-title">Booking Details</h2>
                            <dl className="details-grid">
                                <div className="detail-item full-span">
                                    <p className="label">PNR Number
                                        <span className="value highlight"> {prnId || ""}</span>
                                    </p>
                                </div>
                                <div className="detail-item full-span">
                                    <p className="label">Bus Name
                                        <span className="value"> {BusSchedule?.bus_name ?? ""}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Origin
                                        <span className="value"> {BusSchedule?.origin ?? ""}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Destination
                                        <span className="value"> {BusSchedule?.destination ?? ""}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Time of Departure
                                        <span className="value"> {format(BusSchedule?.boardingDateTime ?? 0, "dd-MM-yy hh:mm a")}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Time of Arrival
                                        <span className="value"> {format(BusSchedule?.droppingDateTime ?? 0, "dd-MM-yy hh:mm a")}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Distance
                                        <span className="value"> {BusSchedule?.total_distance ?? ""}</span>
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <p className="label">Travel Time
                                        <span className="value"> {BusSchedule?.travelTime ?? ""}</span>
                                    </p>
                                </div>
                            </dl>
                        </div>
                        <div className="card-body">
                            <h2 className="section-title">Seat Information</h2>
                            {
                                Array.isArray(busSeatType) ?
                                    (busSeatType?.map((seat) => (
                                        <dl className="details-grid" key={seat.seatNum}>
                                            <div className="detail-item" >
                                                <p className="label">Seat Number
                                                    <span className="value"> {seat.seatNum}</span>
                                                </p>
                                            </div>
                                            <div className="detail-item">
                                                <p className="label">Seat Type
                                                    <span className="value"> {seat.seatType}</span>
                                                </p>
                                            </div>
                                        </dl>)))
                                    :
                                    (<dl className="details-grid">
                                        <div className="detail-item">
                                            <p className="label">Seat Number
                                                <span className="value"> Check with operator</span>
                                            </p>
                                        </div>
                                        <div className="detail-item">
                                            <p className="label">Seat Type
                                                <span className="value"> Check with operator</span>
                                            </p>
                                        </div>
                                    </dl>)
                            }
                        </div>
                        <div className="card-body">
                            <h2 className="section-title">Payment Details</h2>
                            <dl className="details-grid">
                                <div className="detail-item full-span">
                                    <p className="label">Payment Type
                                        <span className="value highlight"> {PassengerBookingInfo[0]?.paymentType ?? ""}</span>
                                    </p>
                                </div>
                            </dl>
                        </div>
                    </section>
                </div>
            </div>
            <div className="dwldBnDiv">
                <button onClick={() => generatePDF()}>Download</button>
            </div>
        </main>
    )

}

export { DwldTicket, History };

