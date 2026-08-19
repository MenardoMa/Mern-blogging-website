import { Link } from "react-router-dom";
import pageNotFoundImage from "../imgs/404-image.png"

const PageNotFound = () => {
    return (
        <section
            className="h-cover relative p-10 flex flex-col items-center gap-20 text-center"
        >
            <img 
                src={ pageNotFoundImage } 
                alt="Page not found" 
                className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
            />
            <h1
                className="text-4xl font-gelasio leading-7"
            >
                Page introuvable
            </h1>
            <p
                className="text-dark-grey text-xl leading-7 -mt-8"
            >
               La page que vous recherchez n’existe pas ou a été déplacée. 
               <Link
                    to={"/"}
                    className="ml-2 underline underline-offset-4 text-blue-400 hover:no-underline"
               >
                    Retour à l’accueil
               </Link>
            </p>
        </section>
    )
}

export default PageNotFound