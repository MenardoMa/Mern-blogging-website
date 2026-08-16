const BlogPostCard = ({ content, author }) => {
    
    let { publishedAt, title, banner, des, tags, activity: { total_likes }, blog_id: id } = content
    let { fullname, username, profile_img } = author

    return (
        <div className="w-full">
            <div className="flex gap-2 items-center mb-7">
                <img 
                    src={ profile_img }
                    alt="Avatar"
                    className="w-6 h-6 rounded-full" 
                />
                <p className="line-clamp-1">
                    {fullname} @{username}
                </p>
                <p className="min-w-fit">
                    { publishedAt }
                </p>
            </div>
        </div>
    )
}

export default BlogPostCard