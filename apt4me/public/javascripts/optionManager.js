function updateOptions() {
    var targetRent = $('#targetRent').val();

    var priorityTags = getSelectedTags('priority');

    var params = {
        'targetRent': targetRent, 'priorityTags': priorityTags
    };

    var id = getId();

    $.ajax({
        url: '/options/' + id,
        method: 'PUT',
        data: params,
        success: function (data) {
            console.log('success')
        },
        error: function (data) {
            console.log('failed');
        }

    });
}