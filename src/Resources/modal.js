(function($) {
    $.fn.ajaxmodal = function(action, options={}) {
        const debug = false;

        function debugLog(...message) {
            if (!debug) {
                return;
            }

            console.log('DEBUG', ...message)
        }

        function renderMenu(settings) {
            menu = '';

            if (settings.menu.length > 0) {
                menu = `<div class="modal-menu"><nav class="navbar navbar-expand bg-body-tertiary p-0 m-0 ps-2 pe-2"><div class="collapse navbar-collapse" id="navbarScroll"><ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">`

                for (i = 0; i < settings.menu.length; ++i) {
                    menu += `<li class="nav-item"><a class="nav-link active p-1 pe-2 ${settings.menu[i]['class']}" aria-current="page" href="${settings.menu[i]['url']}">${settings.menu[i]['name']}</a></li>`
                }

                menu += `</ul></div></nav></div>`;
            }

            return menu
        }

        this.each(function() {
            debugLog('modal', {'action': action, 'options': options})

            if (action === 'create' || !action) {
                const settings = $.extend(
                    {
                        title: $(this).attr('data-title') ?? 'Modal',
                        body: '',
                        id: `modal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                        url: $(this).attr('href'),
                        size: null,
                        fullscreen: false,
                        menu: [],
                        class: {
                            body: '',
                            modal: '',
                            content: ''
                        }
                    },
                    options
                );

                debugLog('modal', {'action': action, 'options': options, 'settings': settings})

                $.ajax({
                    url: settings.url,
                    success: function (response, textStatus, request) {
                        if (request.getResponseHeader('X-Modal-Config') !== null) {
                            for (const [key, value] of Object.entries(JSON.parse(atob(request.getResponseHeader('X-Modal-Config'))))) {
                                if (value !== null) {
                                    settings[key] = value
                                }
                            }
                        }

                        debugLog('modal success', {
                            'response': [response],
                            'textStatus': textStatus,
                            'request': request,
                            'X-Modal-Config': request.getResponseHeader('X-Modal-Config'),
                            'settings': settings
                        })

                        if (typeof response === 'object') {
                            switch (response.type) {
                                case 'redirect':
                                    debugLog('modal redirect', {'response': response})

                                    window.location.href = response.url;
                                    return;
                            }
                        }

                        let fullscreen = '',
                            menu = renderMenu(settings);

                        if (settings.fullscreen) {
                            fullscreen = 'modal-fullscreen';
                        }

                        $('body').append(`
                            <div class="modal fade modal-${settings.size} ${settings.class.modal}" id="${settings.id}" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
                                <div class="modal-dialog ${fullscreen} modal-fullscreen-sm-down">
                                    <div class="modal-content ${settings.class.content}">
                                        <div class="modal-header">
                                            <h5 class="modal-title">${settings.title}</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        ${menu}
                                        <div class="modal-body ${settings.class.body}" data-url="${settings.url}">
                                            ${response}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `);

                        new bootstrap.Modal(document.getElementById(settings.id)).show();

                        document.getElementById(settings.id).addEventListener('hide.bs.modal', function () {
                            $(this).ajaxmodal('destroy');
                        });
                    }
                })
            } else if (action === 'refresh') {
                debugLog('modal refresh', {'action': action, 'options': options})

                const $modalBody = $(this).find('.modal-body'),
                    url = $modalBody.attr('data-url');

                $modalBody.load(url);
            } else if (action === 'destroy') {
                $modal = $(this).closest('.modal');
                $modal.find('.modal-header').find('[data-bs-dismiss="modal"]').trigger('click');

                debugLog('modal destroy', {'action': action, 'options': options, 'modal': $modal})

                $modal.remove();
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
