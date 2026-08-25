import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";

export const profileDataStructure = {
    "personal_info": {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",
    },
    "account_info": {
        total_posts: 0,
        total_reads: 0
    },
    "social_links": { },
    "joinedAt": " "
}

const ProfilePage = () => {
    
    const { id: profileId } = useParams()
    const [profile, setProfile] = useState(profileDataStructure)

    const { 
            personal_info: { fullname, username: profile_username, profile_img, bio },
            account_info: { total_posts,  total_reads },
            social_links,
            joinedAt

        } = profile
    
    const [loading, setLoading] = useState(true)
    const { userAuth: { username } } = useContext(UserContext)

    const [blogs, setBlogs] = useState(null)

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
            username: profileId
        })
        .then(({ data: user }) => {
            setProfile(user)
            getBlogs({ user_id: user._id })
            setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    /**
     * 
     * Get Blogs As User
     * 
     * @param {*} param
     */
    const getBlogs = ({ page = 1, user_id }) => {
        
        user_id = user_id == undefined ? blogs.user_id : user_id
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            author: user_id,
            page
        })
        .then( async ({ data }) => {
            
            let formatedDate = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                counteRoute: "/search-blogs-count",
                data_to_send: { author: user_id }
            })

            formatedDate.user_id = user_id

            setBlogs(formatedDate)

        })
        .catch(err => {
            console.log(err)
        })

    }

    useEffect(() => {

        resetState()
        fetchUserProfile()

    }, [profileId])

    /**
     * 
     * Reset data, a chaque fois que le composant est reload
     * 
     */
    const resetState = () => {
        setProfile(profileDataStructure)
        setLoading(true)
    }
    
    return (
        <AnimationWrapper>
            {
                loading ? 
                <Loader /> 
                :
                <section
                    className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12"
                >
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
                        <img 
                            src={ profile_img } 
                            alt="Avatar"
                            className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32" 
                        />
                        <h1 className="text-2xl font-medium">@{profile_username}</h1>
                        <p className="text-xl capitalize h-6">{fullname}</p>
                        <p>
                            { total_posts.toLocaleString() } Articles ,  
                            { total_reads.toLocaleString() } Lectures totales
                        </p>

                        <div className="flex gap-4 mt-2">
                            {
                                profileId === username ?
                                <Link
                                    to="setting/edit-profile"
                                    className="btn-light rounded-md"
                                >
                                    Éditer profil
                                </Link>
                                :
                                " "
                            }
                        </div>
                        <AboutUser 
                            className="max-md:hidden"
                            bio={bio}
                            social_links={social_links}
                            joinedAt={joinedAt}
                        />
                    </div>
                </section>
            }
        </AnimationWrapper>
    )
}

export default ProfilePage