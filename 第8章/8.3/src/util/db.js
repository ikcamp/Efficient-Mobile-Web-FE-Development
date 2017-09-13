(function ($window) {
    const indexedDB = $window.indexedDB
    const DB_NAME = "mkeditor"
    const STORE_NAME = "artical"
    const openDB = (version = 1) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, version)
            request.addEventListener("error", (e) => {
                reject(e.target.error)
            })
            request.addEventListener("success", (e) => {
                resolve(e.target.result)
            })
            request.addEventListener("upgradeneeded", (e) => {
                const db = e.target.result
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
                }
            });
        });
    }

    const wrapPromise = (fn) => {
        return new Promise((resolve, reject) => {
            const request = fn()
            request.addEventListener("error", (e) => {
                reject(e.target.error)
            })
            request.addEventListener("success", (e) => {
                resolve(e.target.result)
            })
        })
    }

    const getStore = (mode = "readonly") => {
        return openDB().then((db) => {
            return db.transaction(STORE_NAME, mode).objectStore(STORE_NAME)
        })
    }

    const add = (data) => {
        return getStore('readwrite').then((store) => {
            return wrapPromise(()=>{
                return store.add(data);
            })
        });
    }

    const save = (data) => {
        const id = data.id;
        if (id) {
            return getStore("readwrite").then((store) => {
                return wrapPromise(()=>{
                    return store.get(id)
                }).then((result)=>{
                    if(result){
                        Object.assign(result, data)
                        return wrapPromise(()=>{
                            return store.put(result)
                        })
                    }else{
                        return Promise.reject(new Error(`item with id ${id} not found`))
                    }
                })
            })
        }else{
            return add(data)
        }
    }

    const getAll = () => {
        return getStore().then((store) => {
            return new Promise((resolve, reject) => {
                const request = store.openCursor()
                let resuts = []
                request.addEventListener("success", (e) => {
                    const cursor = e.target.result
                    if (cursor) {
                        resuts.push(cursor.value)
                        cursor.continue()
                    } else {
                        return resolve(resuts)
                    }
                })
                request.addEventListener("error", (e) => {
                    reject(e.target.error)
                })
            })
        })
    }

    const getById = (id) => {
        return getStore().then((store) => {
            return wrapPromise(()=>{
                return store.get(id)
            })
        })
    }

    const delData = (id) => {
        return getStore("readwrite").then((store) => {
            return wrapPromise(()=>{
                return store.delete(id)
            })
        })
    }
    $window.MKDB = {
        save: save,
        getAll: getAll,
        getById: getById,
        delete: delData
    }
}(window))