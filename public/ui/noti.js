$( document ).on( "notiEvent", {
 }, function(event, title, text, mode, progressBar, positionClass, preventDuplicates, timeOut, extendedTimeOut, showDuration, hideDuration) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": progressBar,
        "positionClass": positionClass,
        "preventDuplicates": preventDuplicates,
        "onclick": null,
        "showDuration": showDuration,
        "hideDuration": hideDuration,
        "timeOut": timeOut,
        "extendedTimeOut": extendedTimeOut,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    toastr[mode](text, title)
 });