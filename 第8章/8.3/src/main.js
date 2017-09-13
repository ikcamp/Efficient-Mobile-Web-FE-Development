(() => {
    const $title = document.getElementById("tbTitle")
    const $markdown = document.getElementById("tbMarkdown")
    const $preview = document.getElementById("preview")
    const mdConverter = new showdown.Converter()
    const $saveBtn = document.getElementById("btnSave")
    const $addBtn = document.querySelector(".icon-add")
    const $list = document.querySelector(".list")

    let artical = {}

    const bindEvents = () => {
        $markdown.addEventListener("keyup", () => {
            renderPreview()
        })
        $list.addEventListener("click", (e) => {
            const target = e.target
            if (target.matches(".icon-delete")) {
                let $li = target.parentNode
                let id = parseInt($li.getAttribute("data-id"))
                MKDB.delete(id).then(() => {
                    renderList()
                })
            } else if (target.matches(".title")) {
                let $li = target.parentNode
                let id = parseInt($li.getAttribute("data-id"))
                MKDB.getById(id).then((data) => {
                    Object.assign(artical, {
                        id: parseInt($li.getAttribute("data-id"))
                    }, data)
                    renderArtical()
                })
            }
        })
        $addBtn.addEventListener("click", (e) => {
            artical = {}
            renderArtical()
            e.preventDefault()
        })
        $saveBtn.addEventListener("click", () => {
            Object.assign(artical, {
                title: $title.value,
                content: $markdown.value
            })
            console.log(artical)
            MKDB.save(artical).then(() => {
                renderList()
            }).catch((ex) => {
                console.log(ex)
            })

        })
    }

    const renderList = () => {
        window.MKDB.getAll().then((data) => {
            const frag = document.createDocumentFragment();

            data.forEach((item) => {
                let li = document.createElement("li")
                li.innerHTML = `<a href="#" class="title">${item.title}</a><div class="btn-delete icon-delete">`
                li.setAttribute("data-id", item.id)
                frag.appendChild(li)
            })
            $list.innerHTML = ""
            $list.appendChild(frag)
            console.log(data);
        })
    }

    const renderArtical = () => {
        const {title = "", content = ""} = artical
        $title.value = title
        $markdown.value = content
        renderPreview()
    }

    const renderPreview = () => {
        const result = convertMarkdown($markdown.value);
        $preview.innerHTML = result;
    }

    const convertMarkdown = (markdownStr) => {
        return mdConverter.makeHtml(markdownStr);
    }
    bindEvents()
    document.addEventListener("DOMContentLoaded", () => {
        renderList()
    })
})();