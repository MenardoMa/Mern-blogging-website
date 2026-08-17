import axios from "axios";

export const filterPaginationData = ({ create_new_arr = false, state, data, page, counteRoute, data_to_send }) => {

    let obj; 

    if( state !== null && !create_new_arr){
        obj = { ...state, results: [ ...state.results, ...data ], page: page }
    }else{

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + counteRoute, data)
        .then(({ data : { totalDocs } }) => {
            
            obj = { results: data, page: 1, totalDocs }

        })
        .catch(err => {
            console.log(err)
        })

    }

    return obj

}