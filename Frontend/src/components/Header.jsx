import { Menu, MenuButton, MenuItem, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/zoom.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
    const Navigate = useNavigate();

    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        Navigate("/");
    };

    return (
        <div className="header-container">
            <div>
                <img className="logo" onClick={() => Navigate("/")}
                    src="data:image/png;base64,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"
                    alt="bus"></img>
            </div>
            <p className="header-title">Blue Bus</p>


            {token ? (
                <div className='header-afterLogin'>
                    {role === "ROLE_ADMIN" &&
                        <div className='templinks'>
                            <Menu menuClassName="userprofilemenu"
                                align={"center"}
                                arrow={true}
                                viewScroll={"close"}
                                position={"anchor"}
                                menuButton={<MenuButton className="adminBN"> ADMIN ACCESS </MenuButton>} >
                                <SubMenu label="Forms">
                                    <MenuItem onClick={() => { Navigate("/passengerform"); }}> PassengerForm </MenuItem>
                                    <MenuItem onClick={() => { Navigate("/routeform"); }}> RouteForm </MenuItem>
                                    <MenuItem onClick={() => { Navigate("/busform"); }}> BusForm </MenuItem>
                                    <MenuItem onClick={() => { Navigate("/bookingform"); }}> BookingForm </MenuItem>
                                </SubMenu>
                                <SubMenu label="List">
                                    <MenuItem onClick={() => { Navigate("/passengerlist"); }}> ListPassenger </MenuItem>
                                    <MenuItem onClick={() => { Navigate("/buslist"); }}> ListBus </MenuItem>
                                    <MenuItem onClick={() => { Navigate("/routelist"); }}> ListRoute </MenuItem>
                                    <MenuItem onClick={() => { Navigate("/bookinginfolist"); }}> ListBookingInfo </MenuItem>
                                </SubMenu>
                            </Menu >
                        </div>}
                    <Menu menuClassName="userprofilemenu"
                        align={"end"}
                        arrow={true}
                        viewScroll={"close"}
                        position={"anchor"}
                        menuButton={<MenuButton className="userprofileBn">
                            <img className="userprofilelogo"
                                src="data:image/png;base64,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"
                                alt="user-male-circle"></img> </MenuButton>} >

                        <MenuItem onClick={() => { Navigate("/history"); }}> History </MenuItem>
                        <MenuItem onClick={() => { Navigate("/profile"); }}> Profile </MenuItem>
                        <MenuItem onClick={() => { handleLogout() }}> Logout </MenuItem>
                    </Menu >
                </div>
            ) : (
                <div>
                    <button className="button buttonSupport" onClick={() => Navigate("/login")}>Login</button>
                    <button className="button buttonSupport" onClick={() => Navigate("/passengerform")}>Register</button>
                </div>
            )}
        </div>
    );
};

export default Header;

