import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";

const HomePage = () => {
    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* latest blog */}
                <div className="w-full">
                    <InPageNavigation
                        routes={["Accueil", "Articles populaires"]}
                        defaultHidden={["Articles populaires"]}
                    >

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