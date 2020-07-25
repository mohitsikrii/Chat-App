const users = []
const addUser = ({ id, username, room }) => {
    //===================
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //===================
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }
    //==================
    const existingUser = users.find((user) => {
        return user.room===room & user.username ===username
    })
    if(existingUser){
        return{
            error: 'Username Already Exists'
        }
    }
    //==================
    
    //=================
    const user= {id , username , room}
    users.push(user)
    return{ user }
}

const removeUser=(id)=>{
    const index= users.findIndex((user)=>user.id===id)
    if( index !==-1 )
    {
        return users.splice(index,1)[0]
    }
} 

const getUser = (id) =>{
   return users.find((user)=>user.id===id)
    
}
const getAllUsersInRoom =(room)=>{
    const usersInARoom= users.filter((user)=>user.room===room)
        if (usersInARoom != -1)
        {
            return usersInARoom
        }
}





//===================================just testing
// let x= addUser({
//     id:22,
//     username:'sikri',
//     room:'sikri'
// })
// let y= addUser({
//     id:23,
//     username:'sikri2',
//     room:'sikri'
// })
// let z= addUser({
//     id:24,
//     username:'sikri3',
//     room:'sikri'
// })
// //=====
// let p= addUser({
//     id:25,
//     username:'prachi1',
//     room:'prachi'
// })
// let q= addUser({
//     id:26,
//     username:'prach2',
//     room:'prachi'
// })
// let r= addUser({
//     id:27,
//     username:'prachi3',
//     room:'prachi'
// })
// console.log(x)

// let y= addUser({
//     id:33,
//     username:'sikri',
//     room:'sikri'
// })

// console.log(y)

// let z= addUser({
//     id:33,
//     username:'',
//     room:'sikri'
// })

// console.log(z)

// console.log(users)
// const removedUser=removeUser(22)
// console.log(users)
//===============================
// const g = getUser(22)
// console.log(g)

// const t = getUser(22)
// console.log (t)

module.exports={
    getAllUsersInRoom,
    addUser,
    removeUser,
    getUser
}