<div class="form-group">
    <label class="col-sm-2 control-label">
        <span data-toggle="tooltip" title="<?php echo $e->helpText; ?>"><?php echo $e->label; ?></span>
        <?php if ($e->mandatory) { ?>
            <i class="fa fa-lock safe" aria-hidden="true" data-toggle="tooltip" title="Required for the vault"></i>
        <?php } ?>
    </label>
    <div class="col-sm-6">

        <?php if ($e->multipleAllowed()) { ?>
            <div class="input-group">
                <input type="text"
                    <?php if($e->maxLength>0) { echo 'maxlength="' . $e->maxLength .'"'; } ?>
                       class="form-control" name="<?php echo $e->key; ?>[]" value="<?php echo $e->value; ?>">
                <span class="input-group-btn">
                    <button class="btn btn-default duplicate-field" type="button"><i class="fa fa-plus" aria-hidden="true"></i></button>
                </span>
            </div>
        <?php } else { ?>
            <input type="text"
                <?php if($e->maxLength>0) { echo 'maxlength="' . $e->maxLength .'"'; } ?>
                   class="form-control" name="<?php echo $e->key; ?>" value="<?php echo $e->value; ?>">
        <?php } ?>
    </div>
</div>