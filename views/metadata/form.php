<div id="form-errors" class="row hide">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header clearfix">
                <h5 class="card-title pull-left">
                    Metadata form - <?php echo str_replace(' ', '&nbsp;', htmlentities(trim($path))); ?>
                </h5>
                <div class="input-group-sm has-feedback pull-right">
                    <a class="btn btn-secondary" href="/research/browse?dir=<?php echo rawurlencode($path); ?>">Close</a>
                </div>
            </div>
            <div class="card-body">
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
                    <button type="button" class="btn btn-danger delete-all-metadata-btn pull-right">Delete all metadata</button>
                </p>
            </div>
        </div>
    </div>
</div>

<div id="transformation" class="row hide">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header clearfix">
                <h5 class="card-title pull-left">
                    Metadata form - <?php echo str_replace(' ', '&nbsp;', htmlentities(trim($path))); ?>
                </h5>
                <div class="input-group-sm has-feedback pull-right close-button hide">
                    <a class="btn btn-secondary" href="/research/browse?dir=<?php echo rawurlencode($path); ?>">Close</a>
                </div>
            </div>
            <div class="card-body">
                <div id="transformation-text"></div>
                <div id="transformation-buttons" class="hide">
                    <a class="transformation-reject btn btn-danger pull-right" href="/research/browse?dir=<?php echo rawurlencode($path); ?>">Postpone transformation</a>
                    <button class="transformation-accept btn btn-success pull-right">Accept transformation</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="metadata-form" class="row hide">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title pull-left">
                    Metadata form - <?php echo str_replace(' ', '&nbsp;', htmlentities(trim($path))); ?>
                </h5>
                <div class="input-group-sm has-feedback pull-right close-button">
                    <a class="btn btn-light btn-sm" href="/research/browse?dir=<?php echo rawurlencode($path); ?>">Close</a>
                </div>
            </div>
            <div class="card-body">
                <div id="no-metadata" class="hide">
                    <p>There is no metadata present for this folder.</p>
                </div>
                <div id="form"
                     data-path="<?php echo htmlentities($path); ?>"
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
    setTimeout(function(){
        if (!formLoaded) {
            $('#metadata-form').fadeIn(200);
            $('#metadata-form').removeClass('hide');
        }
    }, 800);
</script>
<script src="/research/static/js/metadata/form.js" async></script>
<script id="form-properties" type="text/plain"><?php
    // base64-encode to make sure no script tag can be embedded.
    echo base64_encode(json_encode($formProperties))
?></script>
