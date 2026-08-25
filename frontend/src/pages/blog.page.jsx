import { useParams } from "react-router-dom";

const BlogPage = () => {
    
    const { blog_id } = useParams()
    
    return (
        <section>
            <h1>This is a blog page detail. { blog_id } </h1>
        </section>
    )
}

export default BlogPage