function generateTagButtons(context) {
    //clear the button tags from the div to prevent duplication
    $(`#${context}AptTagGroup`).empty();

    console.log('preparing to generate tag buttons');
    $.ajax({
        url: window.location.pathname + '/tags',
        method: 'GET',
        success: function (data) {
            console.log('successful retrieval of tags');
            var tagList = data.tags;

            $.each(tagList, function (key, value) {
                
                var tagButton = $('<span/>', {
                    id: value.replace(" ","-"),
                    class: "btn btn-primary",
                    text: value
                });

                tagButton.append($('<input/>', {
                    type: 'checkbox',
                    name: 'tags',
                    value: value
                }));

                targetID = '#' + context + 'AptTagGroup'
                $(tagButton).appendTo(targetID);
            });
        }
    });
}

function loadNewTagCreator(context) {
    $('#newTagContext').val(context)
}

function createTag() {
    //remove whitespaces
    var newTag = $('#newTag').val();
    var context = $('#newTagContext').val();
    console.log('newtag context:' + context)
    
    //only create new tag if it isn't empty
    if (newTag.length > 0) {
        console.log('newTag: ' + newTag);
        var params = { 'newTag': newTag };

        $.ajax({
            url: window.location.pathname + '/tag',
            method: 'POST',
            data: params,
            success: function (data) {
                console.log('successfully added tag');

                generateTagButtons(context);
                $('#newTagModal').modal('toggle');

            },
            error: function (data) {
                console.log('failed to add tag');
            }

        });
    }
    
}

function removeTag() {
    //TODO: make call to route that handles deleting a custom tag
}


function getSelectedTags(context) {
    var selected = [];
    var id = '#' + context + 'AptTagGroup input:checked'

    $(id).each(function () {
        selected.push($(this).val());
    });

    return selected;
}