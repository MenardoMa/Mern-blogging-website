import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
    
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
    const [userNavPanel, setUserNavPanel] = useState(false)

    const {userAuth, userAuth: {access_token, profile_img}} = useContext(UserContext)

    const [searchQuery, setSearchQuery] = useState("")

    const navigate = useNavigate()
    const location = useLocation();

    /**
     * 
    * Synchronise l'input avec l'URL
    * 
    */
    useEffect(() => {

        if (location.pathname.startsWith("/search/")) {

            const query = decodeURIComponent(
                location.pathname.replace("/search/", "")
            );

            setSearchQuery(query);

        } else {
            setSearchQuery("");
        }

    }, [ location.pathname ]);


    /**
     * 
     * Active Hamb Nav
     * 
     */
    const handleUserNavPanel = () => {
        setUserNavPanel((currentVal) => !currentVal)
    }

    /**
     * 
     * Blur Hamb Nav
     * 
     */
    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false)
        }, 200)
    }

    /**
     * Handle Search Event
     * 
     * @param {*} e 
     */
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            
            const query = searchQuery.trim();

            if (query.length) { 
                navigate(`/search/${encodeURIComponent(query)}`)
            }
            
        }
    }
    
    return (
       <>
        <nav className="navbar">
            
            <Link to={"/"} className="flex-none w-10">
                <img 
                    src={logo}
                    alt="Logo" 
                    className="w-full"
                />
            </Link>

            <div 
                className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:pointer-events-auto md:opacity-100 " + (searchBoxVisibility ? "show" : "hide")}>
                <input 
                    type="text" 
                    placeholder="Rechercher..."
                    className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                    value={ searchQuery }
                    onChange={ (e) => setSearchQuery(e.target.value) }
                    onKeyDown={ handleSearch }
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>

            <div className="flex items-center gap-3 md:gap-6 ml-auto">
                <button 
                    className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => setSearchBoxVisibility(currentVal => !currentVal)}
                >
                    <i className="fi fi-rr-search text-xl"></i>
                </button>
                <Link to="/editor" className="hidden md:flex gap-2 link">
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>

                {
                    access_token 
                    ?
                    <>
                        <Link to="/dashboard/notification">
                            <button
                                className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 cursor-pointer"
                            >
                                <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                            </button>
                        </Link>
                        <div 
                            className="relative"
                            onClick={handleUserNavPanel}
                            onBlur={handleBlur}
                        >
                            <button
                                className="w-12 h-12 mt-1"
                            >
                                <img 
                                    src={ profile_img }
                                    alt=""
                                    className="w-full h-full object-cover rounded-full cursor-pointer"
                                />
                            </button>
 
                            {
                                userNavPanel ? <UserNavigationPanel /> : ""
                            }

                        </div>
                    </>
                    :
                    <>
                        <Link to="/signin" className="btn-dark">
                            Sign In
                        </Link>
                        <Link to="/signup" className="btn-light hidden md:block">
                            Sign Up
                        </Link>
                    </>
                }
                
            </div>

        </nav>
        <Outlet />
       </> 
    )
}

export default Navbar