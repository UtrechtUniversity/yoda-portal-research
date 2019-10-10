    <form class="hide" id="action-form" method="post">
        <input type="hidden" name="path" value="<?php echo htmlentities($path); ?>">
        <input type="hidden" name="<?php echo htmlentities($this->security->get_csrf_token_name()); ?>" value="<?php echo htmlentities($this->security->get_csrf_hash()); ?>">
        <input type="submit" id="submit-clone"     formaction="/research/metadata/clone">
        <input type="submit" id="submit-delete"    formaction="/research/metadata/delete">
        <input type="submit" id="submit-transform" formaction="/research/metadata/transform">
    </form>
    <div id="form-errors" class="row hide">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading clearfix">
                    <h3 class="panel-title pull-left">
                        Metadata form - <?php echo str_replace(' ', '&nbsp;', htmlentities(trim($path))); ?>
                    </h3>
                    <div class="input-group-sm has-feedback pull-right">
                        <a class="btn btn-default" href="/research/browse?dir=<?php echo rawurlencode($path); ?>">Close</a>
                    </div>
                </div>
                <div class="panel-body">
                    <p>
                        It is not possible to load this form as the yoda-metadata.json file is not
                        in accordance with the form definition.
                    </p>
                    <p>
                        Please check the following in your JSON file:
                    </p>
                        <ul class="error-fields"></ul>
                    <p>
                        When using the 'Delete all metadata' button beware that you will lose all data!
                        <button type="button" onclick="deleteMetadata('<?php echo rawurlencode($path); ?>')" class="btn btn-danger delete-all-metadata-btn pull-right">Delete all metadata</button>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div id="transformation" class="row hide">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading clearfix">
                    <h3 class="panel-title pull-left">
                        Metadata form - <?php echo str_replace(' ', '&nbsp;', htmlentities(trim($path))); ?>
                    </h3>
                    <div class="input-group-sm has-feedback pull-right close hide">
                        <a class="btn btn-default" href="/research/browse?dir=<?php echo rawurlencode($path); ?>">Close</a>
                    </div>
                </div>
                <div class="panel-body">
                    <div id="transformation-text"></div>
                    <div id="transformation-buttons" class="hide">
                        <a class="transformation-reject btn btn-danger pull-right" href="/research/browse?dir=<?php echo rawurlencode($path); ?>">Postpone transformation</a>
                        <button class="transformation-accept btn btn-success pull-right">Accept transformation</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="metadata-form" class="row hide">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading clearfix">
                    <h3 class="panel-title pull-left">
                        Metadata form - <?php echo str_replace(' ', '&nbsp;', htmlentities(trim($path))); ?>
                    </h3>
                    <div class="input-group-sm has-feedback pull-right">
                        <a class="btn btn-default" href="/research/browse?dir=<?php echo rawurlencode($path); ?>">Close</a>
                    </div>
                </div>
                <div class="panel-body">
                    <div id="no-metadata" class="hide">
                        <p>There is no metadata present for this folder.</p>
                    </div>
                    <div id="form"
                         data-path="<?php echo rawurlencode($path); ?>"
                         data-csrf_token_name="<?php echo rawurlencode($tokenName); ?>"
                         data-csrf_token_hash="<?php echo rawurlencode($tokenHash); ?>">
                        <p>Loading metadata <i class="fa fa-spinner fa-spin fa-fw"></i></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

<script>
    // Show "loading" text if loading the form takes longer than expected.
    var formLoaded = false;
    window.setTimeout(function(){
        if (!formLoaded) {
            $('#metadata-form').fadeIn(200);
            $('#metadata-form').removeClass('hide');
        }
    }, 800);
</script>
<script src="/research/static/js/metadata/form.js" async></script>
<script id="form-data" type="text/plain"><?php
    // base64-encode to make sure no "< /script>" text can be embedded.
    echo base64_encode(json_encode($formData))
?></script>
