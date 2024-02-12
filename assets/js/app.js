const cl = console.log;

const postContainer = document.getElementById("postContainer")
const titleControl = document.getElementById("title")
const bodyControl = document.getElementById("body")
const userIdControl = document.getElementById("userId")
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")
const postForm = document.getElementById("postForm")

let baseUrl = `https://promise-firebase-default-rtdb.asia-southeast1.firebasedatabase.app/`

let postUrl = `${baseUrl}/posts.json`;

const obtToArr = (object) => {
    let postArr = []
    for (const key in object) {
        let obj = object[key]
        obj.id = key;
        postArr.push(obj)
    }
    return postArr;
}

const createCard = (post) => {
    let card = document.createElement('div');
    card.className = "card mb-4"
    card.id = post.id;
    card.innerHTML = `
                       <div class="card-header">
                         <h2>${post.title}</h2>
                       </div>
                       <div class="card-body">
                          <p>${post.body}</p>
                       </div>
                       <div class="card-footer d-flex justify-content-between">
                         <button class="btn btn-outline-primary" type="button" onClick ="onEdit(this)">Edit</button>
                         <button class="btn btn-outline-danger" type="button" onClick ="onDelete(this)">Delete</button>
                       </div>
                    
                      `
    postContainer.append(card)
}

const onEdit = (eve) => {
    // cl(eve)
    let editId = eve.closest(".card").id;
    localStorage.setItem("updateId", editId)
    // cl(editId)
    let editUrl = `${baseUrl}/posts/${editId}.json`

    fetch(editUrl, {
        methodName: "GET",
        "Content-type": "application/json"
    })
        .then(res => {
            return res.json()
        })
        .then(res => {
            // cl(res)
            titleControl.value = res.title;
            bodyControl.value = res.body;
            userIdControl.value = res.userId;

            submitBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
        })
        .catch(cl)
}

const onUpdateHandler = () => {
    let updateId = localStorage.getItem("updateId")
    //  cl(updateId)
    let updateUrl = `${baseUrl}/posts/${updateId}.json`
    //  cl(updateUrl)

    let updatedObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value,
    }
    cl(updatedObj)

    fetch(updateUrl, {
        method: "PATCH",
        body: JSON.stringify(updatedObj),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => {
            return res.json()
        })
        .then(res => {
            cl(res)
            let children = [...document.getElementById(updateId).children]
            children[0].innerHTML = `<h2>${res.title}</h2>`
            children[1].innerHTML = `<p>${res.body}</p>`

            updateBtn.classList.add("d-none")
            submitBtn.classList.remove("d-none")

        })
        .catch(err => cl(err))
        .finally(() => postForm.reset())
}

updateBtn.addEventListener("click", onUpdateHandler)


const onDelete = (eve) => {
    let deleteId = eve.closest(".card").id;
    // cl(deleteId)
    let deletUrl = `${baseUrl}/posts/${deleteId}.json`
    // cl(deletUrl)

    fetch(deletUrl, {
        methodName: "DELETE",
        headers: {
            "Content-type": "application/json",
        }

    })
        .then(res => {
            return res.json()
        })
        .then(res => {
            cl(res)
            document.getElementById(deleteId).remove()
        })
        .catch(cl)
}

const templatingOfPosts = (arr) => {
    arr.forEach(posts => {
        createCard(posts)
    });
}

const onCreatePost = (eve) => {
    eve.preventDefault()
    // cl(eve)
    let postObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }
    cl(postObj)

    fetch(postUrl, {
        method: "POST",
        body: JSON.stringify(postObj),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(res => {
            return res.json()
        })
        .then(res => {
            // cl(res)
            postObj.id = res.name,
                createCard(postObj)
        })
        .catch(cl)
        .finally(() => {
            postForm.reset()
        })
}

postForm.addEventListener("submit", onCreatePost)


fetch(postUrl)
    .then(res => {
        // cl(res)
        return res.json()
    })
    .then(res => {
        let postArr2 = obtToArr(res)
        templatingOfPosts(postArr2)
    })
    .catch(err => {
        cl(err)
    })


