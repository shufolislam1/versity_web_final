function showLoggedUserName() {
  const nameSpan = document.getElementById("logged-username");
  let user = localStorage.getItem("loggedInUser");
  if (user) {
    user = JSON.parse(user);
  }
  nameSpan.innerText = user?.userName;
}

//run the showLoggedUserName automatically
showLoggedUserName();


const checkLoggedInUserName = () => {
  let userName = localStorage.getItem("loggedInUser");
  if (userName) {
    userName = JSON.parse(userName);
  } else {
    window.location.href = "/index.html";
  }
};

const logOut =() => {
  localStorage.clear();
  checkLoggedInUserName();
}


const fetchAllPosts = async () =>{
    let data;

    try{
        const res = await fetch('http://localhost:3000/getAllPosts')
        data = await res.json()
        showAllPosts(data)
    }
    catch(err){
        console.log("error fetching data from server", err);
    }
}

const showAllPosts = (allposts) =>{
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = '';

    allposts.forEach(async (post) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
        
        <div class="post">
        <div class="post-header">
          <div class="post-user-img">
            <img src=${post.postedUserImage} alt="" srcset="" />
          </div>
          <div class="post-username-time">
            <p class="post-username">${post.postedUserName}</p>
            <div class="posted-time">
              <span>${timeDifference(`${post.postedTIme}`)}</span>
              <span>ago</span>
            </div>
          </div>
        </div>

        <div class="post-text">
          <p class="post-text-content">
            ${post.postText}
          </p>
        </div>

        <div class="post-image">
          <img src=${post.postImageUrl} alt="" srcset="" />
        </div>
        
        `
        postContainer.appendChild(postDiv)

        // comment for a post
        let postComments = await fetchAllCommentsofAPost(post.postId)

        postComments.forEach((comment) => {
          const commentDiv = document.createElement("div");
          commentDiv.classList.add("comment-holder");
    
          commentDiv.innerHTML = `

            <div class="comment">
            <div class="comment-user-image">
              <img src=${comment.commentedUserImage} alt="" />
            </div>
          </div>
          <div class="comment-text-container">
            <h4>${comment.commentedUseName}</h4>
            <p class="comment-text">
            ${comment.commentText}
            </p>
          </div>
            `;
          postDiv.appendChild(commentDiv);
        });


    //make a new comment input
    let postCommentDiv = document.createElement("div");
    postCommentDiv.classList.add("postComment-holder");
    postCommentDiv.innerHTML = `

        <div class="comment-section">
          <input
            type="text"
            placeholder="Post your comment"
            class="comment-input"
            id = "postComment-input-for-${post.postId}"
          />
          <button class="comment-button" onClick = "handlePostComment(${post.postId})">Comment</button>
        </div>

  `;
    postDiv.appendChild(postCommentDiv);
    })
}

const handlePostComment = async (postId) => {
  const commentText = document.getElementById(
    `postComment-input-for-${postId}`
  ).value;

  // current time
  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  
  let commentTime = now.toISOString().slice(0, 19).replace('T', ' ');
  

  let user = localStorage.getItem('loggedInUser');
  if (user) {
    user = JSON.parse(user);
  }

  let commentedUserId = user.user_id;

  let commentObject = {
    commentOfPostId: postId,
    commentedUserId: commentedUserId,
    commentTime: commentTime,
    commentText: commentText,
  };

  try{
    const res = await fetch("http://localhost:3000/postComment", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(commentObject),
    });
  
    const data = await res.json();
  }
  catch(err){
    console.log('Error while sending data to server', err);
  }finally{
    location.reload();
  }
};

const fetchAllCommentsofAPost = async (postId) =>{
  let commentsOfPost = [];

  try{
    const res = await fetch(`http://localhost:3000/getAllComments/${postId}`)
    commentsOfPost = await res.json();
  }catch(err){
    console.log('error fetching comments from server: ', err);
  }
  finally{
    return commentsOfPost;
  }
}


const handleAddNewPost = async () => {
  const postText = document.getElementById("new-post").value;
  const postImageUrl = document.getElementById("new-post-img-url").value;

  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  let postedTime = now.toISOString().slice(0, 19).replace('T', ' ');

  let user = localStorage.getItem("loggedInUser");
  if (user) {
    user = JSON.parse(user);
  }
  let postUserId = user?.user_id;
  console.log(postUserId);

  const newPostObject = {
    postUserID: postUserId,
    postedTIme: postedTime,
    postText: postText,
    postImageUrl: postImageUrl,
  };

  const res = await fetch("http://localhost:3000/addNewPost", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newPostObject),
  });

  const data = await res.json();
  console.log("new post data from server: ", data);

  //reload the page for seeing the new post
  location.reload();
};

fetchAllPosts()
checkLoggedInUserName()
showLoggedUserName()