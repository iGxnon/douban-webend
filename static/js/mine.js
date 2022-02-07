import { getMineInfo, getMovieInfo, getWatchedList, getWishToWatchList, putUserInfo } from "./api.js";
import { ACCESS_TOKEN } from "./consts.js";
import { setup } from "./top-bar-status.js";
import { getUserIdFromToken } from "./utils.js";

const fragmentContainer = document.querySelector("#fragment-user-info")
const pager = document.querySelector("#pager")
// 是否正在编辑个人信息
let editing = false
// profile fragment
const fragProfile = `
                <h1 id="user-id">Rain</h1>
                <p id="user-description">Student | Software Engineering | Learning Android & Web-FrontEnd | Focusing on learning</p>
                <div id="info-box">
                    <div style="display: flex;align-items: center;margin: 20px 0px 0px 0px;">
                        <embed src="../images/phone.svg" type="image/svg+xml" />
                        <p id="phone-number" style="display: inline;margin-left: 10px;">15683055233</p>
                    </div>
                    <div style="display: flex;align-items: center;margin: 20px 0px 0px 0px;">
                        <embed src="../images/email.svg" type="image/svg+xml" />
                        <p id="email" style="display: inline;margin-left: 10px;">rain@asgard.hk</p>
                    </div>
                </div>
                <div id="edit-button" class="button">Edit Profile</div>
`
// edit fragment
const fragEditing = `
<h4>Name</h4>
<input id="user-id" type="text">
<h4>Discription</h4>
<input id="user-description" type="text">
<h4>Avatar</h4>
<input id="user-avatar-edit" type="text">
<h4>Phone</h4>
<input id="user-phone" type="text" disabled>
<h4>Email</h4>
<input id="user-email" type="text" disabled>
<div>
    <div id="submit-btn" class="button">Submit</div>
    <div id="cancel-btn" class="button">Cancel</div>
</div>
`

// setup topbar
setup()

// load user info
loadUserInfo()

// 初始化tab的点击事件
setupTabEvents()

function setupTabEvents() {
    const tabs = document.querySelectorAll("#tab li")
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(tab => tab.classList.remove("selected"))
            tab.classList.add("selected")
            switchTabFragment(tab.textContent)
        })
    })
}

// 切换fragment
async function switchTabFragment(tabName) {
    switch (tabName) {
        case "想看": {
            // 切换到想看的fragment
            const data = await getWishToWatchList()
            pager.innerHTML = ""
            if (data.status === 20000) { 
                data.data.forEach(movie => {
                    const movieInfo = await getMovieInfo(movie.mid).data
                    const movieElement = document.createElement("movie-card")
                    movieElement.setAttribute("src", movieInfo.avatar)
                    movieElement.setAttribute("movie", movieInfo.name)
                    movieElement.setAttribute("score", movieInfo.score.score)
                    pager.appendChild(movieElement)
                })
            } else {
                alert(data.info)
            }
        }
        case "看过": {
            // 切换到看过的fragment
            const data = await getWatchedList()
            pager.innerHTML = ""
            if (data.status === 20000) {
                data.data.forEach(movie => {
                    const movieInfo = await getMovieInfo(movie.mid).data
                    const movieElement = document.createElement("movie-card")
                    movieElement.setAttribute("src", movieInfo.avatar)
                    movieElement.setAttribute("movie", movieInfo.name)
                    movieElement.setAttribute("score", movieInfo.score.score)
                    pager.appendChild(movieElement)
                })
            } else {
                alert(data.info)
            }
        }
        case "我的影评": {
            // TODO
        }
        case "片单": {
            // TODO
        }
        default: {
            throw new Error("Invalid tab name")
        }
    }
}

// 加载用户信息
async function loadUserInfo() {
    const userId = document.querySelector("#user-id")
    const userDescription = document.querySelector("#user-description")
    const email = document.querySelector("#email")
    const phoneNumber = document.querySelector("#phone-number")
    const avatar = document.querySelector("#user-avatar")
    document.querySelector("#edit-button").addEventListener("click", switchProfileEditFragment)
    // 请求数据
    const data = await getMineInfo()
    switch (data.status) {
        case 43: {
            // 设置基础信息
            userId.textContent = data.data.username
            userDescription.textContent = data.data.description
            email.textContent = data.data.email
            phoneNumber.textContent = data.data.phoneNumber
            avatar.style.background = `url(${data.data.avatar})`
            break
        }
        default: {
            // 请求个人数据失败，跳转主页
            alert("请求个人数据失败，正在跳转到主页...")
            window.location.href = "../index.html"
        }
    }
}

// 切换到编辑个人信息的fragment
function switchProfileEditFragment() {
    // 拿到编辑前的个人信息
    const userId = document.querySelector("#user-id").textContent
    const userDescription = document.querySelector("#user-description").textContent
    const email = document.querySelector("#email").textContent
    const phoneNumber = document.querySelector("#phone-number").textContent
    const _avatar = document.querySelector("#user-avatar").style.background
    const avatar = _avatar.slice(4, _avatar.length - 1)
    // 更改fragment
    fragmentContainer.innerHTML = fragEditing
    // 更改状态
    editing = true
    // 设置编辑前的信息
    // 只允许修改不重要信息
    const userIdInput = document.querySelector("#user-id")
    const userDescriptionInput = document.querySelector("#user-description")
    const emailInput = document.querySelector("#user-email")
    const phoneNumberInput = document.querySelector("#user-phone")
    const avatarInput = document.querySelector("#user-avatar-edit")
    userIdInput.value = userId
    userDescriptionInput.value = userDescription
    emailInput.value = email
    phoneNumberInput.value = phoneNumber
    avatarInput.value = avatar
    // 绑定事件
    document.querySelector("#submit-btn").addEventListener("click", async () => {
        // 提交修改
        const username = userIdInput.value
        const description = userDescriptionInput.value
        const avatar = avatarInput.value
        // 发送请求
        await putUserInfo(getUserIdFromToken(localStorage.getItem(ACCESS_TOKEN)), username, avatar, description)
        switchProfileFragment()
    })
    document.querySelector("#cancel-btn").addEventListener("click", () => {
        switchProfileFragment()
    })
}

function switchProfileFragment() {
    // 切换到个人信息的fragment
    fragmentContainer.innerHTML = fragProfile
    editing = false
    loadUserInfo()
}


