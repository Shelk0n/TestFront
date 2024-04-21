const mainUrl = 'https://localhost:7137';

//document.cookie = "good_cookie=good_cookie; SameSite=None; Secure; Partitioned";

let unlock = true;
const timeout = 400;
const body = document.querySelector('body');
var lockPadding;
var lockPaddingValueArray = [];
var layoutShortPageItems;
var layoutShortPageItemsArray = [];
var popupLinks;
var popupCloseItem;
var documentsNav;

var resptext;

var shortPage;

var registerErrorText;
var regLoginField;
var regEmailField;
var regPasswordField;
var regPasswordRepField;
var registerContainer;

var accountButton;
var loginErrorText;
var loginContainer;
var loginField;
var passwordField;

function setHeader(headerText) {
    var header = document.createElement("header");
    header.innerHTML = headerText;
    header.id = 'header';
    //header.className = 'lock_padding';
    document.body.insertAdjacentElement('beforeend', header );
    popupLinks = document.querySelectorAll('.popup_link');
    lockPadding = document.querySelectorAll('.lock_padding');
    layoutShortPageItems = document.querySelectorAll('.lock_short_page');
    resptext = document.getElementById('idd');
    popupCloseItem = document.querySelectorAll('.close_popup');
    var registerButton = document.querySelector('.register_button');
    var noAccountButton = document.querySelector('.no_account');
    var loginButton = document.querySelector('.login_enter_button');
    accountButton = document.querySelector('.loginbtn');
    registerErrorText = document.querySelector('.error_register_text');

    registerContainer = document.getElementById('register_popup');
    regLoginField = registerContainer.querySelector('.login_input_field');
    regEmailField = registerContainer.querySelector('.email_input_field');
    regPasswordField = registerContainer.querySelector('.password_input_field');
    regPasswordRepField = registerContainer.querySelector('.repeat_password_input_field');

    documentsNav = document.querySelector(".documents_nav");

    loginContainer = document.getElementById('login_popup');
    loginField = loginContainer.querySelector('.login_input_field');
    passwordField = loginContainer.querySelector('.password_input_field');
    loginErrorText = loginContainer.querySelector('.login_error_text');

    checkLogged();

    registerButton.addEventListener('click', onRegisterClick);
    noAccountButton.addEventListener('click', function(){
      regLoginField.value = '';
      regEmailField.value = '';
      regPasswordField.value = '';
      regPasswordRepField.value = '';
      registerErrorText.classList.remove('show');
    })
    accountButton.addEventListener('click', function(){
      loginField.value = '';
      passwordField.value = '';
      if(accountButton.classList.contains("unlogged")){
        popupOpen(loginContainer);
      }else if(accountButton.classList.contains("logged")){
        window.location.href = "/account_page/account_page.html";
      }
    });
    loginButton.addEventListener('click', onLoginClick);

    var content = document.querySelector('.popup');
    content.style.visibility = false;
    document.addEventListener("DOMContentLoaded", function() {
      content.style.visibility = true;
    });

    documentsNav.addEventListener('click', function(){
      if(documentsNav.classList.contains("unlogged")){
        popupOpen(loginContainer);
      }
      else if (documentsNav.classList.contains("logged")){
        window.location.href = "/documents_page/documents_page.html";
      }
    });

    if(popupLinks.length > 0){
      for(let i = 0; i < popupLinks.length; i++){
        if (!popupLinks[i].classList.contains('unlogged')) {
          const popupLink = popupLinks[i];
          popupLink.addEventListener("click", function(e){
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const currentPopup = document.getElementById(popupName);
            popupOpen(currentPopup);
            e.preventDefault();
          });
        }
      }
    }
    if(popupCloseItem.length > 0){
      for(let i = 0; i < popupCloseItem.length; i++){
        const close = popupCloseItem[i];
        close.addEventListener("click", function(e){
          popupClose(close.closest('.popup'))
          e.preventDefault();
        });
      }
    };
}


function setFooter(headerText) {
  var footer =  document.createElement("footer");
  footer.innerHTML = headerText;
  footer.id = 'footer'
  footer.className = 'lock_padding';
  document.body.insertAdjacentElement('beforeend', footer);
}

function onRegisterClick(){
  
  registerErrorText.classList.remove('show');

  if(regLoginField.value === ''){
    registerErrorText.innerHTML = "Введите логин";
    registerErrorText.classList.add('show');
  }
  else if(regEmailField.value === ''){
    registerErrorText.innerHTML = "Введите электронную почту";
    registerErrorText.classList.add('show');
  }
  else if(regPasswordField.value === ''){
    registerErrorText.innerHTML = "Введите пароль";
    registerErrorText.classList.add('show');
  }
  else if(regPasswordRepField.value !== regPasswordField.value){
    registerErrorText.innerHTML = "Пароли не совпадают";
    registerErrorText.classList.add('show');
  }
  else{
    const data = {
      "username":regLoginField.value,
      "email":regEmailField.value,
      "hash":regPasswordField.value,
      "role":"user"
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    fetch(mainUrl + '/auth/register', options)
    .then(response => {
      if(!response.ok){
        registerErrorText.innerHTML = "Пользователь с таким именем или почтой уже существует";
    registerErrorText.classList.add('show');
      }
      else{
        popupClose(registerContainer);
      }
      return response.json;
    }).catch(error => {
      console.error(error)
    });
  }
}

function onLoginClick(){
  loginErrorText.classList.remove('show');

  if(loginField.value === ''){
    loginErrorText.innerHTML = "Введите логин";
    loginErrorText.classList.add('show');
  }
  else if(passwordField.value === ''){
    loginErrorText.innerHTML = "Введите пароль";
    loginErrorText.classList.add('show');
  }
  else{
    var xhr = new XMLHttpRequest();
    xhr.open('POST', mainUrl + '/auth/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              popupClose(loginContainer);
              setLogged();
              loadImage?.();
            } else {
                loginErrorText.innerHTML = "Неверная почта/логин или пароль.";
                loginErrorText.classList.add('show');
                console.error('Произошла ошибка:', xhr.status);
            }
        }
    };
    var data = JSON.stringify({ 
      "login":loginField.value,
      "password":passwordField.value });
    xhr.send(data);
  }
}




