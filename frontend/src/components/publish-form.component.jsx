import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
    
    let characterLimit = 200
    let tagLimit = 10
    let { blog, blog: { banner, title, tags, des, content } ,setEditorState, setBlog } = useContext(EditorContext)

    let {userAuth: { access_token } } = useContext(UserContext)
    let navigate = useNavigate()

    const handleCloseEvent = (e) => {
        e.preventDefault()
        setEditorState("editor")
    }

    const handleBlogTitleChange = (e) => {
        let input = e.target 
        setBlog({ ...blog, title: input.value })
    }

    const handleBlogDesChange = (e) => {
        let input = e.target
        setBlog({ ...blog, des: input.value })
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
     * Add Tag Function
     * 
     * @param {*} e 
     * @returns 
     */
    const handleKeyDown = (e) => {
        if(e.keyCode == 13 || e.keyCode == 188){
            e.preventDefault()

            let tag = e.target.value

            if (tags.length >= tagLimit) {
                return toast.error(`Vous ne pouvez ajouter que ${tagLimit} tags maximum`);
            }

            if (tags.includes(tag)) {
                return toast.error("Ce tag a déjà été ajouté");
            }

            if (tag.length) {
                setBlog({
                    ...blog,
                    tags: [...tags, tag]
                });
            }

            e.target.value = ""

        }
    }

    /**
     * 
     * Delete Tag Function
     * 
     * @param {*} tagToRemove 
     */
    const handleTagDelete = (tagDelete) => {
        setBlog({
            ...blog,
            tags: tags.filter(tag => tag !== tagDelete)
        })
        toast.success(`Le tag "${tagDelete}" a été supprimé`)
    }

    /**
     * 
     * Edit Tag
     * 
     * @param {*} e 
     * @param {*} tag 
     * @param {*} i 
     * @returns 
     */
    const handleTagEdit = (e, tag, i) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()

            const newTag = e.currentTarget.innerText.trim()

            // Tag vide
            if (!newTag.length) {
                toast.error("Le tag ne peut pas être vide")                
                e.currentTarget.innerText = tag // Remettre l'ancien tag
                return
            }

            // Vérifier les doublons
            if (tags.some((item, index) => item === newTag && index !== i)) {
                toast.error("Ce tag existe déjà")
                e.currentTarget.innerText = tag
                return
            }

            // Modifier le tag
            setBlog({
                ...blog,
                tags: tags.map((item, index) =>
                    index === i ? newTag : item
                )
            })

            toast.success("Tag modifié avec succès")
            e.currentTarget.setAttribute("contentEditable", false)

        }
    }

    /**
     * 
     * Create Blog
     * 
     * @param {*} e 
     * @returns 
     */
    const handlePublishBlog = (e) => {
        
        e.preventDefault()

        if(e.currentTarget.className.includes("disable")){
            return
        }

        if (!title.length) {
            return toast.error("Le titre de l'article est obligatoire")
        }

        if (!des.length || des.length > 200) {
            return toast.error("La description de l'article est obligatoire et doit contenir moins de "+ characterLimit +" caractères")
        }

        if (!tags.length) {
            return toast.error("Veuillez ajouter au moins un tag à votre article")
        }

        if(tags.length > 10){
            return toast.error("Vous pouvez ajouter au maximum 10 tags")
        }

        let loadingToast = toast.loading("Publication ...")

        e.currentTarget.classList.add("disable")

        let blogObj = {
            title,
            banner,
            des, 
            content,
            tags,
            draft: false
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(() => {

            e.currentTarget.classList.remove("disable")
            toast.success("Article Publié avec succès", {
                id: loadingToast
            })

            setTimeout(() => {
                navigate("/")
            }, 500)

        }).catch(({ response }) => {

            e.currentTarget.classList.remove("disable")
            toast.error(response.data.error, {
                id: loadingToast
            })

        })

    }

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />
                <button 
                    className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%] cursor-pointer"
                    onClick={handleCloseEvent}
                >
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Aperçu</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img 
                            src={ banner } 
                            alt="Banner" 
                        />
                    </div>

                    <h1
                        className="text-4xl font-medium mt-2 leading-tight line-clamp-2"
                    >{ title }</h1>

                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">
                        { des }
                    </p>
                </div>

                <div className=" lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Titre de l'article</p>
                    <input 
                        type="text" 
                        placeholder="Titre de l'article"
                        defaultValue={title}
                        className="input-box pl-4"
                        onChange={handleBlogTitleChange}
                    />

                    <p className="text-dark-grey mb-2 mt-9">Décrivez brièvement votre article</p>
                    <textarea
                        maxLength={characterLimit}
                        defaultValue={des}
                        className="h-40 resize-none leading-7 input-box pl-4"
                        onChange={handleBlogDesChange}
                        onKeyDown={handleTitleKeyDown}
                    >
                    </textarea>
                    <p
                        className="mt-1 text-dark-grey text-base text-right"
                    >
                        { characterLimit - des.length } caractères restants
                    </p>

                    <p className="text-dark-grey mb-2 mt-9">
                        Ajoutez des mots-clés pour aider les lecteurs à trouver votre article.
                    </p>

                    <div
                        className="relative input-box pl-2 py-2 pb-4"
                    >
                        <input 
                            type="text" 
                            placeholder="Tags, Entre pour validé"
                            className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                            onKeyDown={handleKeyDown}
                        />
                        {
                            tags.map((tag, i) => {
                                return <Tag
                                    key={i}
                                    tag={tag}
                                    onTagDelete={ () => handleTagDelete(tag) }
                                    onTagEdit={ (e) => handleTagEdit(e, tag, i) }
                                />
                            })
                        }
                       
                    </div>
                    <p
                        className="mt-1 mb-4 text-dark-grey text-right"
                    >
                        {  tagLimit - tags.length } tags restants
                    </p>

                    <button 
                        className="btn-dark cursor-pointer"
                        onClick={handlePublishBlog}
                    >
                        Publier
                    </button>

                </div>

            </section>
        </AnimationWrapper>
    )
}

export default PublishForm