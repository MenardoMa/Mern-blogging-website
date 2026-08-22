import { useParams } from "react-router-dom";

const ProfilePage = () => {
    
    const { id: profileId } = useParams()
    
    return (
        <h1>Profile {profileId}</h1>
    )
}

export default ProfilePage