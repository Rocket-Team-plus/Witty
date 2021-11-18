$("document").ready(function () {
    $("canvas").each(function () {
        var current_element = $(this);

        parent_width = current_element[0].parentElement.clientWidth;
        parent_height = current_element[0].parentElement.clientHeight;

        current_element.width(parent_width);
        current_element.height(parent_height);
    });


});







