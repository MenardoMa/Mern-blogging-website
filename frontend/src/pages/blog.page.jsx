import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * 
 * Add structure
 * 
 */
export const blogStructure = {
    title: "",
    des: "",
    content: [],
    tags: [],
    author: { personal_info: { } },
    banner: "",
    publishedAt: ""
}

const BlogPage = () => {
    
    const { blog_id } = useParams()
    const [blog, setBlog] = useState(blogStructure)

    const { title, des, content, banner, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = blog

    /**
     * 
     * Get Blog
     * 
     */
    const fetchBlog = () => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {  blog_id })
        .then(({ data: { blog} }) => {

            setBlog(blog)

        })
        .catch(err => {
            console.log(err)
        })

    }

    useEffect(() => {
    
        fetchBlog()

    }, [])


    
    return (
        <section>
            <h1>This is a blog page detail. { blog_id } </h1>
        </section>
    )
}

export default BlogPage