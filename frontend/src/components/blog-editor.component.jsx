import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"

const BlogEditor = () => {
    return (
        <>
            <nav className="navbar">
                <Link className="flex-none w-10">
                    <img 
                        src={ logo } 
                        alt="Logo" 
                    />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    Nouveau Blog
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark cursor-pointer">
                        Publier
                    </button>
                    <button className="btn-light cursor-pointer">
                        Brouillon
                    </button>
                </div>

            </nav>
            
        </>
    )
}

export default BlogEditor