const getUserDate = async (id, jwt) => {
  const data = await fetch(`http://localhost:3000/auth/users/${id}`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`  
    }
  })

  if (data.ok) {
    const userData = await data.json();  
    return userData
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
      for (let i = 0; i < data.length; i++) {
        const actualUser = await getUserDate(data[i].userId, token);
        createPost(data[i], actualUser);
      }

      openCommit();
      likePost()

    } catch (error) {
      window.location.href = '/frontend/index.html';
    }
  } else {
    window.location.href = '/frontend/index.html';
  }
}

let buttonCounter = 0;
let divCounter = 0;

function createPost(post, user) {
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
  userData.textContent = user.createdAt;

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
  likeButton.dataset.postid = post.id
  likeButton.classList.add('like-buttons')
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

  const invitBtn = document.createElement('button');
  const invitIcon = document.createElement('i');
  invitIcon.classList.add('fa-regular', 'fa-paper-plane');
  invitBtn.append(invitIcon);

  const userPhoto2 = document.createElement('img');
  userPhoto2.src = user.userPhoto;

  commitArea.append(userPhoto2, inputCommit, invitBtn);

  if (post.postCommit && post.postCommit.length > 0) {
    const hidenCommitDiv = document.createElement('div');
    hidenCommitDiv.classList.add('hide-commit', 'display');
    hidenCommitDiv.id = `content-${divCounter++}`;

    const hideButton = document.createElement('button');
    hideButton.textContent = 'Ver comentários.';
    hideButton.classList.add('see-commits');
    hideButton.id = buttonCounter++;

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
  } else {
    postContainer.append(header, postBody, postFooter, commitArea);
  }
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

feedPosts()

function likePost () {
  const buttons = document.querySelectorAll('.like-buttons')
  buttons.forEach((btn) => {
    btn.addEventListener('click', (ev) => {
      const clickedBtn = ev.currentTarget.dataset.postid
      likePostRequest(clickedBtn)
    })
  })
}

async function likePostRequest(postId) {
  const data = await fetch(`http://localhost:3000/feed/like/${postId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  
    }
  })

  console.log(data)
}