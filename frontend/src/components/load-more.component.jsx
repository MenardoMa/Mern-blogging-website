import { useState } from "react";

const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
    
    const [loading, setLoading] = useState(false)

    const handleLoadMore = async () => {
        
        setLoading(true)

        try {
            
            await fetchDataFun({ page: state.page + 1 })

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    if( state != null && state.totalDocs > state.results.length){
        return (
            <button
                onClick={ handleLoadMore }
                disabled={ loading }
                className="text-dark-grey bg-grey p-3 px-6 font-medium mx-auto rounded-full capitalize flex items-center gap-2 cursor-pointer my-5"
            >
                {
                    loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-dark-grey border-t-transparent rounded-full animate-spin"></span>
                            Chargement...
                        </>
                    ) : ( "Voir plus" )
                }
            </button>
        )
    }
}

export default LoadMoreDataBtn