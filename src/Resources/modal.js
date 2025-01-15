(function($) {
    $.fn.ajaxmodal = function(action, options={}) {
        return this.each(function() {
            const debug = false;

            if (debug) {
                console.log('.ajaxmodal', action, options)
            }

            if (action === 'create' || !action) {
                const defaultOptions = {
                    title: $(this).attr('data-title') ?? 'Modal',
                    body: '',
                    id: `modal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    url: $(this).attr('href'),
                    size: null,
                    fullscreen: false
                };

                const settings = $.extend({}, defaultOptions, options);

                if (debug) {
                    console.log('modal create', action, options, settings)
                }

                $.ajax({
                    url: settings.url,
                    success: function (response, textStatus, request) {
                        if (debug) {
                            console.log('modal success', [response], textStatus, request, request.getResponseHeader('X-Modal-Config'), settings)
                        }

                        if (request.getResponseHeader('X-Modal-Config') !== null) {
                            let xmodalconfig = JSON.parse(atob(request.getResponseHeader('X-Modal-Config')));

                            if (debug) {
                                console.log('X-Modal-Config', xmodalconfig);
                            }

                            for (const [key, value] of Object.entries(xmodalconfig)) {
                                if (value !== null) {
                                    settings[key] = value
                                }
                            }
                        }

                        if (typeof response === 'object') {
                            switch (response.type) {
                                case 'redirect':
                                    if (debug) {
                                        console.log('modal redirect', response)
                                    }

                                    window.location.href = response.url;
                                    return;
                            }
                        }

                        let fullscreen = '';

                        if (settings.fullscreen) {
                            fullscreen = 'modal-fullscreen';
                        }

                        const modal = $(`
                        <div class="modal fade modal-${settings.size}" id="${settings.id}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
                            <div class="modal-dialog ${fullscreen} modal-fullscreen-sm-down">
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

                        new bootstrap.Modal(document.getElementById(settings.id)).show();

                        document.getElementById(settings.id).addEventListener('hide.bs.modal', function () {
                            $(this).ajaxmodal('destroy');
                        });
                    }
                })
            } else if (action === 'refresh') {
                if (debug) {
                    console.log('modal refresh', action, options)
                }
            } else if (action === 'destroy') {
                $modal = $(this).closest('.modal');
                $modal.find('.modal-header').find('[data-bs-dismiss="modal"]').trigger('click');

                if (debug) {
                    console.log('modal destroy', action, options, $modal)
                }

                $modal.remove();
            } else {
                console.log(`Unknown action: ${action}`);
            }
        });
    };
})(jQuery);

$(document).on('click', '.modallink', function (e) {
    e.preventDefault();

    $(this).ajaxmodal('create');
});
