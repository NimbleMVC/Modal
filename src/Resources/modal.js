(function($) {
    $.fn.ajaxmodal = function(action, options={}) {
        return this.each(function() {
            const debug = true,
                $element = $(this);

            function addToDebugbar(message, label = '') {
                console.log(label, message);
                debugbar = $('.phpdebugbar-widgets-messages').eq(0).find('ul');
                debugbar.append('<li class="phpdebugbar-widgets-list-item"><span class="phpdebugbar-widgets-label">' + label + '</span><span class="phpdebugbar-widgets-value phpdebugbar-widgets-info">' + message + '</span></li>');
            }

            if (action === 'create' || !action) {
                const defaultOptions = {
                    title: $(this).attr('data-title') ?? 'Modal',
                    body: '',
                    id: `modal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    url: $(this).attr('href')
                };

                const settings = $.extend({}, defaultOptions, options);

                $.ajax({
                    url: settings.url
                }).done(function(response) {
                    if (debug) {
                        addToDebugbar('done ' + settings.url, 'modal')
                    }

                    if (typeof response.data === 'object') {
                        switch (response.type) {
                            case 'redirect':
                                if (debug) {
                                    addToDebugbar('redirect: ' + response.url, 'modal')
                                }

                                window.location.href = response.url;
                        }
                    }

                    const modal = $(`
                        <div class="modal modal-lg fade" id="${settings.id}" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">${settings.title}</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body" data-url="${settings.url}">
                                        <p>${response}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);

                    $('body').append(modal);
                    
                    new bootstrap.Modal(document.getElementById(settings.id), {
                        backdrop: false
                    }).show();

                    document.getElementById(settings.id).addEventListener('hide.bs.modal', function () {
                        $(this).ajaxmodal('destroy');
                    });
                });
            } else if (action === 'refresh') {
                //refresh
            } else if (action === 'destroy') {
                $('#' + $(this).attr('id')).remove();
            } else {
                console.warn(`Unknown action: ${action}`);
            }
        });
    };
})(jQuery);

$(document).on('click', '.modallink', function (e) {
    e.preventDefault();

    $(this).ajaxmodal('create');
});
