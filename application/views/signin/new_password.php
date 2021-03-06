<div class="panel panel-default mb15">
    <div class="panel-heading text-center">
        <h2><?php echo plang('reset_password'); ?></h2>
    </div>
    <div class="panel-body p30 text-left">
        <?php echo form_open(
            "signin/do_reset_password",
            array("id" => "reset-password-form", "class" => "general-form", "role" => "form")
        ); ?>
        <div class="form-group">
            <input type="hidden" name="key" value="<?php echo isset($key) ? $key : ''; ?>"/>
            <label for="password" class=""><?php echo plang('password'); ?></label>
            <div class="">
                <?php
                echo form_password(array(
                    "id" => "password",
                    "name" => "password",
                    "class" => "form-control p10",
                    "data-rule-required" => true,
                    "data-msg-required" => plang("field_required", array("password")),
                    "data-rule-minlength" => 6,
                    "data-msg-minlength" => plang("field_min_length", array("password", "6")),
                    "autocomplete" => "off",
                    "style" => "z-index:auto;"
                ));
                ?>
            </div>
        </div>
        <div class="form-group">
            <label for="retype_password" class="">
                <?php echo plang('retype_password'); ?>
            </label>
            <div class="">
                <?php
                echo form_password(array(
                    "id" => "retype_password",
                    "name" => "retype_password",
                    "class" => "form-control p10",
                    "autocomplete" => "off",
                    "style" => "z-index:auto;",
                    "data-rule-equalTo" => "#password",
                    "data-msg-equalTo" => plang("enter_same_value")
                ));
                ?>
            </div>
        </div>
        <div class="form-group mb0">
            <button class="btn btn-lg btn-primary btn-block" type="submit">
                <?php echo plang('reset_password'); ?>
            </button>
        </div>
        <?php echo form_close(); ?>
    </div>
</div>

<script type="text/javascript">
    $(document).ready(function () {
        $("#reset-password-form").appForm({
            isModal: false,
            onSubmit: function () {
                appLoader.show();
            },
            onSuccess: function (result) {
                appLoader.hide();
                appAlert.success(result.message, {container: '.panel-body', animate: false});
                $("#reset-password-form").remove();
            },
            onError: function (result) {
                appLoader.hide();
                appAlert.error(result.message, {container: '.panel-body', animate: false});
                return false;
            }
        });
    });
</script>