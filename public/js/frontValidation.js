window.addEventListener("load", function(){
    // Look for errors i.e. empty fields
    document.getElementById("frontValidation").addEventListener("submit", (e) => {
    
        for(var i = 0; i < document.querySelectorAll('#frontValidation input').length; i++) {
            // Check empty
            if(document.querySelectorAll('#frontValidation input')[i].value === "") {
                e.preventDefault();
    
                document.querySelectorAll('#frontValidation input')[i].style.color = 'red';
               document.querySelectorAll('#frontValidation input')[i].placeholder +=" REQUERIDO/A";
                
            } else {
               //document.querySelectorAll('#formproducto input')[i].style.color = 'black';
            }
        }
    });
    
    document.querySelectorAll('#frontValidation input').forEach(item => {
    item.addEventListener("input", (e) => {
    item.style.color = 'black';
    })
    });
    
    })