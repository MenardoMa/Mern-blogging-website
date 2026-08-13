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
    const [disabled, setDisabled] = useState(false)

    /**
     * Upload Image
     * 
     * @param {*} e 
     * @returns 
     */
    const handleBannerUpload = async (e) => {
        
        let img = e.target.files[0]
        
        if (!img) {
            return
        }

        const formData = new FormData()
        formData.append("image", img)
        formData.append("folder", "banner")

        let loadingToast = toast.loading("Téléversement en cours...")

        try {

            setDisabled(true)
            
            const { data } = await axios.post(
                import.meta.env.VITE_SERVER_DOMAIN + "/upload",
                formData
            )

            setBannerURL(data.url)
            setBannerPublicId(data.public_id)

           toast.success("Image envoyée avec succès", {
                id: loadingToast
            })
            console.log(data)

        } catch (error) {

            console.log(error)

            toast.error(
                error.response?.data?.error ||
                "Erreur lors de l'upload",
                {
                    id: loadingToast
                }
            )
        } finally{
            setDisabled(false)
        } 

    }
    
    const handleTitleKeyDown = async (e) => {
       if(e.keyCode === 13){ // Enter
            e.preventDefault()
       }
    }

    const handleTitleChange = (e) => {
        let input = e.target
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + "px"
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
                    <button 
                        className="btn-dark cursor-pointer"
                        disabled={disabled}
                    >
                        Publier
                    </button>
                    <button 
                        className="btn-light cursor-pointer
                        disabled={disabled}
                    ">
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
                                    className="z-20 cursor-pointer"
                                />
                                <input 
                                    type="file" 
                                    id="uploadBanner"
                                    accept=".png, .jpg, .jpeg, .webp"
                                    hidden
                                    onChange={handleBannerUpload}
                                    disabled={disabled}
                                />
                            </label>
                        </div>

                        <textarea
                            placeholder="Blog Titre"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        >

                        </textarea>

                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor