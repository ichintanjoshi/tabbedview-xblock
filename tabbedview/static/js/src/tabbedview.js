
function TabbedViewHTMLXBlock(runtime, element, data) {
    console.log(data["unique-id"]);
    var getContentHandlerUrl = runtime.handlerUrl(element, 'get_html_content');
    function updateIframeAfterSuccess(result) {
        var htmlcontent = result.htmlcontent;
        var preview = document.getElementById(data["unique-id"] + "-iframe");
        preview.addEventListener("load", function(e) {
            /*
             * Make sure that your <body> + <<html> margin fits within the given margin of 35px
             * It is recommended that you have your <body> and <html> margin is zero
             */
            preview.height = preview.contentWindow.document.body.scrollHeight + 60;
            addBlankTargetForAnchorTags(preview);
        },true);
        preview.contentWindow.document.open();
        preview.contentWindow.document.write(htmlcontent);
        preview.contentWindow.document.close();
    }
    function addBlankTargetForAnchorTags(adv_iframe) {
        var anchorTags = adv_iframe.contentDocument.getElementsByTagName("A");
        for(var i = 0; i < anchorTags.length; i++) {
            var aTag = anchorTags[i];
            aTag.target = '_blank';
        }
        setWidthForXBlockWrappers();
    }
    function setWidthForXBlockWrappers() {
        var wrappers = document.getElementsByClassName("xblock-wrapper");
        for(var i = 0; i < wrappers.length; i++) {
            var wrap = wrappers[i];
            wrap.style.width = "100%";
        }
    }
    $(function ($) {
        /* Here's where you'd do things on page load. */
        $.ajax({
            type: "POST",
            url: getContentHandlerUrl,
            data: JSON.stringify({"need_data": "true"}),
            success: updateIframeAfterSuccess,
            error: function(data) {
                var data = $.parseJSON(data);
                $.each(data.errors, function(index, value){
                    alert(value);
                });
            }
        });
    });
}
