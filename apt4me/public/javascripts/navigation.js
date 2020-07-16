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