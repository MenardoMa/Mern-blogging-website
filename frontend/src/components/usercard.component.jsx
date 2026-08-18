import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
    
    const { personal_info: { fullname, username, profile_img } } = user
    
    return (
        <Link
            to={`/user/${username}`}
            className="flex gap-5 items-center mb-5 mt-2"
        >
            <img 
                src={ profile_img }
                alt="avatar" 
                className="w-12 h-12 rounded-full"
            />

            <div>
                <h1
                    className="font-medium text-xl line-clamp-2 capitalize"
                >
                    { fullname }
                </h1>
                <p className="text-dark-grey capitalize">@{ username }</p>
            </div>

        </Link>
    )
}

export default UserCard