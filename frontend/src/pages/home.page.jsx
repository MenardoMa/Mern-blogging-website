import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";

import { activeTabRef } from "../components/inpage-navigation.component"

const HomePage = () => {
    
    const [blogs, setBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)
    const [pageState, setPageState] = useState("Accueil")

    const categories = [
        "développement web",
        "frontend",
        "backend",
        "bases de données",
        "devops & cloud",
        "intelligence artificielle",
        "cybersécurité",
        "développement mobile",
        "programmation",
        "carrière tech",
        "outils & productivité"
    ]

    /**
     * Fetch Latest Blogs
     */
    const fetchLatestBlogs = () => {

        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then(({ data }) => {
            setBlogs(data.blogs)
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

    const loadBlogByCategory = (e) => {
        
        e.preventDefault()

        let category = e.target.innerText.toLowerCase();

        setBlogs(null)

        if(pageState == category){
            setPageState("Accueil")
            return 
        }

        setPageState(category)

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
                                blogs === null ? <Loader /> 
                                : 
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
                            }
                       </>
                       
                        {
                            trendingBlogs === null ? <Loader /> 
                            : 
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
                                                onClick={loadBlogByCategory}
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
                                trendingBlogs === null ? <Loader /> 
                                : 
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
                            }
                        </div>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default HomePage