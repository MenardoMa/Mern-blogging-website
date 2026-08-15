import { Link, useNavigate } from "react-router-dom";
import logo from "../imgs/logo.png"
import AnimationWrapper from "../common/page-animation";

import defaultBanner from "../imgs/blog-banner.png"
import { useContext, useEffect, useState } from "react";

import axios from "axios"
import { Toaster, toast } from "react-hot-toast"
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { UserContext } from "../App";

const BlogEditor = () => {
    
    const [bannerURL, setBannerURL] = useState("")
    const [bannerPublicId, setBannerPublicId] = useState("")
    const [disabled, setDisabled] = useState(false)

    let { blog, blog: { title, banner, content, tags, des }, setBlog, setEditorState,  textEditor, setTextEditor } = useContext(EditorContext)
    let { userAuth: { access_token } } = useContext(UserContext)

    const navigate = useNavigate()
    
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

            // setBannerURL(data.url)
            // setBannerPublicId(data.public_id)
            // setBlog({ ...blog, banner: data.url })
            setBlog(prev => ({
                ...prev,
                banner: data.url
            }))

           toast.success("Image envoyée avec succès", {
                id: loadingToast
            })

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
    
    /**
     * Annul Event Action
     * @param {*} e 
     */
    const handleTitleKeyDown = async (e) => {
       if(e.keyCode === 13){ // Enter
            e.preventDefault()
       }
    }

    /**
     * Change caracteres input
     * 
     * @param {*} e 
     */
    const handleTitleChange = (e) => {
        let input = e.target
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + "px"

        setBlog({ ...blog, title: input.value })

    }

    // useEffet
    useEffect(() => {

        const editor = new EditorJS({
            
            holder: "textEditor",
            data: content,
            tools: tools,
            placeholder: "Partagez vos idées, vos découvertes et vos expériences...",
            
            onReady: () => {
                setTextEditor(editor)
            }

        })

        return () => {
            if (typeof editor.destroy === "function") {
                editor.destroy()
            }
        }

    }, [])

    // Publish BTN
    const handlePublishEvent = async (e) => {
        
        e.preventDefault();

        if(!banner.length){
            return toast.error("Veuillez ajouter une bannière à votre blog")
        }

        if (!title.length) {
            return toast.error("Veuillez entrer un titre pour votre blog")
        }

        if (!textEditor) {
            return toast.error("L'éditeur n'est pas encore prêt")
        }

        try {

            // Attendre que EditorJS soit réellement prêt
            await textEditor.isReady
            const data = await textEditor.save()

            if (!data.blocks || !data.blocks.length) {
                return toast.error("Le contenu du blog est obligatoire")
            }

            setBlog(prev => ({ ...prev, content: data }))
            setEditorState("publish")

        } catch (error) {

            console.error("Erreur lors de la sauvegarde :", error)
            toast.error("Impossible de sauvegarder le contenu")
        }
        
    }

    /**
     * 
     * Create Draft Blog
     * 
     * @param {*} e 
     * @returns 
     */
    const handleSaveDraftBlog = async (e) => {
        
        e.preventDefault()
        let button = e.currentTarget

        if(button.className.includes("disable")){
            return
        }

        if(!banner.length){
            return toast.error("Veuillez ajouter une bannière à votre blog")
        }

        if (!title.length) {
            return toast.error("Veuillez entrer un titre pour votre blog")
        }

        if (!textEditor) {
            return toast.error("L'éditeur n'est pas encore prêt")
        }

        button.classList.add("disable")

        // Attendre qu'EditorJS soit prêt
        await textEditor.isReady

        // Récupérer le contenu actuel de l'éditeur
        const data = await textEditor.save()

        // Vérifier le contenu
        if (!data.blocks?.length) {
            button.classList.remove("disable")
            return toast.error("Veuillez entrer le contenu de votre blog")
        }

        // Mettre à jour le contexte
        setBlog(prev => ({ ...prev, content: data }))

        let loadingToast = toast.loading("Enregistrement du brouillon en cours...")

        let blogObj = {
            title,
            banner,
            content: data,
            draft: true
        }
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(() => {

            button.classList.remove("disable")
            toast.success("Article sauvegardé en brouillon avec succès", {
                id: loadingToast
            })

            setTimeout(() => {
                navigate("/")
            }, 500)

        }).catch(({ response }) => {

            button.classList.remove("disable")
            toast.error(response.data.error, {
                id: loadingToast
            })

        })

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
                    { title.length ? title : "Nouveau Blog" }
                </p>

                <div className="flex gap-4 ml-auto">
                    <button 
                        className="btn-dark cursor-pointer"
                        disabled={disabled}
                        onClick={handlePublishEvent}
                    >
                        Publier
                    </button>
                    <button 
                        className="btn-light cursor-pointer"
                        disabled={disabled}
                        onClick={handleSaveDraftBlog}
                    >
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
                                    src={banner || defaultBanner}
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
                            defaultValue={title}
                            placeholder="Blog Titre"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        <div
                            id="textEditor"
                            className="font-gelasio"
                        >

                        </div>

                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor