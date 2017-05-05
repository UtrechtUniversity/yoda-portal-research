$( document ).ready(function() {
    if ($('#file-browser').length) {
        startBrowsing(browseStartDir, browsePageItems);
    }

    $('.btn-group button.metadata-form').click(function(){
        showMetadataForm($(this).attr('data-path'));
    });

    $('.btn-group button.toggle-folder-status').click(function() {
        if ($(this).attr('data-status') == 'SUBMITTED') {
            alert('Functionality to be developed in coming sprints.');
        } else {
            toggleFolderStatus($(this).attr('data-status'), $(this).attr('data-path'));
        }
    });
});

function browse(dir)
{
    makeBreadcrumb(dir);

    changeBrowserUrl(dir);
    topInformation(dir);
    buildFileBrowser(dir);
}

function makeBreadcrumb(urlEncodedDir)
{
    var dir = decodeURIComponent((urlEncodedDir + '').replace(/\+/g, '%20'));

    var parts = [];
    if (typeof dir != 'undefined') {
        if (dir.length > 0) {
            var elements = dir.split('/');

            // Remove empty elements
            var parts = $.map(elements, function (v) {
                return v === "" ? null : v;
            });
        }
    }

    // Build html
    var totalParts = parts.length;

    if (totalParts > 0 && parts[0]!='undefined') {
        var html = '<li class="browse">Home</li>';
        var path = "";
        $.each( parts, function( k, part ) {
            path += "%2F" + encodeURIComponent(part);

            // Active item
            valueString = htmlEncode(part).replace(/ /g, "&nbsp;");
            if (k == (totalParts-1)) {
                html += '<li class="active">' + valueString + '</li>';
            } else {
                html += '<li class="browse" data-path="' + path + '">' + valueString + '</li>';
            }
        });
    } else {
        var html = '<li class="active">Home</li>';
    }

    $('ol.breadcrumb').html(html);
}

function htmlEncode(value){
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html();
}

function makeBreadcrumbPath(dir)
{
    var parts = [];
    if (typeof dir != 'undefined') {
        if (dir.length > 0) {
            var elements = dir.split('/');

            // Remove empty elements
            var parts = $.map(elements, function (v) {
                return v === "" ? null : v;
            });
        }
    }

    // Build html
    var totalParts = parts.length;
    if (totalParts > 0) {
        var path = "";
        var index = 0;
        $.each( parts, function( k, part ) {

            if(index) {
                path += "/" + part;
            }
            else {
                path = part;
            }
            index++;
        });
    }

    return path;
}


function buildFileBrowser(dir)
{
    var url = "browse/data";
    if (typeof dir != 'undefined') {
        url += "?dir=" +  dir;
    }

    var fileBrowser = $('#file-browser').DataTable();

    fileBrowser.ajax.url(url).load();

    return true;
}

function startBrowsing(path, items)
{
    $('#file-browser').DataTable( {
        "bFilter": false,
        "bInfo": false,
        "bLengthChange": false,
        "ajax": "browse/data",
        "processing": true,
        "serverSide": true,
        "iDeferLoading": 0,
        "pageLength": items,
        "drawCallback": function(settings) {
            $( ".browse" ).on( "click", function() {
                browse($(this).attr('data-path'));
            });
        }
    });

    if (path.length > 0) {
        browse(path);
    } else {
        browse();
    }


}

function changeBrowserUrl(path)
{

    var url = window.location.pathname;
    if (typeof path != 'undefined') {
        url += "?dir=" +  path;
    }

    history.replaceState({} , {}, url);
}

