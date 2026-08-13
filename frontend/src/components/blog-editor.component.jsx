import { Link } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";

import defaultBanner from "../imgs/blog-banner.png"
import { useState } from "react";

import axios from "axios"
import { Toaster, toast } from "react-hot-toast"

const BlogEditor = () => {
    
    const [bannerURL, setBannerURL] = useState("")
    const [bannerPublicId, setBannerPublicId] = useState("")

    const handleBannerUpload = async (e) => {
        
        let img = e.target.files[0]
        
        if (!img) {
            return
        }

        const formData = new FormData()
        formData.append("image", img)
        formData.append("folder", "banner")

        try {

            let loadingToast = toast.loading("Téléversement en cours...")
            
            const { data } = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/upload",
                formData
            )

            setBannerURL(data.url)
            setBannerPublicId(data.public_id)

            toast.dismiss(loadingToast)
            toast.success("Image envoyée avec succès")
            console.log(data)

        } catch (error) {

            console.log(error)

            toast.error(
                error.response?.data?.error ||
                "Erreur lors de l'upload"
            )
        } 

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
            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img
                                    src={ bannerURL || defaultBanner }
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