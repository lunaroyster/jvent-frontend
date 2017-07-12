/* global $ Raven */

Raven.config('https://8b0db2cf1709453fa6f5b55adb2938f1@sentry.io/183590').install();

$(function() {
    $(".dropdown-button").dropdown({
        constrainWidth: true,
        gutter: 0,
        belowOrigin: true
    });
});