function topInformation(dir)
{
    $('.top-information').hide();
    if (typeof dir != 'undefined') {
        $.getJSON("browse/top_data?dir=" + dir, function(data){
            var icon = '<i class="fa fa-folder-o" aria-hidden="true"></i>';
            var metadata = data.userMetadata;
            var status = data.folderStatus;
            var userType = data.userType;
            var showStatusBtn = false;
            var actions = [];

            // User metadata
            if (metadata == 'true') {
                $('.btn-group button.metadata-form').attr('data-path', dir);
                $('.btn-group button.metadata-form').show();
            } else {
                $('.btn-group button.metadata-form').hide();
            }

            // folder status
            if (typeof status != 'undefined') { // Normal folder
                if (status == '') {
                    $('.btn-group button.toggle-folder-status').text('Lock');
                    $('.btn-group button.toggle-folder-status').attr('data-status', 'LOCKED');

                    actions['submit'] = 'Submit to vault';
                } else if (status == 'LOCKED') { // Locked folder
                    $('.btn-group button.toggle-folder-status').text('Unlock');
                    $('.btn-group button.toggle-folder-status').attr('data-status', 'UNLOCKED');

                    $('.btn-group button.folder-status').text('Locked');
                    actions['submit'] = 'Submit to vault';
                }
                var icon = '<i class="fa fa-folder-o" aria-hidden="true"></i>';
                $('.btn-group button.toggle-folder-status').attr('data-path', dir);

                // Handle actions
                handleActionsList(actions);
                $('.top-info-buttons').show();
            } else {
                $('.top-info-buttons').hide();
            }

            // Lock position check
            var lockFound = data.lockFound;
            var path = data.path;
            if (lockFound != "no") {
                if (lockFound == "here") {
                    showStatusBtn = true;
                } else {
		            // Lock is either on descendant or ancestor Folder
		            showStatusBtn = false;
		        }
            } else {
                // No lock found, show the btn.
                showStatusBtn = true;
            }

            if (userType != 'normal' && userType != "manager") {
                // Hide folder status button for read permission
                showStatusBtn = false;
            }

            // Handle status btn
            if (showStatusBtn) {
                $('.btn-group button.toggle-folder-status').show();
                $('.btn-group button.toggle-folder-status').prop("disabled", false);
            } else {
                $('.btn-group button.toggle-folder-status').prop("disabled", true);
            }

            // data.basename.replace(/ /g, "&nbsp;")
            folderName = htmlEncode(data.basename).replace(/ /g, "&nbsp;");

            $('.top-information h1').html('<span class="icon">' + icon + '</span> ' + folderName);
            $('.top-information').show();
        });
    }
}

function handleActionsList(actions)
{
    var html = '';
    var possibleActions = ['submit'];

    $.each(possibleActions, function( index, value ) {
        if (actions.hasOwnProperty(value)) {
            html += '<li><a href="#" class="action-' + value + '">' + actions[value] + '</a></li>';
        }
    });

    $('.action-list').html(html);
}

function toggleFolderStatus(newStatus, path)
{
    // Get current button text
    var btnText = $('.btn-group button.toggle-folder-status').html();

    // Set spinner & disable button
    $('.btn-group button.toggle-folder-status').html(btnText + '<i class="fa fa-spinner fa-spin fa-fw"></i>');
    $('.btn-group button.toggle-folder-status').prop("disabled", true);

    // Change folder status call
    $.getJSON("browse/change_folder_status?path=" + path + "&status=" + newStatus, function(data) {
        // Set actions
        var actions = [];
        actions['submit'] = 'Submit to vault';

        if (data.status == 'LOCKED') {
            $('.btn-group button.toggle-folder-status').text('Unlock');
            $('.btn-group button.toggle-folder-status').attr('data-status', 'UNLOCKED');

            $('.btn-group button.folder-status').text('Locked');

            var icon = '<i class="fa fa-folder-o" aria-hidden="true"></i>';
        } else {
            $('.btn-group button.toggle-folder-status').text('Lock');
            $('.btn-group button.toggle-folder-status').attr('data-status', 'LOCKED');
            var icon = '<i class="fa fa-folder-o" aria-hidden="true"></i>';

            $('.btn-group button.folder-status').text('Actions');
        }
        handleActionsList(actions);

        // Change icon
        $('.top-information h1 .icon').empty().html(icon);

        // Remove disable attribute
        $('.btn-group button.toggle-folder-status').removeAttr("disabled");
    });
}

function showMetadataForm(path)
{
    window.location.href = 'metadata/form?path=' + path;
}
