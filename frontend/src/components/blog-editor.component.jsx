import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";

import banner from "../imgs/blog-banner.png"

const BlogEditor = () => {
    
    const handleBannerUpload = () => {
        
    }
    
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
            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img
                                    src={ banner }
                                    className="z-20"
                                />
                                <input 
                                    type="file" 
                                    id="uploadBanner"
                                    accept=".png, .jpg, .jpeg, .webp"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor