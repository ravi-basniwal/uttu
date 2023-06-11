import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams,Link} from 'react-router-dom'
const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
       fetch(`/user/${userid}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           //console.log(result)
         
            setProfile(result)
       })
    },[])


    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }
   return (
       <>
       {userProfile ?
       <div style={{
       maxWidth: "800px",
  margin:  "0 auto",
  padding: "20px",
      }}>
        <section class="profile">
			<div class="profile-image">
				<img  src={userProfile.user.pic}/>
			</div>
			<div class="profile-info">
				<h1>{userProfile.user.name}</h1>
			</div>
      <div >
      <a href="https://main--stirring-dusk-b91fa0.netlify.app/" target="_blank"><i  class="medium material-icons">chat_bubble_outline</i>
      </a>
      </div>
		</section>
    <h2>Applications</h2>
     
           <div className="gallery">
               {
                   userProfile.posts.map(item=>{
                       return(
                       <section class="posts">
			
			<article class="post">
				<h5>{item.title}</h5>
                {/* <div class="post-image">
                    <img src="Financial-services.jpg" alt="Post Image"/>
                  </div> */}
				<p>{item.body}</p>
				<h5>Accepted by:
                            {item.likes.map(like => <h6 key={like._id}> <Link
      to={
        like._id !== state._id
          ? "/profile/" + like._id
          : "/profile"
      }
    >
      {like.name},
    </Link></h6>)}</h5>
			</article>
      </section>
                       )
                   })
               }

           
           </div>
      
       </div>
       
       
       : <h2>loading...!</h2>}
       
       </>
   )
}


export default Profile