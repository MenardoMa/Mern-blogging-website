import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";

const HomePage = () => {
    
    const [blogs, setBlogs] = useState(null)

    const fetchLatestBlogs = () => {

        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then(({ data }) => {
            setBlogs(data.blogs)
        })
        .catch(err => {
            console.log(err.message)
        })

    }

    console.log(blogs)

    useEffect(() => {
        fetchLatestBlogs()
    }, [])
   
   
    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* latest blog */}
                <div className="w-full">
                    <InPageNavigation
                        routes={["Accueil", "Articles populaires"]}
                        defaultHidden={["Articles populaires"]}
                    >

                       <h1>Les derniers articles</h1>
                       <h1>Les articles tendance</h1>

                    </InPageNavigation>
                </div>
                {/* filter and trending blog */}
                <div>

                </div>
            </section>
        </AnimationWrapper>
    )
}

export default HomePage