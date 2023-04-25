const linkSection = document.querySelector('.links')
const errorMessage = document.querySelector('.error-message')
const newLinkForm = document.querySelector('.new-link-form')
const newLinkUrl = document.querySelector('.new-link-url')
const newLinkSubmit = document.querySelector('.new-link-submit')
const clearStorageButton = document.querySelector('.clear-storage')



const clearForm = () => {
    newLinkUrl.value = null
} 

const parseResponse = (text) => {
    // 获取指定URL的HTML，然后解析成DOM
    return new DOMParser().parseFromString(text, 'text/html')
}

// 找到title
const findTitle = (nodes) => {
    return nodes.querySelector('title').innerText
}

// 存储到localStorage
const storeLink  = (title, url) => {    
    localStorage.setItem(url, JSON.stringify({title: title, url: url}))
}

// 从localStorage中获取所有的链接
const getLinks = () => {
    return Object.keys(localStorage)
    .map(key => JSON.parse(localStorage.getItem(key)))
}

// 拼接成HTML
const convertToElement = (link) => {
    return `<div class="link"><h3>${link.title}</h3>
    <p><a href="${link.url}">${link.url}</a></p></div>`
}

const renderLinks = () => {
    const linkElements = getLinks().map(convertToElement).join('');
    linkSection.innerHTML = linkElements
}

const handleError = (error, url) => {
    errorMessage.innerHTML = `
        There was an issue adding "${url}": ${error.message}
    `.trim()
    setTimeout(() => errorMessage.innerText = null, 5000)
}

newLinkUrl.addEventListener('keyup', () => {
    console.log('newLinkUrl.validity.valid = ',newLinkUrl.validity.valid)
    newLinkSubmit.disabled = !newLinkUrl.validity.valid
})

newLinkForm.addEventListener('submit',(event) => {
    event.preventDefault()

    const url = newLinkUrl.value
    console.log('url = ',url)
    fetch(url)
    // 将响应当作文本来解析
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => storeLink(title, url))
    .then(clearForm)
    .then(renderLinks)
    .catch(error => handleError(error, url))
})

// 页面载入时，调用一次
renderLinks();


clearStorageButton.addEventListener('click' , () => {
    localStorage.clear()
    linkSection.innerHTML = ''
})


