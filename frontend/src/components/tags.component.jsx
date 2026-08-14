const Tag = ({ tag, onTagDelete, onTagEdit }) => {
    
    /**
     * 
     * Rendre Editable le tag
     * 
     * @param {*} e 
     */
    const handleAddEditable = (e) => {
        e.preventDefault()
        e.target.setAttribute("contentEditable", true)
        e.target.focus()
    }

    return (
        <div
            className="relative p-2 mr-2 mb-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8"
        >
            <p 
                className="outline-none" 
                onKeyDown={ onTagEdit }
                onClick={handleAddEditable}
            >
                {tag}
            </p>
            <button
                className="rounded-full absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={ onTagDelete }
            >
                <i className="fi fi-br-cross text-xs pointer-events-none"></i>
            </button>
        </div>
    )
}

export default Tag
