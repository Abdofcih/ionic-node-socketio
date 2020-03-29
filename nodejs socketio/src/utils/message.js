const generateMessage = (username,text)=>{
    return {
        username,
        text,
        createdAt:new Date().getTime()
    }
}

const generateLocationMessage = (username,href)=>{
    return {
        username,
        href,
        createdAt:new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}