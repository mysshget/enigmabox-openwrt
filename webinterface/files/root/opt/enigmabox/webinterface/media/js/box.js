(function(){

    var trans = window.translation;

    $('.confirmation').click(function(){
        return confirm(trans['are_you_sure']);
    });

    var $unveil = $('.unveil');
    var unveil_text = $unveil.data('text');
    $unveil.html('<a href="#">' + trans['show'] + '</a>');
    $unveil.on('click', function(){
        $unveil.html(unveil_text);
        return false;
    });

    var $dynamic_output = $('.dynamic-output');

    if ($dynamic_output.length){

        var padding_from_top = $dynamic_output.data('padding_from_top') || 400;
        padding_from_top = parseInt(padding_from_top, 10);
        $dynamic_output.height(parseInt($(window).height(), 10) - padding_from_top);

        if($('#loader-hint').data('value') == 'run'){
            $dynamic_output = $('.dynamic-output');
            $('.loader').show();
            $('#button-dry-run, #button-run').attr('disabled', 'disabled');
            $('#lockscreen').fadeIn();

            var output_type = $('#output-type').data('value'); // config_changed | updater_running

            setInterval(function(){
                ret = $.post('/api/v1/get_option', {
                    'key': output_type
                }, function(data){
                    if(data['value'] == 'False'){
                        $('.loader').hide();
                        $('#button-dry-run, #button-run, #button-apply').hide();
                        $('#success').fadeIn();
                        $('#lockscreen').hide();
                    }
                });
            }, 2000);
        }

        var prev_data = '';
        setInterval(function(){
            $dynamic_output.load('/dynamic_output/', function(data){
                if(data != prev_data){
                    $dynamic_output.animate({ scrollTop: $('.dynamic-output')[0].scrollHeight}, 1000);
                    prev_data = data;
                }
            });
        }, 1500);
    }

    var anchor = false;
    var window_href = window.location.href;
    if(window_href.indexOf('#') > -1){
        anchor = window.location.href.split('#')[1];
    }

    if(! anchor) {
        try {
            anchor = $('.nav-tabs li:first a').attr('href').replace('#', '');
        } catch (e) {}
    }

    try {
        $('.nav-tabs a[href=#' + anchor + ']').tab('show');
        $('.nav-tabs a').click(function (e) {
            $(this).tab('show');
        })
    } catch (e) {}

    $('.tooltip-hover').tooltip();

    $('#countrysort').sortable({
        cancel: ".ui-state-disabled",
        placeholder: "ui-state-highlight",
        update: function(ev) {
            var countries = [];
            $('#countrysort button[name=country]').each(function(i, c){
                countries.push($(c).val());
            });
            $.post('/api/v1/set_countries', {
                'countries': countries.join(',')
            });
        }
    });

    $('#fw-download').on('click', function() {
        var self = this;

        setTimeout(function() {
            $(self).attr('disabled', 'disabled');
        }, 10);

        $('#fw-download-progress').show();

        var w = 0;
        setInterval(function() {
            w += 1;
            $('#fw-download-bar').css('width', w + '%');
        }, 300);
    });

    $('#fw-verify').on('click', function() {
        var self = this;

        setTimeout(function() {
            $(self).attr('disabled', 'disabled');
        }, 10);

        $('#fw-verify-progress').show();

        var w = 0;
        setInterval(function() {
            w += 2;
            $('#fw-verify-bar').css('width', w + '%');
        }, 300);
    });

    $('#fw-write').on('click', function() {
        var self = this;

        if(! confirm(trans['are_you_sure'])) {
            return false;
        }

        setTimeout(function() {
            $(self).attr('disabled', 'disabled');
        }, 10);

        var csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
        $.post('/upgrade/', {
            'csrfmiddlewaretoken': csrfmiddlewaretoken,
            'write': '1'
        });

        $('#fw-countdown').modal({
            'backdrop': 'static',
            'keyboard': false
        });

        var remaining_seconds = 60 * 15;
        var total_remaining = remaining_seconds;
        var w = 0;
        setInterval(function() {
            $('.counter').text(remaining_seconds);
            w = Math.floor(100 - (100 / total_remaining * remaining_seconds));
            $('#fw-write-bar').css('width', w + '%');
            remaining_seconds = remaining_seconds - 1;
        }, 1000);

        setTimeout(function() {
            window.location.href = '/';
        }, 1000 * remaining_seconds); //15min for 4GB

        return false;
    });

    $('#restore_from_usb').on('click', function() {
        var self = this;

        if(! confirm(trans['are_you_sure'])) {
            return false;
        }

        var csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
        $.post('/backup/system/restorewizard/', {
            'csrfmiddlewaretoken': csrfmiddlewaretoken,
            'restore_from_usb': '1'
        });

        $('#restore-progress').modal({
            'backdrop': 'static',
            'keyboard': false
        });

        setInterval(function() {
            try {
                $.get('/dynamic_status/?key=restore', function(data) {
                    if(data == 'done') {
                        window.location.href = '/backup/system/restorewizard/?step=usb';
                    }
                });
            } catch(e){}
        }, 2000);

        return false;
    });

    var applyval = 0;

    $('#button-apply').on('click', function() {
        var self = this;

        $('#apply-now').modal();

        return false;
    });

    $('#confirm-apply').on('click', function() {

        $('.apply-buttonbar').hide();
        $('.apply-progressbar').show();

        applyval = setInterval(function() {
            try {
                $.get('/dynamic_status/?key=applynow', function(data) {
                    if(data == 'done') {
                        clearInterval(applyval);
                        $('.apply-progressbar').hide();
                        $('.apply-donebar').show();
                    }
                });
            } catch(e){}
        }, 600);

        $.post('/apply_changes/', {
            'apply_changes': 'run'
        });

    });

    $('#apply-now').on('hide', function() {
        clearInterval(applyval);
    });

})();
