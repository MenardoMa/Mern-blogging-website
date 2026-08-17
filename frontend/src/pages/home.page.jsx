import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";

import { activeTabRef } from "../components/inpage-navigation.component"
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";

const HomePage = () => {
    
    const [blogs, setBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)
    const [pageState, setPageState] = useState("Accueil")

    const categories = [
        "développement web",
        "technologie",
        "design & ui/ux",
        "bases de données",
        "devops & cloud",
        "intelligence artificielle",
        "cybersécurité",
        "développement mobile",
        "programmation",
        "carrière tech",
        "outils & productivité",
        "freelance"
    ]

    /**
     * Fetch Latest Blogs
     */
    const fetchLatestBlogs = ( page = 1 ) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", {
            page
        })
        .then(({ data }) => {

            let formatedDate = filterPaginationData({
                
                state: blogs,
                data: data.blogs,
                page,
                counteRoute: "/all-latest-blogs-count"

            })

            setBlogs(formatedDate)

        })
        .catch(err => {
            console.log(err.message)
        })

    }

    /**
     * 
     * Fetch Trending Blogs (Populaire Blogs)
     * 
     */
    const fetchTrendingBlogs = () => {

        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
        .then(({ data }) => {
            setTrendingBlogs(data.blogs)
        })
        .catch(err => {
            console.log(err.message)
        })

    }

    /**
     * 
     * Fetch Blogs By tag 
     * 
     * @param {*} category 
     */
    const fetchBlogsByCategory = ( category ) => {
        
        axios.post(
            import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs",
            {
                tag: category
            }
        )
        .then(({ data }) => {
            setBlogs(data.blogs)
        })
        .catch(err => {
            console.log(err.message)
        })

    }

    /**
     * 
     * HandleLoadBlogByCategory (Event)
     * 
     * @param {*} e 
     * @returns 
     */
    const handleLoadBlogByCategory = (e) => {
        
        e.preventDefault()

        let category = e.currentTarget.innerText.trim().toLowerCase()   

        setBlogs(null)

        if(pageState == category){
            setPageState("Accueil")
            return 
        }

        setPageState(category)
        fetchBlogsByCategory(category)

    }

    /**
     * 
     * Charge Data
     * 
     */
    useEffect(() => {

        activeTabRef.current.click()

        if(pageState == "Accueil"){
            fetchLatestBlogs()
        }

        if(!trendingBlogs){
            fetchTrendingBlogs()
        }

    }, [pageState])
   
   
    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* latest blog */}
                <div className="w-full">
                    <InPageNavigation
                        routes={[pageState, "Articles populaires"]}
                        defaultHidden={["Articles populaires"]}
                    >

                       <>
                            {
                                blogs === null ?( 
                                    <Loader /> 
                                )
                                : 
                                    (
                                        blogs.length ?
                                        blogs.map((blog, i) => {
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
                                        message={"Aucun article trouvé pour cette catégorie."}
                                    />
                                )
                            }
                       </>
                       
                        {
                            trendingBlogs === null ? (
                                <Loader /> 
                            )
                            : 
                            trendingBlogs.length ? (
                                trendingBlogs.map((blog, i) => {
                                    return (
                                    <AnimationWrapper
                                        key={i}
                                        transition={{ duration: 1, delay: i * .1 }}
                                    >
                                        <MinimalBlogPost 
                                            key={i}
                                            blog={blog}
                                            index={i}
                                        />
                                    </AnimationWrapper>
                                        
                                )})
                            )
                            :
                            <NoDataMessage 
                                message={"Aucun article populaire pour le moment."}
                            />
                        }

                    </InPageNavigation>
                </div>
                {/* filter and trending blog */}
                <div
                    className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden"
                >
                    <div 
                        className="flex flex-col gap-10"
                    >
                        <div>
                            <h1 className="font-medium text-xl mb-8">Articles sur tous les centres d’intérêt</h1>

                            <div className="flex flex-wrap gap-3">
                                {
                                    categories.map((category, i) => {
                                        return (
                                            <button
                                                key={i}
                                                className={"tag cursor-pointer hover:opacity-60 duration-200 " + (pageState === category ? "bg-black text-white duration-100" : " ")}
                                                onClick={handleLoadBlogByCategory}
                                            >
                                                { category }
                                            </button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Populaires
                                <i className="fi fi-rr-arrow-trend-up ml-3"></i>
                            </h1>
                            {
                                trendingBlogs === null ? ( 
                                    <Loader /> 
                                )
                                : 
                                    trendingBlogs.length ? (
                                    trendingBlogs.map((blog, i) => {
                                        return (
                                        <AnimationWrapper
                                            key={i}
                                            transition={{ duration: 1, delay: i * .1 }}
                                        >
                                            <MinimalBlogPost 
                                                key={i}
                                                blog={blog}
                                                index={i}
                                            />
                                        </AnimationWrapper>
                                            
                                    )})
                                )
                                :
                                <NoDataMessage 
                                    message={"Aucun article populaire pour le moment."}
                                />
                            }
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default HomePage