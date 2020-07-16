function loadAptCreator() {
    console.log('loading apt creator');

    generateTagButtons('new');

    //clear the input fields
    $('#beds').val('');
    $('#baths').val('');
    $('#rent').val('');
    $('#deposit').val('');
    $('#sqft').val('');
}

function createApartment() {
    var complex = $('#complex').val();
    var name = $('#name').val();
    var beds = $('#beds').val();
    var baths = $('#baths').val();
    var rent = $('#rent').val();
    var deposit = $('#deposit').val();
    var sqft = $('#sqft').val();

    var tags = getSelectedTags('new');

    var apartment = {
        'complex': complex, 'name': name, 'beds': beds, 'baths': baths,
        'rent': rent, 'deposit': deposit, 'sqft': sqft, 'tags': tags
    };

    var params = { 'apartment': apartment };

    var id = getId();

    $.ajax({
        url: '/apartments/' + id + '/new',
        method: 'POST',
        data: params,
        success: function (data) {
            console.log('success with data: ' + data);
            refreshAptList();
            $('#newAptModal').modal('toggle');
        },
        error: function (data) {
            console.log('failed with data' + data.email + " beds/baths " + data.beds + '/' + data.baths);
        }
    });
}

function loadAptEditor(index) {
    generateTagButtons('edit');

    var id = getId();

    $.ajax({
        url: '/apartments/' + id + '/details',
        data: {'index': index },
        method: 'GET',
        success: function (data) {
            $('#indexEdit').val(index);
            $('#complexEdit').attr('placeholder', data.apartment.complex);
            $('#complexEdit').val(data.apartment.complex);
            $('#nameEdit').attr('placeholder', data.apartment.name);
            $('#nameEdit').val(data.apartment.name);
            $('#rentEdit').attr('placeholder', data.apartment.rent);
            $('#rentEdit').val(data.apartment.rent);
            $('#depositEdit').attr('placeholder', data.apartment.deposit);
            $('#depositEdit').val(data.apartment.deposit);
            $('#bedsEdit').attr('placeholder', data.apartment.beds);
            $('#bedsEdit').val(data.apartment.beds);
            $('#bathsEdit').attr('placeholder', data.apartment.baths);
            $('#bathsEdit').val(data.apartment.baths);
            $('#sqftEdit').attr('placeholder', data.apartment.sqft);
            $('#sqftEdit').val(data.apartment.sqft);

            selected = data.apartment.tags;

            $.each(selected, function (key, value) {
                console.log(value);
                $('#' + value.replace(" ", "-")).addClass('active');
                $('#' + value.replace(" ", "-")).prop('checked', true);
            })
        }
    });
}

function updateApartment() {
    var complex = $('#complexEdit').val();
    var name = $('#nameEdit').val();
    var index = $('#indexEdit').val();
    var beds = $('#bedsEdit').val();
    var baths = $('#bathsEdit').val();
    var rent = $('#rentEdit').val();
    var deposit = $('#depositEdit').val();
    var sqft = $('#sqftEdit').val();

    var tags = getSelectedTags('edit');

    var apartment = {
        'complex': complex, 'name': name, 'beds': beds, 'baths': baths,
        'rent': rent, 'deposit': deposit, 'sqft': sqft, 'tags': tags
    };

    var params = { 'index': index, 'apartment': apartment };

    var id = getId();

    $.ajax({
        url: '/apartments/' + id + '/edit',
        method: 'PUT',
        data: params,
        success: function (data) {
            console.log('success with data: ' + data);
            //window.location.href = './apartments'
            refreshAptList();
            $('#editAptModal').modal('toggle');
        },
        error: function (data) {
            console.log('failed with data' + data.email + " beds/baths " + data.beds + '/' + data.baths);
        }

    });
}

function deleteApartment(index) {
    var params = {'index': index };

    var id = getId();

    $.ajax({
        url: '/apartments/' + id + '/delete',
        method: 'DELETE',
        data: params,
        success: function (data) {
            console.log('success with data: ' + data);
            refreshAptList();
        },
        error: function (data) {
            console.log('failed to delete apartment with index ' + index);
        }

    });
}

function refreshAptList() {
    //clear to prevent duplication
    $('#aptList').empty();

    var id = getId();

    $.ajax({
        url: '/apartments/' + id + '/all',
        method: 'GET',
        success: function (data) {
            $('#aptList').empty();
            var apartments = data.apartments;
            for (var i = 0; i < apartments.length; i++) {
                var row = $('<tr/>', {});
                row.append($('<td/>', {
                    text: apartments[i].name
                }));
                row.append($('<td/>', {
                    text: apartments[i].beds
                }));
                row.append($('<td/>', {
                    text: apartments[i].baths
                }));
                row.append($('<td/>', {
                    text: apartments[i].rent
                }));

                row.append("<td><button type='button' data-toggle='modal' data-target='#editAptModal'" +
                            `onclick = 'loadAptEditor(${i})' > edit</button >` +
                            `<button type='button' onclick='deleteApartment('${i}')'>delete</button></td >`)

                $(row).appendTo('#aptList');
            }
        }
    });
}

function loadAptViewer(index) {
    $(`#viewAptTagGroup`).empty();

    var id = getId();

    $.ajax({
        url: '/apartments/' + id + '/details',
        data: { 'index': index },
        method: 'GET',
        success: function (data) {
            $('#indexView').val(index);
            $('#complexView').attr('placeholder', data.apartment.complex);
            $('#complexView').val(data.apartment.complex);
            $('#nameView').attr('placeholder', data.apartment.name);
            $('#nameView').val(data.apartment.name);
            $('#rentView').attr('placeholder', data.apartment.rent);
            $('#rentView').val(data.apartment.rent);
            $('#depositView').attr('placeholder', data.apartment.deposit);
            $('#depositView').val(data.apartment.deposit);
            $('#bedsView').attr('placeholder', data.apartment.beds);
            $('#bedsView').val(data.apartment.beds);
            $('#bathsView').attr('placeholder', data.apartment.baths);
            $('#bathsView').val(data.apartment.baths);
            $('#sqftView').attr('placeholder', data.apartment.sqft);
            $('#sqftView').val(data.apartment.sqft);

            selected = data.apartment.tags;

            $.each(selected, function (key, value) {
                console.log(value);
                var tagButton = $('<span/>', {
                    id: value.replace(" ", "-"),
                    class: "btn btn-primary active",
                    text: value,
                    
                });

                tagButton.append($('<input/>', {
                    type: 'checkbox',
                    name: 'tags',
                    value: value,
                    checked: true,
                    disabled: true
                }));

                targetID = '#viewAptTagGroup'
                $(tagButton).appendTo(targetID);

            })
        }
    });
}