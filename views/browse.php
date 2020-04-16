<script>
    var browsePageItems = <?php echo $items; ?>;
    var browseStartDir  = <?php echo json_encode($dir); ?>;
    var view = 'browse';
</script>

<?php echo $searchHtml; ?>

<div class="modal" id="showUnpreservableFiles">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <h3>File formats compliance with policy</h3>
                <div class="form-group">
                    <label for="file-formats-list">Select preservable file format list:</label>
                    <select class="form-control" id="file-formats-list">
                        <option value="" disabled selected>Select a file format list</option>
                    </select>
                </div>
                <p class="help"></p><br />
                <p class="advice"></p>
                <p class="checking">Checking files <i class="fa fa-spinner fa-spin fa-fw"></i></p>
                <p class="preservable">
                    This folder does not contain files that are likely to become unusable in the future.
                </p>
                <div class="unpreservable">
                    <p>The following unpreservable file extensions were found in your dataset:</p>
                    <ul class="list-unpreservable-formats"></ul>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-default grey cancel" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>


<div class="modal" id="folder-add">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div class="alert alert-warning" id="alert-panel-folder-add">
                    <span>BLABLA</span>
                </div>

                <h3>Add new folder to <span id="collection"></span></h3>

                <input type="text" id='path-folder-add' value="" placeholder="Add folder name ">

                <button class='btn-confirm-folder-add btn btn-default' data-path="">Add new folder</button>

            </div>

            <div class="modal-footer">
                <button class="btn btn-default grey cancel" data-dismiss="modal">Close</button>
            </div>

        </div>
    </div>
</div>
<div class="modal" id="folder-delete">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div class="alert alert-warning" id="alert-panel-folder-delete">
                    <span>BLABLA</span>
                </div>

                <h3>Delete folder in <span id="collection"></span></h3>
                <br>
                Do you want to delete folder: "<span id="folder-delete-name"></span>" ?


                <button class='btn-confirm-folder-delete btn btn-default' data-collection="" data-name="">Delete folder</button>
            </div>

            <div class="modal-footer">
                <button class="btn btn-default grey cancel" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<div class="modal" id="folder-rename">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div class="alert alert-warning" id="alert-panel-folder-rename">
                    <span>BLABLA</span>
                </div>

                <h3>Rename folder in <span id="collection"></span></h3>

                <input type="hidden" id='org-folder-rename-name' value="">
                <input type="text" id='folder-rename-name' value="" placeholder="New folder name">

                <button class='btn-confirm-folder-rename btn btn-default' data-collection="">Rename folder</button>
            </div>

            <div class="modal-footer">
                <button class="btn btn-default grey cancel" data-dismiss="modal">Close</button>
            </div>

        </div>
    </div>
</div>

<div class="modal" id="file-rename">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div class="alert alert-warning" id="alert-panel-file-rename">
                    <span>BLABLA</span>
                </div>

                <h3>Rename file in <span id="collection"></span></h3>

                <input type="hidden" id='org-file-rename-name' value="">
                <input type="text" id='file-rename-name' value="" placeholder="New file name">

                <button class='btn-confirm-file-rename btn btn-default' data-collection="">Rename file</button>
            </div>

            <div class="modal-footer">
                <button class="btn btn-default grey cancel" data-dismiss="modal">Close</button>
            </div>

        </div>
    </div>
</div>
<div class="modal" id="file-delete">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div class="alert alert-warning" id="alert-panel-file-delete">
                    <span>BLABLA</span>
                </div>

                <h3>Delete file in <span id="collection"></span></h3>
                <br>
                Do you want to delete <span id="file-delete-name"></span> ?


                <button class='btn-confirm-file-delete btn btn-default' data-collection="" data-name="">Delete file</button>
            </div>

            <div class="modal-footer">
                <button class="btn btn-default grey cancel" data-dismiss="modal">Close</button>
            </div>

        </div>
    </div>
</div>






<div class="modal" id="uploads">
    <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-body">
                <h3>Uploads</h3>
                <div id="files"></div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-default grey cancel" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="viewMedia">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <div id="viewer"></div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-default grey cancel" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="row">
    <ol class="breadcrumb">
        <li class="active">Home</li>
    </ol>

    <div class="top-information">
         <div class="row">
            <div class="col-md-6">
                <h1></h1>
            </div>
            <div class="col-md-6">
                <div class="top-info-buttons">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default metadata-form" data-path="">Metadata</button>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-default folder-add" data-path=""><i class="fa fa-folder" aria-hidden="true"></i> Add folder</button>
                    </div>
                    <div class="btn-group" role="group">
                        <input type="file" id="upload" multiple style="display: none" />
                        <button type="button" class="btn btn-default upload" data-path=""><i class="fa fa-upload" aria-hidden="true"></i> Upload</button>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default folder-status" data-toggle="dropdown" disabled="disabled">Actions</button>
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" disabled="disabled">
                            <span class="caret"></span><span class="sr-only">Actions</span>
                        </button>
                        <ul class="dropdown-menu action-list" role="menu"></ul>
                    </div>
                </div>
            </div>
        </div>

        <ul class="list-group lock-items"></ul>
        <ul class="list-group system-metadata-items"></ul>
        <ul class="list-group actionlog-items"></ul>
    </div>

    <div class="col-md-12">
        <div class="row">
            <table id="file-browser" class="table yoda-table table-striped" ondrop="dropHandler(event);" ondragover="dragOverHandler(event);">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Modified date</th>
                        <th></th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>
