
const socket = io()
//=====================================
// socket.on('Updated Count is :',(count)=>{
//     console.log('Updated count:',count)
// })
//==========================
// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// })
//===================================
const $messageForm=document.querySelector('#message-form')
const $formButon=$messageForm.querySelector('button')
const $formInput=$messageForm.querySelector('input')
const $messages = document.querySelector('#messages')
//===================================
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//===============
const {username , room} = Qs.parse(location.search, {ignoreQueryPrefix:true})
//===========
const autoscroll=()=>{
    const $newMessage=$messages.lastElementChild

    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

    const visibleHeight=$messages.offsetHeight

    const containerHeight=$messages.scrollHeight

    const scrollOffset=$messages.scrollTop+ visibleHeight

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}

//

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    //==Disabling Send Button here
        $formButon.setAttribute('disabled','disabled')
       
    //==
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
    //==
        $formButon.removeAttribute('disabled')
        $formInput.value=''
        $formInput.focus()
    //==
        if (error) {
            return console.log(error)
        }
        console.log('delivered')
    })
})
//=================
socket.on('message', message => {
    console.log(message)

    const html=Mustache.render(messageTemplate,{
        message:message.text,
        username:message.username,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
//===================

socket.on('locationmessage', url => {
    console.log(url)
    const html=Mustache.render(locationTemplate,{
        url:url.url ,
        username:url.username,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

//=================
socket.on('RoomData',({room,users})=>{
   const html= Mustache.render(sidebarTemplate,{
       room,
       users
   })
   document.querySelector('#sidebar').innerHTML=html
})
//=================
document.querySelector('#fetchloc').addEventListener('click', (position) => {
    if (!navigator.geolocation) {
        return alert("Could not Fetch location , Try again after sometime")
    }
    navigator.geolocation.getCurrentPosition(position => {
        console.log(position)

        const positionow = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }
        socket.emit('locsent', positionow,() => {
            console.log('location Sent')
        })
    })

})
socket.emit('join',{username,room},(error)=>{
   if (error)
   {
       alert(error)
       
   }
})