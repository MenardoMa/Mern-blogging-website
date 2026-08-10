import InputBox from "../components/input.component";

const UserAuthForm = ({ type }) => {

    return (
        <section className="h-cover flex items-center justify-center">
            <form action="" className="w-[80%] max-w-[400px]">
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

            </form>
        </section>
    )
}

export default UserAuthForm