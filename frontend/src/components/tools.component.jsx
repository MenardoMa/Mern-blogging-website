// Import Tools

import Embed from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"

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
            endpoints: {
                byFile: "http://localhost:3000/upload"
            }
        }
    },

    header: {
        class: Header,
        inlineToolbar: true,
        config: {
            placeholder: "Type Heading...",
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