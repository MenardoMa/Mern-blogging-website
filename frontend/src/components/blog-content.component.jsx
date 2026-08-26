const BlogContent = ({ block }) => {

    const { type, data } = block

    switch (type) {

        // --------------------------------
        // PARAGRAPH
        // --------------------------------

        case "paragraph":
            return (
                <p
                    className="text-xl leading-8 text-dark-grey mb-6"
                    dangerouslySetInnerHTML={{
                        __html: data.text || ""
                    }}
                />
            )


        // --------------------------------
        // HEADER
        // --------------------------------

        case "header":

            if (data.level === 1) {
                return (
                    <h1
                        className="text-5xl font-bold mt-10 mb-6"
                        dangerouslySetInnerHTML={{
                            __html: data.text
                        }}
                    />
                )
            }

            if (data.level === 3) {
                return (
                    <h3
                        className="text-3xl font-bold mt-8 mb-4"
                        dangerouslySetInnerHTML={{
                            __html: data.text
                        }}
                    />
                )
            }

            return (
                <h2
                    className="text-4xl font-bold mt-10 mb-5"
                    dangerouslySetInnerHTML={{
                        __html: data.text
                    }}
                />
            )


        // --------------------------------
        // LIST
        // ordered / unordered
        // --------------------------------

        case "list": {

            const ListTag = data.style === "ordered"
                ? "ol"
                : "ul"

            const listClass = data.style === "ordered"
                ? "list-decimal"
                : "list-disc"

            return (
                <ListTag
                    className={`${listClass} ml-8 mb-6 text-xl leading-8 text-dark-grey`}
                >
                    {data.items?.map((item, index) => {

                        // Certaines versions d'Editor.js
                        // peuvent retourner un objet au lieu d'un string
                        const text = typeof item === "string"
                            ? item
                            : item.content || item.text || ""

                        return (
                            <li
                                key={index}
                                dangerouslySetInnerHTML={{
                                    __html: text
                                }}
                            />
                        )
                    })}
                </ListTag>
            )
        }


        // --------------------------------
        // CHECKLIST
        // --------------------------------

        case "checklist":
            return (
                <div className="mb-6 text-xl leading-8 text-dark-grey">
                    {data.items?.map((item, index) => {

                        const checked =
                            item.meta?.checked ??
                            item.checked ??
                            false

                        return (
                            <div
                                key={index}
                                className="flex items-start gap-3 mb-3"
                            >

                                <input
                                    type="checkbox"
                                    checked={checked}
                                    readOnly
                                    className="mt-2 w-5 h-5"
                                />

                                <span
                                    className={
                                        checked
                                            ? "line-through opacity-60"
                                            : ""
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            typeof item === "string"
                                                ? item
                                                : item.text || ""
                                    }}
                                />

                            </div>
                        )
                    })}
                </div>
            )


        // --------------------------------
        // QUOTE
        // --------------------------------

        case "quote":
            return (
                <blockquote className="border-l-4 border-grey pl-6 my-8 italic text-xl text-dark-grey">

                    <p
                        dangerouslySetInnerHTML={{
                            __html: data.text || ""
                        }}
                    />

                    {data.caption && (
                        <cite className="w-full block mt-2 text-base not-italic">
                            — {data.caption}
                        </cite>
                    )}

                </blockquote>
            )


        // --------------------------------
        // CODE
        // --------------------------------

        case "code":
            return (
                <pre className="bg-grey p-5 rounded-lg overflow-x-auto mb-6">
                    <code>
                        {data.code}
                    </code>
                </pre>
            )


        // --------------------------------
        // IMAGE
        // --------------------------------

        case "image":
            return (
                <figure className="my-8">

                    <img
                        src={data.file?.url || data.url}
                        alt={data.caption || ""}
                        className="w-full rounded-lg"
                    />

                    {data.caption && (
                        <figcaption className="w-full text-center text-base md:mb-12 text-dark-grey my-3">
                            {data.caption}
                        </figcaption>
                    )}

                </figure>
            )


        // --------------------------------
        // DELIMITER
        // --------------------------------

        case "delimiter":
            return (
                <div className="my-10 text-center text-3xl text-dark-grey">
                    ***
                </div>
            )


        // --------------------------------
        // RAW HTML
        // --------------------------------

        case "raw":
            return (
                <div
                    className="mb-6"
                    dangerouslySetInnerHTML={{
                        __html: data.html || ""
                    }}
                />
            )


        // --------------------------------
        // WARNING
        // --------------------------------

        case "warning":
            return (
                <div className="my-8 p-5 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">

                    {data.title && (
                        <h4 className="font-bold text-lg mb-2">
                            {data.title}
                        </h4>
                    )}

                    <p
                        className="text-dark-grey"
                        dangerouslySetInnerHTML={{
                            __html: data.message || ""
                        }}
                    />

                </div>
            )


        // --------------------------------
        // DEFAULT
        // --------------------------------

        default:
            return null
    }
}

export default BlogContent
