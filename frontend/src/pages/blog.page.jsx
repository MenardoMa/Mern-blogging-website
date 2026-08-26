import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BlogPage = () => {
    
    const { blog_id } = useParams()
    const [blog, setBlog] = useState(null)

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