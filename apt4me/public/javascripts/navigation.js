function startSession() {
    var email = $('#email').val();
    console.log(email);
    var params = { 'email': email };

    console.log(params)

    $.ajax({
        url: '',
        method: 'PUT',
        data: params,
        success: function (data) {
            console.log('success')
            var id = data.id;
            window.location = "/apartments/" + id;
        },
        error: function (data) {
            console.log('failed');
        }
    });
}


function getId() {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);

    return id;
}

function goToApartments() {
    var id = getId();

    window.location = "/apartments/" + id;
}

function goToReport() {
    var id = getId();

    window.location = "/report/" + id;
}

function goToOptions() {
    var id = getId();

    window.location = "/options/" + id;
}