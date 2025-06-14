import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
// import homepageimage from '../assets/image/homepageimage2.png'
import homepageimage from '../assets/image/juan-encalada-6mcVaoGNz1w-unsplash.jpg'

const HomePage = () => {

    const [fromCity, setfromCity] = useState('');
    const [toCity, settoCity] = useState('');
    const [whichDate, setwhichDate] = useState("");
    const [isFemale, setisFemale] = useState(false);
    const [ListItem, setListItem] = useState([]);

    const Navigate = useNavigate();


    useEffect(() => {
        fetchData();
        const today = new Date().toISOString().split("T")[0]; // Formats as "YYYY-MM-DD"
        setwhichDate(today);
    }, [])

    const fetchData = async () => {
        try {
            let response = await axios.get(`http://localhost:3000/routes`, {
                headers: {
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setListItem(response.data)
        } catch (error) {
            console.log("ListPassenger " + error);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();

        if (!fromCity && !toCity) {
            toast.error("Please enter origin and destination");
            return;
        }

        const filterItem = ListItem.filter((element) => {
            if (fromCity === element.routeInfo_origin && toCity === element.routeInfo_destination) {
                return element;
            }
        })

        if (!filterItem) {
            toast.error("Sorry, Bus not available for selected route");
            return;
        }

        let route_id = filterItem[0].routeInfo_id;

        Navigate(
            `/results?fromCityName=${fromCity}&toCityName=${toCity}&onward=${whichDate}&female=${isFemale}&rid=${route_id}`
        );

    }

    return (
        <div className="homepage">
            <img src={homepageimage} alt="homepageimage" className='homepageimage' />
            <div className='searchbarcontainer'>
                <div className='searchbar'>
                    <div className='searchbar-field'>
                        <div >
                            <img className='searchbar-icons'
                                src="data:image/png;base64,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"
                                alt="get-on-bus"></img>
                        </div>
                        <div>
                            <input type="text" placeholder='From' className='searchbar-inputbox' list="origin"
                                onChange={(e) => setfromCity(e.target.value)} />
                            <datalist id="origin">
                                {ListItem.map((element) => (
                                    <option key={element.routeInfo_id} value={element.routeInfo_origin} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div className='searchbar-field'>
                        <div >
                            <img className='searchbar-icons'
                                src="data:image/png;base64,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"
                                alt="get-off-bus"></img>
                        </div>
                        <div>
                            <input type="text" placeholder='To' className='searchbar-inputbox' list="destination"
                                onChange={(e) => settoCity(e.target.value)} />
                            <datalist id="destination">
                                {ListItem.map((element) => (
                                    <option key={element.routeInfo_id} value={element.routeInfo_destination} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div className='searchbar-field'>
                        <div>
                            <input type="date" placeholder='To' className='searchbar-inputbox' id='date' value={whichDate}
                                onChange={(e) => setwhichDate(e.target.value)} />
                        </div>
                    </div>
                    <div className='searchbar-field-female'>
                        <div className='searchbar-female'>
                            <img className='searchbar-icons'
                                src="data:image/png;base64,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"
                                alt="user-female-circle"></img>
                        </div>
                        <div>
                            <p className='searchbar-field-femaletitle'>Female</p>
                            <label className="switch">
                                <input type="checkbox" id='female' onChange={(e) => {
                                    if (e.target.checked) { setisFemale(true) }
                                    else { setisFemale(false) }
                                }} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='searchbar-field-search' onClick={(e) => handleSearch(e)}>
                    <p className=''>Search</p>
                    <img className='searchbar-searchicons'
                        src="data:image/png;base64,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"
                        alt="search--v1"></img>
                </div>
            </div>
        </div >
    )
}
export default HomePage;