(function($) {
    // Plugin definition
    $.fn.ajaxmodal = function(action, options={}) {
        return this.each(function() {
            const $element = $(this);

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
                    console.log(response)
                    if (typeof response.data === 'object') {
                        switch (response.type) {
                            case 'redirect':
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
                                    <div class="modal-body">
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
                const id = $(this).attr('id');
                $('#' + id).remove();
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