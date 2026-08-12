import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png"
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios"

import { storeInSession } from "../common/session"
import { useContext } from "react";
import { UserContext } from "../App";

const UserAuthForm = ({ type }) => {

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext)

    /**
     * Intregrate API Route, Sign up et Sign In
     * 
     * @param {*} serverRoute 
     * @param {*} formData 
     */
    const userAuthThroughServer = (serverRoute, formData) => {
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) => {
            storeInSession("user", JSON.stringify(data))
            
            setUserAuth(data)
        })
        .catch(({ response }) => {
            toast.error(response.data.error)
        })

    }

    /**
     * 
     * Submit Data, Lord du Sign up et Sign in
     * 
     * @param {*} e 
     * @returns 
     */
    const handleSubmit = (e) => {
        
        e.preventDefault()

        let serverRoute = type === "sign-in" ? "/signin" : "/signup"

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;    // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;      // regex for password

        // FormData
        let form = new FormData(e.currentTarget)
        let formData = {}

        for(let [key, value] of form.entries()){
            formData[key] = value
        }

        // Form Validation
        let { fullname, email, password } = formData;


        if ( type === "sign-up" ) {

            if (!fullname) {
                return toast.error("Entrez votre nom complet")
            }

            if (fullname.trim().length < 3) {
                return toast.error(
                    "Le nom complet doit contenir au moins 3 caractères"
                )
            }

            if (!password) {
                return toast.error("Entrez votre mot de passe")
            }

            if (!passwordRegex.test(password)) {
                return toast.error(
                    "Le mot de passe doit contenir entre 6 et 20 caractères, avec au moins une majuscule, une minuscule et un chiffre."
                )
            }
        }

        if (!email || !email.trim()) {
            return toast.error("Entrez votre email")
        }

        if (!emailRegex.test(email.trim())) {
            return toast.error("L'email est invalide")
        }

        if (type === "sign-in" && !password) {
            return toast.error("Entrez votre mot de passe")
        }

        userAuthThroughServer(serverRoute, formData)

    }

    return (

        access_token 
        ? 
        <Navigate to="/" /> 
        : 
        (
        <AnimationWrapper keyValue={ type }>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form 
                    className="w-[80%] max-w-[400px]"
                    onSubmit={handleSubmit}
                    >
                    <h1 className="text-3xl font-gelasio text-center mb-24">
                        { type == "sign-in" ? "Heureux de vous revoir." : "Rejoignez-nous dès aujourd'hui." }
                    </h1>

                    {
                        type != "sign-in" 
                        ? 
                            <>
                                <InputBox 
                                    name="fullname"
                                    type="text"
                                    placeholder="Nom complet"
                                    icon="fi-rr-user"
                                    /> 
                            </>
                        : 
                            ""
                    }

                    <InputBox 
                        name="email"
                        type="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    /> 

                    <InputBox 
                        name="password"
                        type="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    /> 

                    <button
                        type="submit"
                        className="btn-dark center mt-14 cursor-pointer"
                    >
                        { type.replace("-", " ") }
                    </button>

                    <div
                        className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold"
                    >
                        <hr className="w-1/2 border-black" />
                            or
                        <hr className="w-1/2 border-black" />
                    </div>

                    <button
                        type="button"
                        className="btn-dark flex items-center justify-center gap-4 w-[90%] center cursor-pointer"
                    >
                        <img 
                            src={googleIcon}
                            alt="Google"
                            className="w-5"
                        />
                        continue with google
                    </button>

                    {
                        type === "sign-in" 
                        ?
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have an account ?
                            <Link 
                                to="/signup" 
                                className="underline text-black text-xl ml-1"
                            >
                                Join us today
                            </Link>
                        </p>
                        :
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member ?
                            <Link 
                                to="/signin" 
                                className="underline text-black text-xl ml-1"
                            >
                                Sign in here.
                            </Link>
                        </p>
                    }

                </form>
            </section>
        </AnimationWrapper>
        )
    )
}

export default UserAuthForm