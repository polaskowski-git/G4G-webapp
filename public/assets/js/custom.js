const $ = jQuery;

const prototypeError = `
    <div class="ajax-error sc_infobox sc_infobox_style_error sc_infobox_iconed error-box">
        <p>__MESSAGE__</p>
    </div>
`;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formAjaxClean($field, slow = false) {
    $field.each(function() {
            $(this).removeClass("has-error");
        const $ajaxError = $(this).parent().find(".ajax-error");
        if ($ajaxError.length) {
            if (slow) {
                $ajaxError.slideUp("slow", () => {
                    $ajaxError.remove();
                });
            } else {
                $ajaxError.remove();
            }
        }
    })
}

function formAjaxAddError($field, error) {
    $field.before(prototypeError.split("__MESSAGE__").join(capitalizeFirstLetter(error.message))); 
    $field.addClass("has-error");
    if (!$field.data("ajax-add-error-init")) {
        $field.data("ajax-add-error-init", true);
        $field.on("keyup", function() {
            formAjaxClean($(this), true);
        })
    }
}

function loader(show = false) {
    const $loader = $("#page_preloader");
    if (show) {
        $loader.show();
        $loader.css("opacity", 1);
    } else {
        $loader.hide();
        $loader.css("opacity", 0);
    }
}

$(function() {
    $(".ajax-form").on("submit", function(e) {
        e.preventDefault();
        
        loader(true);
        
        const $form = $(this);
        $form.find("[name]").each(function() {
            formAjaxClean($(this));
        });
        const formData = new FormData($form[0]);
        var data = {};
        formData.forEach(function(value, key){
            data[key] = value;
        });
        $.ajax({
            type: $form.attr('method') || "POST",
            dataType: 'json',
            url: $form.attr('action'),
            data
        }).complete(function(rsp){
            const data = rsp.responseJSON;
            switch (rsp.status) {
                case 200:
                    if ($form.attr('data-redirect')) {
                        window.location.href = $form.attr('data-redirect');
                    }
                    $form.trigger( "ajaxSendSuccess" );
                    break;
                case 400:
                    if (data.errors && data.errors.length) {
                        for (const error of data.errors) {
                            formAjaxAddError($form.find(`[name="${error.field}"]`), error)
                        }
                    }
                    break;
                default:
                    break;
            }
            setTimeout(function() {
                loader(false);
            }, 500)
        });

    });
});