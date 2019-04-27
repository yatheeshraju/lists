$(document).ready(function () {
   $('.delete-item').on('click',function (e) {
     $target= $(e.target);
     const id = $target.attr('data-id');
     $.ajax({
        type:'DELETE',
        url:'/list/item/'+id,
        success:function (response) {
            alert('deleted Listing !');
            window.location.href='/';
        },
        error:function (err) {
            console.log(err);
        }
     });  
   });
   
});