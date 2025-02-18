const getUserDate = async (id, jwt) => {
  const data = await fetch(`http://localhost:3000/auth/users/${id}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`  
    }
  });

  if (data.ok) {
    const userData = await data.json();  
    return userData;
  } else {
    console.error('Erro ao buscar dados do usuário:', data.status);
  }
}

async function feedPosts() {
  const data = await fetch(`http://localhost:3000/feed`).then((r) => r.json());
  console.log(data);

  const token = localStorage.getItem('token');

  if (token) {
    try {
      const userId = localStorage.getItem('userId');
      const currentUser = await getUserDate(userId, token);

      const userImage = document.getElementById('user-photo');
      userImage.src = currentUser.userPhoto;

      for (let i = 0; i < data.length; i++) {
        const actualUser = await getUserDate(data[i].userId, token);
        createPost(data[i], actualUser, currentUser);
      }

      openCommit();
      likePost();

      const btns = document.querySelectorAll('.invit-commit');
      btns.forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          const invitId = ev.currentTarget.dataset.postId;
          const input = document.getElementById(invitId);
          if (input.value !== '') {
            makeCommit(invitId, token, input.value); 
            input.value = '';
          }
        });
      });

    } catch (error) {
      window.location.href = '/frontend/index.html';
    }
  } else {
    window.location.href = '/frontend/index.html';
  }
}

let buttonCounter = 0;
let divCounter = 0;

function createPost(post, user, currentUser) {
  const container = document.querySelector('.post-content');

  const postContainer = document.createElement('div');
  postContainer.classList.add('post-container');

  const header = document.createElement('header');

  const userPhoto = document.createElement('div');
  userPhoto.classList.add('div-user-image');

  const photo = document.createElement('img');
  photo.src = user.userPhoto;
  userPhoto.append(photo);

  const userDataInfo = document.createElement('div');
  userDataInfo.classList.add('data-info');

  const userInfo = document.createElement('div');
  userInfo.classList.add('user-data');

  const userName = document.createElement('p');
  userName.textContent = user.userName;

  const userData = document.createElement('p');
  userData.textContent = post.createdAt;

  userInfo.append(userName, userData);
  userDataInfo.append(userPhoto, userInfo);

  const buttonBars = document.createElement('button');
  const icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-location-dot');
  buttonBars.append(icon);

  header.append(userDataInfo, buttonBars);

  const postBody = document.createElement('div');
  postBody.classList.add('post-body');

  if (post.postImage) {
    const postImage = document.createElement('img');
    postImage.src = post.postImage;
    const postTitle = document.createElement('h2');
    postTitle.textContent = post.postTitle;

    postBody.append(postTitle, postImage);
  } else {
    const postTitle = document.createElement('h2');
    postTitle.textContent = post.postTitle;

    postBody.append(postTitle);
  }

  const postFooter = document.createElement('div');
  postFooter.classList.add('footer');
  const likeButton = document.createElement('button');
  likeButton.dataset.postid = post.id;
  likeButton.classList.add('like-buttons');
  const button = document.createElement('i');
  button.classList.add('fa-regular', 'fa-thumbs-up');
  likeButton.append(button);

  const quantituLike = document.createElement('span');
  quantituLike.textContent = post.likes;

  postFooter.append(likeButton, quantituLike);

  const commitArea = document.createElement('div');
  commitArea.classList.add('commit-area');
  const inputCommit = document.createElement('input');
  inputCommit.type = 'text';
  inputCommit.placeholder = 'Comentar...';
  inputCommit.id = post.id;
  inputCommit.classList.add('input-commit');

  const invitBtn = document.createElement('button');
  invitBtn.classList.add('invit-commit');
  invitBtn.dataset.postId = post.id;

  const invitIcon = document.createElement('i');
  invitIcon.classList.add('fa-regular', 'fa-paper-plane');
  invitBtn.append(invitIcon);

  const userPhoto2 = document.createElement('img');
  userPhoto2.src = currentUser.userPhoto;

  commitArea.append(userPhoto2, inputCommit, invitBtn);

  const hidenCommitDiv = document.createElement('div');
  hidenCommitDiv.classList.add('hide-commit', 'display');
  hidenCommitDiv.id = `content-${post.id}`;

  const hideButton = document.createElement('button');
  hideButton.textContent = 'Ver comentários.';
  hideButton.classList.add('see-commits');
  hideButton.id = post.id;

  post.postCommit.forEach(async (comentario) => {
    const userCommitDivPost = document.createElement('div');
    userCommitDivPost.classList.add('user-commit-post');

    const commit = document.createElement('p');
    commit.textContent = comentario.commit;

    const userActual = await getUserDate(comentario.userId, localStorage.getItem('token'));
    const userPhoto = document.createElement('img');
    userPhoto.src = userActual.userPhoto;

    userCommitDivPost.append(userPhoto, commit);
    hidenCommitDiv.append(userCommitDivPost);
  });

  postContainer.append(header, postBody, postFooter, commitArea, hideButton, hidenCommitDiv);

  container.append(postContainer);
}

function openCommit() {
  const btns = document.querySelectorAll('.see-commits');
  
  btns.forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      const buttonClicked = ev.currentTarget;

      const correspondingContent = document.getElementById(`content-${buttonClicked.id}`); 

      if (buttonClicked.dataset.open === 'true') {
        correspondingContent.classList.add('display');
        buttonClicked.textContent = 'Ver comentários.';  
        buttonClicked.dataset.open = 'false'; 
      } else {
        correspondingContent.classList.remove('display');
        buttonClicked.textContent = 'Fechar comentário.';  
        buttonClicked.dataset.open = 'true';  
      }

    });
  });
}

function likePost() {
  const jwt = localStorage.getItem('token');
  const buttons = document.querySelectorAll('.like-buttons');
  
  buttons.forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      const clickedBtn = ev.currentTarget;
      likePostRequest(clickedBtn.dataset.postid, jwt, clickedBtn);
    });
  });
}

async function likePostRequest(postId, jwt, buttonElement) {
  const postData = await fetch(`http://localhost:3000/feed`).then((r) => r.json())
  postData.forEach(async(post) => {
    if (post.id === postId) {
      const isLiked = post.likedBy
      const userId = localStorage.getItem('userId');
      const alreadyLiked = isLiked.some(like => String(like.id) === userId); 
      
      if (alreadyLiked) {
        return; 
      }

      const data = await fetch(`http://localhost:3000/feed/like/${postId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`  
        }
      });
    
      if (data.ok) {
        const likeCountSpan = buttonElement.nextElementSibling;
        likeCountSpan.textContent = parseInt(likeCountSpan.textContent, 10) + 1;
      }
    }
  })
}



async function makeCommit(postId, jwt, commit) {
  const data = await fetch(`http://localhost:3000/feed/commit/${postId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`  
    },
    body: JSON.stringify({ commit }), 
  });

  if (data.ok) {
    const commitArea = document.getElementById(`content-${postId}`);

    if (commitArea) {
      const newComment = document.createElement('div');
      newComment.classList.add('user-commit-post');

      const userCommit = document.createElement('p');
      userCommit.textContent = commit;

      const currentUser = await getUserDate(localStorage.getItem('userId'), jwt);
      const userPhoto = document.createElement('img');
      userPhoto.src = currentUser.userPhoto;

      newComment.append(userPhoto, userCommit);

      commitArea.append(newComment);
    } else {
      console.error(`Commit area with ID content-${postId} not found`);
    }
  }
}

feedPosts();
