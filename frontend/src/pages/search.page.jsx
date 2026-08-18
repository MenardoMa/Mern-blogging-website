import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import BlogPostCard from "../components/blog-post.component";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";


const SearchPage = () => {
    
    let { query } = useParams()
    const [blogs, setBlogs] = useState(null)

    /**
     * 
     * Handle Search Blogs
     * 
     * @param {*} param0 
     */
    const searchBlogs = ({ page = 1, create_new_arr = false }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {  
            query, 
            page 
        })
        .then( async ({ data }) => {

            let formatedDate = await filterPaginationData({
                
                state: blogs,
                data: data.blogs,
                page,
                counteRoute: "/search-blogs-count",
                data_to_send: {
                    query
                },
                create_new_arr

            })

            setBlogs(formatedDate)

        })
        .catch(err => {
            console.log(err.message)
        })

    }

    useEffect(() => {

        resetState()
        searchBlogs({ page: 1, create_new_arr: true })

    }, [query])

    /**
     * Reset State
     */
    const resetState = () => {
        setBlogs(null)
    }
    
    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation
                    routes={[`Recherche "${query}"`, "Comptes correspondants"]}
                    defaultHidden={"Comptes correspondants"}
                >

                    <>
                            {
                                blogs === null ? ( 
                                    <Loader /> 
                                )
                                : 
                                    (
                                        blogs.results.length ?
                                        blogs.results.map((blog, i) => {
                                        return (
                                        <AnimationWrapper
                                            key={i}
                                            transition={{ duration: 1, delay: i * .1 }}
                                        >
                                            <BlogPostCard
                                                content={ blog }
                                                author={ blog.author.personal_info }
                                            />
                                        </AnimationWrapper>
                                        
                                    )})
                                    :
                                    <NoDataMessage 
                                        message={`Aucun article trouvé pour "${query}".`}
                                    />
                                )
                            }
                            <LoadMoreDataBtn
                                state={blogs}
                                fetchDataFun={
                                   searchBlogs
                                }
                            />
                    </>

                </InPageNavigation>
            </div>
        </section>
    )
}

export default SearchPage