window.addEventListener('resize', function() {
  var contentHeight = document.body.scrollHeight;
  var windowHeight = window.innerHeight;
  if (contentHeight <= windowHeight) {
    layoutShortPage();
  }else{
    layoutLongPage();
  }
});

function layoutShortPage(){
  if(layoutShortPageItems.length > 0 && !shortPage){
    layoutShortPageItemsArray = [];
    for(let i = 0; i < layoutShortPageItems.length; i++){
      layoutShortPageItemsArray.push(window.getComputedStyle(lockPadding[i]).getPropertyValue('margin-right'));
      lockPadding[i].style.marginRight = parseInt(layoutShortPageItemsArray[i]) + 15 + 'px';
    }
    shortPage = true;
  }
}
function layoutLongPage(){
  if(layoutShortPageItems.length > 0){
    for(let i = 0; i < layoutShortPageItems.length; i++){
      lockPadding[i].style.marginRight = layoutShortPageItemsArray[i];
    } 
    shortPage = false;
  }
}

function popupClose(popupActive, doUnlock = true){
  if(unlock){
    popupActive.classList.remove('open');
    if(doUnlock){
      bodyUnlock();
    }
  }
}

function popupOpen(currentPopup){
  if(currentPopup && unlock){
    const popupActive = document.querySelector('.popup.open');
    if(popupActive){
      popupClose(popupActive, false);
    } else{
      bodyLock();
    }
    currentPopup.classList.add('open');
    currentPopup.classList.add('loaded');
    currentPopup.addEventListener("click", function(e){
      if(!e.target.closest('.popup_content')){
        popupClose(e.target.closest('.popup'));
      }
    });
  }
}

function bodyLock(){
  //const lockPaddingValue = window.innerWidth - document.getElementById('body').offsetWidth;
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  const lockPaddingValue = outer.offsetWidth - outer.clientWidth;
  document.body.removeChild(outer);
  
  if(document.body.scrollHeight > window.innerHeight){
    if(lockPadding.length > 0){
      lockPaddingValueArray = [];
      for(let i = 0; i < lockPadding.length; i++){
        const el = lockPadding[i];
        lockPaddingValueArray.push(window.getComputedStyle(el).getPropertyValue('margin-right'));
        el.style.marginRight = parseInt(lockPaddingValueArray[i].replace('px', '')) + parseInt(lockPaddingValue) + 'px';
      }
    }
    body.style.paddingRight = lockPaddingValue;
  }
  body.classList.add('lock');

  unlock = false;
  setTimeout(() => {
    unlock = true;
  }, timeout);
}

function bodyUnlock(){
  setTimeout(() => {
    if(lockPadding.length > 0){
      for(let i = 0; i < lockPadding.length; i++){
        const el = lockPadding[i];
        el.style.marginRight = lockPaddingValueArray[i];
      }
    }
    body.style.paddingRight = '0px';
    body.classList.remove('lock');
  }, timeout);

  unlock = false;
  setTimeout(() => {
    unlock = true
  }, timeout);
}

function setLogged(){
  var logElements = document.querySelectorAll(".unlogged");
  for(let i = 0; i < logElements.length; i++){
    logElements[i].classList.remove("unlogged");
    logElements[i].classList.add("logged")
  }
}
function setUnLogged(){
  var logElements = document.querySelector(".logged");
  if(logElements){
    for(let i = 0; i < logElements.length; i++){
      logElements[i].classList.remove("logged");
      logElements[i].classList.add("unlogged")
    }
  }
}

function checkLogged(){
  var xhr = new XMLHttpRequest();
    xhr.open('GET', mainUrl + '/auth/checkauth', true);
    xhr.withCredentials = true;
    xhr.onload = function() {
        if (xhr.status === 200) {
            setLogged();
        } else {
            setUnLogged();
        }
    };
    xhr.send();
}


fetch('/layout/header.html')
  .then(response => response.text())
  .then(html => {
  setHeader(html)})

fetch('/layout/footer.html')
  .then(response => response.text())
  .then(html => {
  setFooter(html)})

fetch('/layout/layout.css')
.then(response => response.text())
.then(css => {
  var styleElement = document.createElement('style');
  styleElement.innerHTML = css
  document.head.appendChild(styleElement)})
