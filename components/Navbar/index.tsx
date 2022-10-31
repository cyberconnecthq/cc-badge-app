import { useContext } from "react";
import Link from "next/link";
import { MdOutlineDashboard } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/auth";
import { ModalContext } from "../../context/modal";
import { IoMdRibbon } from "react-icons/io";

const Navbar = () => {
    const { address } = useContext(AuthContext);
    const { handleModal } = useContext(ModalContext);
    const router = useRouter();

    return (
        <nav className="navbar">
            <div></div>
            <div>
                <Link href="/">
                    <div className={`navbar-link ${router.pathname === "/" && "active"}`}>{<MdOutlineDashboard />}</div>
                </Link>
                <Link href="/settings">
                    <div className={`navbar-link ${router.pathname === "/settings" && "active"}`}>{<FiSettings />}</div>
                </Link>
                <hr></hr>
                <button
                    className="create-btn center"
                    onClick={() => handleModal("badge", "")}
                >{<IoMdRibbon />}</button>
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
