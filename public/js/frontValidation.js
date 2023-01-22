var nameError = document.getElementById('name-error')
var lastnameError = document.getElementById('lastname-error')
var emailError = document.getElementById('email-error')
var direccionError = document.getElementById('direccion-error')
var avatarError = document.getElementById('avatar-error')
var passwordError = document.getElementById('password-error')
var passwordError1 = document.getElementById('password1-error')
var submitError = document.getElementById('submit-error')


function validateName(){
    var name = document.getElementById('contact-name').value;

    if (name.length==0){
        nameError.innerHTML= 'Ingrese su Nombre';
        return false
    }

    if (!name.match(/^[A-Za-z]+$/)){
        nameError.innerHTML= 'Solo ingrese letras'
        return false
    }
    nameError.innerHTML= '<i class="fa-sharp fa-solid fa-circle-check"></i>';
    return true
}

function validateLastName(){
    var name = document.getElementById('contact-lastname').value;

    if (name.length==0){
        lastnameError.innerHTML= 'Ingrese su Apellido';
        return false
    }

    if (!name.match(/^[A-Za-z]+$/)){
        lastnameError.innerHTML= 'Solo ingrese letras'
        return false
    }
    lastnameError.innerHTML= '<i class="fa-sharp fa-solid fa-circle-check"></i>';
    return true
}


function validateEmail(){
    var name = document.getElementById('contact-email').value;

    if (name.length==0){
        emailError.innerHTML= 'Ingrese su email';
        return false
    }

    if (!name.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)){
        emailError.innerHTML= 'Ingrese un email válido'
        return false
    }
    emailError.innerHTML= '<i class="fa-sharp fa-solid fa-circle-check"></i>';
    return true
}

function validateDireccion(){
    var name = document.getElementById('contact-direccion').value;

    if (name.length==0){
        direccionError.innerHTML= 'Ingrese su dirección de envíos';
        return false
    }

    if (name.length>0 && name.length<10){
        direccionError.innerHTML= 'Ingrese una dirección válida';
        return false
    }

    
    direccionError.innerHTML= '<i class="fa-sharp fa-solid fa-circle-check"></i>';
    return true
}
function validateAvatar(){
    var name = document.getElementById('contact-avatar').value;

    if (!name){// esta funcion complete verifica que se haya cargado una imagen
        avatarError.innerHTML= 'Cargue una imagen';
        return false
    }
    
    avatarError.innerHTML= '';
    return true
}

function validatePassword(){
    var name = document.getElementById('contact-password').value;

 

   if (!name.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)){
        passwordError1.innerHTML= 'Su clave debe tener minimo: 8 caracteres, 1 minúscula, 1 mayúscula, 1 caracter especíal'
        passwordError.innerHTML=''
        return false
    }

    
    passwordError.innerHTML= '<i class="fa-sharp fa-solid fa-circle-check"></i>'
    passwordError1.innerHTML= '';
    return true
}
function validateForm(){
    if(!validateName() || !validateLastName()|| !validateEmail() || !validateDireccion()  || !validatePassword() || !validateAvatar()){
        submitError.style.display = 'block';
        submitError.innerHTML='Por favor complete el formato'
        setTimeout(function(){ submitError.style.display = 'none';},3000)
        return false;
    }
}