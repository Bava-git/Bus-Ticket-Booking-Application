import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteItem, listItem } from '../util/API_HUB';

const ListPassenger = () => {
    const [ListItem, setListItem] = useState([]);
    const Navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        listItem("passenger").then(data => setListItem(data));
    }

    const handleUpdate = (passenger_id) => {
        Navigate(`/passengerform?passenger_id=${passenger_id}`);
    }

    const handleDelete = (passenger_id) => {

        deleteItem("passenger", passenger_id).then((res) => {
            if (res === 200) {
                toast.success("Deleted successfully!")
                fetchData();
            }
        })

    }

    const MyArr = [];
    let length = ListItem?.length ?? 0;
    for (let i = 0; i < length; i++) {
        const element = ListItem[i];
        MyArr.push(<tr key={i}>
            <td>{i + 1}</td>
            <td>{element.passenger_name}</td>
            <td>{format(element.passenger_dob, "dd-MMM-yyyy")}</td>
            <td>{element.passenger_gender}</td>
            <td>{element.passenger_mobile}</td>
            <td>{element.passenger_email}</td>
            <td>
                <button className="listcontainer-table-Bns" onClick={() => { handleUpdate(element.passenger_id) }}>Update</button>
                <button className="listcontainer-table-Bns" onClick={() => { handleDelete(element.passenger_id) }}>Delete</button>
            </td>
        </tr>)
    }

    return (
        <div className="listcontainer">
            <div className="listcontainer-table">
                <h3 className="listcontainer-table-title">Passenger List</h3>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Name</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MyArr.length > 0 ? MyArr :
                            <tr key="temp">
                                <td colSpan={7} className="error-massage">No Data</td>
                            </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const ListBus = () => {
    const [ListItem, setListItem] = useState([]);
    const Navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        listItem("bus").then(data => setListItem(data));
    }

    const handleDelete = (bus_id) => {

        deleteItem("bus", bus_id).then((res) => {
            if (res === 200) {
                toast.success("Deleted successfully!")
                fetchData();
            }
        })

    }

    const handleUpdate = async (bus_id) => {
        Navigate(`/busform?bus_id=${bus_id}`);
    }

    const MyArr = [];
    let length = ListItem?.length ?? 0;
    for (let i = 0; i < length; i++) {
        const element = ListItem[i];
        MyArr.push(<tr key={i}>
            <td>{i + 1}</td>
            <td>{element.bus_name}</td>
            <td>{element.ratePerKm}</td>
            <td>{element.lower_left}</td>
            <td>{element.lower_right}</td>
            <td>{element.numOfSeaterSeats}</td>
            <td>{element.numOfSleeperSeats}</td>
            <td>{element.isUpperDeck ? "✓" : ""}</td>
            <td>{element.isACBus ? "✓" : ""}</td>
            <td>{element.waterBottle ? "✓" : ""}</td>
            <td>{element.blanket ? "✓" : ""}</td>
            <td>{element.chargingPoint ? "✓" : ""}</td>
            <td>
                <button className="listcontainer-table-Bns" onClick={() => { handleUpdate(element.bus_id) }}>Update</button>
                <button className="listcontainer-table-Bns" onClick={() => { handleDelete(element.bus_id) }}>Delete</button>
            </td>
        </tr>)
    }

    return (
        <div className="listcontainer">
            <div className="listcontainer-table">
                <h3 className="listcontainer-table-title">Bus List</h3>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Name</th>
                            <th>Rate/Km</th>
                            <th>Lower Deck Left</th>
                            <th>Lower Deck Right</th>
                            <th>No of Seater Seats</th>
                            <th>No of Sleeper Seats</th>
                            <th>Upper Deck</th>
                            <th>AC</th>
                            <th>Water Bottle</th>
                            <th>Blanket</th>
                            <th>Charging Point</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MyArr.length > 0 ? MyArr :
                            <tr key="temp">
                                <td colSpan={13} className="error-massage">No Data</td>
                            </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const ListRoute = () => {
    const [ListItem, setListItem] = useState([]);
    const Navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        listItem("routes").then(data => setListItem(data));
    }

    const handleUpdate = (routeInfo_id) => {
        Navigate(`/routeform?routeInfo_id=${routeInfo_id}`);
    }

    const handleDelete = (routeInfo_id) => {

        deleteItem("routes", routeInfo_id).then((res) => {
            if (res === 200) {
                toast.success("Deleted successfully!")
                fetchData();
            }
        })
    }

    const MyArr = [];
    let length = ListItem?.length ?? 0;
    for (let i = 0; i < length; i++) {
        const element = ListItem[i];
        MyArr.push(<tr key={i}>
            <td>{i + 1}</td>
            <td>{element.routeInfo_origin}</td>
            <td>{element.routeInfo_destination}</td>
            <td>{element.routeInfo_distance}</td>
            <td>{element.routeInfo_traveltime}</td>
            <td>
                <button className="listcontainer-table-Bns" onClick={() => { handleUpdate(element.routeInfo_id) }}>Update</button>
                <button className="listcontainer-table-Bns" onClick={() => { handleDelete(element.routeInfo_id) }}>Delete</button>
            </td>
        </tr>)
    }

    return (
        <div className="listcontainer">
            <div className="listcontainer-table">
                <h3 className="listcontainer-table-title">Route List</h3>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>Distance(Km)</th>
                            <th>Travel Time(hr)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MyArr.length > 0 ? MyArr :
                            <tr key="temp">
                                <td colSpan={6} className="error-massage">No Data</td>
                            </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const ListBookingInfo = () => {
    const [ListItem, setListItem] = useState([]);
    const Navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = () => {
        listItem("bookinginfo").then(data => setListItem(data));
    }

    const handleDelete = (bookingInfo_id) => {

        deleteItem("bookinginfo", bookingInfo_id).then((res) => {
            if (res === 200) {
                toast.success("Deleted successfully!")
                fetchData();
            }
        })

    }

    const MyArr = [];
    let length = ListItem?.length ?? 0;
    for (let i = 0; i < length; i++) {
        const element = ListItem[i];
        MyArr.push(<tr key={i}>
            <td>{i + 1}</td>
            <td>{element.bus_id}</td>
            <td>{element.bus_name}</td>
            <td>{element.origin}</td>
            <td>{element.destination}</td>
            <td>{element.total_distance}</td>
            <td>{element.availableSeaterSeats}</td>
            <td>{element.availableSleeperSeats}</td>
            <td>{element.boardingDateTime}</td>
            <td>{element.droppingDateTime}</td>
            <td>
                <button className="listcontainer-table-Bns" onClick={() => { handleDelete(element.bookingInfo_id) }}>Delete</button>
            </td>
        </tr>)
    }

    return (
        <div className="listcontainer">
            <div className="listcontainer-table">
                <h3 className="listcontainer-table-title">Booking Information List</h3>
                <table border={1}>
                    <thead>
                        <tr>
                            <th>S No</th>
                            <th>Bus ID</th>
                            <th>Bus Name</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>Distance(Km)</th>
                            <th>Seater Seats</th>
                            <th>Sleeper Seats</th>
                            <th>Boarding Date Time</th>
                            <th>Dropping Date Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MyArr.length > 0 ? MyArr :
                            <tr key="temp">
                                <td colSpan={11} className="error-massage">No Data</td>
                            </tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export { ListBookingInfo, ListBus, ListPassenger, ListRoute };

