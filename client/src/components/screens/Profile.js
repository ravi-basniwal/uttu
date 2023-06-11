import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
       fetch('/mypost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           const myPosts = result
           myPosts.mypost.forEach((post) => {
           console.log(`Likes for post ${post._id}:`);
           post.likes.forEach((user) => {
           console.log(user);
  });
});
           setPics(result.mypost)
       })
    },[])
    useEffect(()=>{
       if(image){
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","Utkarsh")
        data.append("cloud_name","team-mate")
        fetch("https://api.cloudinary.com/v1_1/team-mate/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
    
       
           fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               //window.location.reload()
           })
       
        })
        .catch(err=>{
            console.log(err)
        })
       }
    },[image])
    const updatePhoto = (file)=>{
        setImage(file)
    }
   return (
    <div>
    
       <div  style={{
       maxWidth: "800px",
  margin:  "0 auto",
  padding: "20px",
      }}>
        {/* style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        maxWidth: "90%",
        margin: "20px auto",
      }} */}
  <section class="profile">
			<div class="profile-image">
				<img src={state ? state.pic : "loading"}/>
			</div>
			<div class="profile-info">
				<h1>{state ? state.name : "loading"}</h1>
			</div>
      <div >
      <a href="https://main--stirring-dusk-b91fa0.netlify.app/" target="_blank"><i  class="medium material-icons">chat_bubble_outline</i>
      </a>
      </div>
		</section>
    <h2>Applications</h2>
		
           {/* <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>

         
<div style={{
  display: "flex",
//   justifyContent: "space-around",
  alignItems: "flex-start"
}}>
  <div>
    <img style={{ width: "60px", height: "60px", borderRadius: "30px" }} src={state ? state.pic : "loading"} />
  </div>
  <div>

    <div style={{ flexGrow: 1 }}>
    <h4>{state ? state.name : "loading"}</h4>
    
  </div>
    
  </div>
</div>
        
            
            </div>       */}
           <div className="gallery">
               {
                   mypics.map(item=>{
                    //    return(
                    //     <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                    //    )
                    return (
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
    //                     <div key={item._id} className="item-container"  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    //                     <div className="item-box" >
    //                       <div className="item-header">
    //                         <h1 className="item-title">{item.title}</h1>
    //                         <div className="item-divider"></div>
    //                       </div>
                        
    //                       <p className="item-body">{item.body}</p>
    //                       <div className="item-buttons">
    //                        {
                      
    //                         <h2>Accepted by:
    //                         {item.likes.map(like => <h7 key={like._id}> <Link
    //   to={
    //     like._id !== state._id
    //       ? "/profile/" + like._id
    //       : "/profile"
    //   }
    // >
    //   {like.name},
    // </Link></h7>)}
    //                         </h2>
    //                        }
    //                       </div>
    //                     </div>
    //                   </div>
                      
                    );
                   })
               }

           
           </div>
          
       </div>
       </div>
       
 

       
   )
}


export default Profile