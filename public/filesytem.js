

$("#msgbutton").click(()=>{
    $('#chatDiv').show()
    $('#fileDiv').hide()

});
  
$("#filebutton").click(()=>{
   
    $('#chatDiv').hide()
    $('#fileDiv').show()

});
$(function() {
        
     $('.list-group-item').on('click', function() {
       $('.fas', this)
        .toggleClass('fa-angle-right')
        .toggleClass('fa-angle-down');
    }); 
    $("a").on("click",function(){
        //console.log(this.id)
        $.ajax({
            url: '/folder',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({path: this.id}),
            success: (data) => {
                console.log(data);
            }
            });
    })
  
  });