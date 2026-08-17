const LoadMoreDataBtn = ({ state, fetchDataFun }) => {
    
    if( state != null && state.totalDocs > state.results.length){
        return (
            <button
                onClick={() => fetchDataFun({ page: state.page + 1 })}
                className="text-dark-grey bg-grey p-3 px-6 font-medium mx-auto rounded-full capitalize flex items-center gap-2 cursor-pointer my-5"
            >
                Voir plus
            </button>
        )
    }
}

export default LoadMoreDataBtn