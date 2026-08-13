// Import Tools

import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"

import axios from "axios" // sert a publier l'image depuis Text Rich

/**
 * Upload Image From EditorJS
 * 
 * @param {*} file 
 * @param {*} folder 
 * @returns 
 */
const uploadImageFromEditorJS = async (file, folder) => {

    const formData = new FormData()

    formData.append("image", file)
    formData.append("folder", folder)

    try {

        const { data } = await axios.post(
            import.meta.env.VITE_SERVER_DOMAIN + "/upload",
            formData
        )

        return {
            success: 1,
            file: { url: data.url }
        }

    } catch (error) {

        console.log(error)
        return { success: 0 }
    }
}



export const tools = {

    embed: {
        class: Embed,
        inlineToolbar: true
    },

    list: {
        class: List,
        inlineToolbar: true
    },

    image: {
        class: Image,
        inlineToolbar: true,
        config: {
            
             uploader: {
                uploadByFile(file) {
                    return uploadImageFromEditorJS(file, "content")
                }
            }

        }
    },

    header: {
        class: Header,
        inlineToolbar: true,
        config: {
            placeholder: "Écrivez un titre...",
            levels: [2, 3, 4],
            defaultLevel: 2
        }
    },

    quote: {
        class: Quote,
        inlineToolbar: true
    },

    marker: {
        class: Marker
    },

    inlineCode: {
        class: InlineCode
    }

}