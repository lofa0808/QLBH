function app() {
  const username = document.querySelector('#username');
  const usernameSU = document.querySelector('#su__username');
  const passwords = document.querySelectorAll('.password');
  const wrapper = document.querySelector('.wrapper');
  const eyeCloses = document.querySelectorAll('.eye--hide');
  const eyeOpens = document.querySelectorAll('.eye--show');
  const signInLink = document.querySelector('.login-signin');
  const signUpLink = document.querySelector('.login-signup');
  const btnSignIn = document.querySelector('.btn--signin');
  const btnSignUp = document.querySelector('.btn--signup');
  const overlay = document.querySelector('.overlay');
  const loader = document.querySelector('.loader');
  const accountApi = 'http://localhost:3000/accounts';

  eyeCloses.forEach((eyeClose, index) => {
    eyeClose.onclick = function () {
      passwords[index].setAttribute('type', 'text');
      eyeClose.classList.remove('show');
      eyeClose.classList.add('hide');
      eyeOpens[index].classList.add('show');
      console.log('test');
    };
  });

  eyeOpens.forEach((eyeOpen, index) => {
    eyeOpen.onclick = function () {
      passwords[index].setAttribute('type', 'password');
      eyeOpen.classList.remove('show');
      eyeOpen.classList.add('hide');
      eyeCloses[index].classList.add('show');
    };
  });

  signInLink.onclick = function () {
    signInLink.classList.add('active');
    signUpLink.classList.remove('active');
    wrapper.style = 'transform: translateX(0)';
  };

  signUpLink.onclick = function () {
    signUpLink.classList.add('active');
    signInLink.classList.remove('active');
    wrapper.style = 'transform: translateX(calc(-50% - 15px))';
  };

  passwords[0].onkeyup = (e) => {
    if (e.which === 13) handleForm();
  };

  function handleForm() {
    let check = false;
    fetch(accountApi)
      .then((res) => res.json())
      .then((accounts) => {
        accounts.forEach((account) => {
          if (account.username === username.value && !check) {
            check = true;
            const password = passwords[0];
            if (account.password === password.value) {
              localStorage.setItem('username', username.value);
              overlay.style = 'display: block';
              loader.style = 'display: block';
              setTimeout(() => {
                overlay.style = 'display: none';
                loader.style = 'display: none';
                window.location = 'http://127.0.0.1:5500/Project/QLBH/index.html';
              }, 2000);
            } else {
              alert('M???t kh???u c???a b???n kh??ng kh???p.');
            }
          }
        });
        if (!check) {
          alert('T??n ????ng nh???p kh??ng t???n t???i.');
        }
      });
  }
  btnSignIn.onclick = handleForm;

  btnSignUp.onclick = function () {
    if (usernameSU.value == '' || passwords[1].value == '' || passwords[2].value == '') {
      alert('Kh??ng ???????c b??? tr???ng.');
      return;
    }
    fetch(accountApi)
      .then((res) => res.json())
      .then((accounts) => {
        for (let i = 0; i < accounts.length; i++) {
          const account = accounts[i];
          if (account.username === usernameSU.value) {
            alert('T??n ????ng nh???p ???? t???n t???i');
            break;
          }
        }
      });

    if (passwords[1].value !== passwords[2].value) {
      alert('M???t kh???u kh??ng tr??ng kh???p');
      return;
    }

    const data = {
      username: usernameSU.value,
      password: passwords[2].value,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    fetch(accountApi, options)
      .then((response) => response.json())
      .then(() => {
        alert('????ng k?? th??nh c??ng.');
      });
  };
}

app();
