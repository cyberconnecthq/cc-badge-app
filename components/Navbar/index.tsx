import { useContext } from "react";
import Link from "next/link";
import { MdOutlineDashboard } from "react-icons/md";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/auth";
import BadgeBtn from "../Buttons/BadgeBtn";

const Navbar = () => {
    const { address } = useContext(AuthContext);
    const router = useRouter();

    return (
        <nav className="navbar">
            <div></div>
            <div>
                <Link href="/">
                    <div className={`navbar-link ${router.pathname === "/" && "active"}`}>{<MdOutlineDashboard />}</div>
                </Link>
                <hr></hr>
                <BadgeBtn />
            </div>
            <div className="navbar-address">
                {
                    address &&
                    <div className="center">{`${address.slice(0, 4)}..`}</div>
                }
            </div>
        </nav>
    );
};

export default Navbar;
