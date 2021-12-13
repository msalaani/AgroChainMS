


$('.dropdown-el').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).toggleClass('expanded');
    $('#' + $(e.target).attr('for')).prop('checked', true);
    var selected = e.target.textContent;
    console.log(selected);
    localStorage.setItem('account', selected);

});


$(document).click(function () {
    $('.dropdown-el').removeClass('expanded');
});


$(document).on("click", "#signIn", function (event) {
    console.log(event);
    console.log(localStorage.getItem('account'));

    if (localStorage.getItem('account') == "Farmer") {
        window.location.href = "farmer.html"
    }
    else if (localStorage.getItem('account') == "Customer") {
        window.location.href = "customer.html"
    }

})

