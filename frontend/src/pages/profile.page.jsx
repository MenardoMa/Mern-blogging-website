import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
            username: profileId
        })
        .then(({ data: user }) => {
            setProfile(user)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {

        fetchUserProfile()

    }, [])
    
    return (
        <h1>Profile {profileId}</h1>
    )
}

export default ProfilePage