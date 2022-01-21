// 等服务器部署之后补上
const url = ""
// switch state
const tabs = document.querySelectorAll('.account-tab')
const fragContainer = document.querySelector("#fragment-container")
// 选择短信登录/注册时显示的内容
const registerInnerHtml = `
                <p id="remind-content">请仔细阅读 <span style="color: #41ac52;cursor: pointer;" onclick="window.location.href = 'https://accounts.douban.com/passport/agreement'">豆瓣使用协议 豆瓣个人信息保护政策</span></p>
                <div class="input-box">
                    <div id="plus-86">+86</div>
                    <input id="input-phone" style="width: 80%;"
                        size="22" maxlength="60" placeholder="手机号">
                </div>
                <div class="input-box">
                    <input id="input-verification-code" style="width: 73%;"
                        size="22" maxlength="60" placeholder="输入验证码">
                    <div id="get-verification-code">获取验证码</div>
                </div>
                <div id="submit-btn">
                    登录豆瓣
                </div>
                <div style="width: 100%;height: fit-content;margin-top: 10px;display: flex;justify-content: end;">
                    <div id="cannot-get-verification-code" style="color:#41ac52;cursor: pointer;">收不到验证码</div>
                </div>
        `
// 选择密码登录时显示的内容
const loginInnerHtml = `
                <div style="margin-top: 20px;"></div>
                <div class="input-box">
                    <input id="input-id"
                        size="22" maxlength="60" placeholder="手机号/邮箱">
                </div>
                <div class="input-box">
                    <input id="input-password" style="width: 75%;"
                        size="22" maxlength="60" placeholder="输入密码">
                    <div id="get-verification-code" style="color: #9b9b9b; width: 25%;">找回密码</div>
                </div>
                <div id="submit-btn">
                    登录豆瓣
                </div>
        `
// current state
let isRegisterView = true
tabs.forEach((value, key) => {
    value.addEventListener('click', _e => {
        if (!value.classList.contains("on")) {
            value.classList.add("on")
            const k = key == 0 ? 1 : 0
            if (value.textContent == "短信登录/注册") {
                fragContainer.innerHTML = registerInnerHtml
                isRegisterView = true
                setSubmitBtnListener()
            } else {
                fragContainer.innerHTML = loginInnerHtml
                isRegisterView = false
                setSubmitBtnListener()
            }
            tabs[k].classList.remove("on")
        }
    })
})
setSubmitBtnListener()

function setSubmitBtnListener() {
    // 必须重新获取，因为重写了页面
    const submitBtn = document.querySelector("#submit-btn")
    const getVerificationCode = document.querySelector("#get-verification-code")
    submitBtn.addEventListener('click', () => {
        if (isRegisterView) {
            const inputPhone = document.querySelector("#input-phone")
            const inputVerificationCode = document.querySelector("#input-verification-code")
            register(inputPhone.content, inputVerificationCode.content, "sms")
        } else {
            const inputId = document.querySelector("#input-id")
            const inputPassword = document.querySelector("#input-password")
            login(inputId.content, inputPassword.content, "password")
        }
    })
    getVerificationCode.addEventListener('click', () => {
        if (isRegisterView) {
            // TODO 发送验证码
            alert('验证码已发送!')
        } else {
            // 忘记密码
        }
    })
}

async function login(account, token, type) {
    const formData = new FormData()
    formData.append("account", account)
    formData.append("token", token)
    formData.append("type", type)
    const res = await fetch(url + "/user/login", {
        method: "POST",
        body: formData,
    })
    const obj = await res.json()
    switch (obj.status) {
        case 20000: {
            // 成功辣
            localStorage.setItem("authorization", obj.data.access_token)
            alert('登录成功')
            window.location.href = '../index.html'
            break
        }
        default: {
            alert("登录失败")
        }
    }
}

async function register(account, token, type) {
    const formData = new FormData()
    formData.append("account", account)
    formData.append("token", token)
    formData.append("type", type)
    const res = await fetch(url + "/user/register", {
        method: "POST",
        body: formData,
    })
    const obj = await res.json()
    switch (obj.status) {
        case 20000: {
            localStorage.setItem("authorization", obj.data.access_token)
            alert('注册成功')
            window.location.href = '../index.html'
            break
        }
        default: {
            alert("注册失败")
        }
    }
}