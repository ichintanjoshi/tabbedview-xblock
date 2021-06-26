

function TabbedViewHTMLXBlock_EditorInit(runtime, element, data) {
    var editor;
    var toggle;
    var display_name;
    var editorContent = String.raw`<!DOCTYPE html>
<html>
    <head>
        <style>
        p {
            background-color: blue;
            color: white;
        }
        </style>
    </head>
    <body>
        <p>This is tabbedview</p>
    </body>
</html>`;
    function updateEditorAfterAJAX(result) {
        editorContent = result.htmlcontent;
        editor.setValue(editorContent, -1);
        var preview = document.getElementById("TabPreview");
        preview.contentWindow.document.open();
        preview.contentWindow.document.write(editorContent);
        preview.contentWindow.document.close();
    }
    $(element).find('.save-button').bind('click', function () {
        /* Disable live preview by default */
        /*
        toggle = document.getElementById("live_preview_toggle");
        toggle.checked = false;
        var live_preview = document.getElementById("tabbedview_preview");
        live_preview.classList.remove('col-6');
        live_preview.style.display = "none";
        var editor_wrapper = document.getElementById("tabbedview_editor");
        editor_wrapper.classList.remove('col-6');
        editor_wrapper.classList.add('col-12');
        */
        var setContentHandlerUrl = runtime.handlerUrl(element, 'set_html_content');
        editorContent = editor.getValue();
        var display_name_value = document.getElementById("display_name_option").value;
        if(display_name_value==null || display_name_value=="" || ! (display_name_value.replace(/^\s+/g, '').length) ) {
            display_name_value = "Tabbed View HTML";
        }
        var live_preview_value;
        var live_preview_option = document.getElementById("live_preview_option");
        if(live_preview_option.value === "enable") {
            live_preview_value = true;
        }
        else {
            live_preview_value = false;
        }
        runtime.notify('save', {state: 'start'});
        var data = {
            "set_data" : editorContent,
            "set_display_name" : display_name_value,
            "set_live_preview" : live_preview_value
        };
        $.post(setContentHandlerUrl, JSON.stringify(data)).done(function(response) {
            runtime.notify('save', {state: 'end'});
        });
    });
    $(element).find('.cancel-button').bind('click', function() {
        /* Disable live preview by default */
        /*
        toggle = document.getElementById("live_preview_toggle");
        toggle.checked = false;
        var live_preview = document.getElementById("tabbedview_preview");
        live_preview.classList.remove('col-6');
        live_preview.style.display = "none";
        var editor_wrapper = document.getElementById("tabbedview_editor");
        editor_wrapper.classList.remove('col-6');
        editor_wrapper.classList.add('col-12');
        */
        runtime.notify('cancel', {});
    });
    /*
    $(element).find('#live_preview_toggle').bind('click', function() {
        toggle = document.getElementById("live_preview_toggle");
        var editor_wrapper = document.getElementById("tabbedview_editor");
        var live_preview = document.getElementById("tabbedview_preview");
        if(toggle.checked) {
            live_preview.classList.add('col-6');
            editor_wrapper.classList.remove('col-12');
            editor_wrapper.classList.add('col-6');
            live_preview.style.display = "block";
        }
        else {
            live_preview.classList.remove('col-6');
            live_preview.style.display = "none";
            editor_wrapper.classList.remove('col-6');
            editor_wrapper.classList.add('col-12');
        }
    });
    */
    $(function ($) {
        /* On Page Load */
        var getContentHandlerUrl = runtime.handlerUrl(element, 'get_html_content');
        $.ajax({
            type: "POST",
            url: getContentHandlerUrl,
            data: JSON.stringify({"need_data": "true"}),
            success: updateEditorAfterAJAX
        });
        /* Initialize CodeMirror */
        editor = CodeMirror.fromTextArea(document.getElementById("TabViewEditor"), {
            lineNumbers: true,
            lineWrapping: true,
            mode: 'htmlmixed',
            tabSize: 4,
            indentUnit: 4,
            indentOnInit: true,
            autoCloseBrackets: true,
            autoCloseTags: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        });
        editor.on("change", function(cm, change) {
            var tmp = cm.getValue();
            var preview = document.getElementById("TabPreview");
            preview.contentWindow.document.open();
            preview.contentWindow.document.write(tmp);
            preview.contentWindow.document.close();
        });
        /* Disable live preview by default */
        /*
        toggle = document.getElementById("live_preview_toggle");
        toggle.checked = false;
        var live_preview = document.getElementById("tabbedview_preview");
        live_preview.classList.remove('col-6');
        live_preview.style.display = "none";
        var editor_wrapper = document.getElementById("tabbedview_editor");
        editor_wrapper.classList.remove('col-6');
        editor_wrapper.classList.add('col-12');
        */
       console.log(document.getElementById("display_name_option").value);
       var live_preview = document.getElementById("live_preview_option");
        /* Add the editor tabs */
        /*
         * Reference :
         * https://github.com/appsembler/xblock-video/blob/27a4a2e3441cb0bb21c2693e4a33cc3efe39055e/video_xblock/static/js/studio-edit/studio-edit.js#L67
         * If this is not working, you might want to check values of
         * variables over log
         */
        function toggleEditorTab(event, tabName) {
            var $tabDisable;
            var $tabEnable;
            var $otherTabName;
            var live_preview_option = document.getElementById("live_preview_option");
            if (tabName === 'Editor') {
                $tabEnable = $('#tabbedview_edit_wrapper');
                $tabDisable = $('#tabbedview_settings_wrapper');
                $otherTabName = 'Settings';
                if(live_preview_option.options[live_preview_option.selectedIndex].value == "disable") {
                    var live_preview = document.getElementById("tabbedview_preview");
                    live_preview.classList.remove('col-6');
                    live_preview.style.display = "none";
                    var editor_wrapper = document.getElementById("tabbedview_editor");
                    editor_wrapper.classList.remove('col-6');
                    editor_wrapper.classList.add('col-12');
                    document.getElementById("tabbedview_toolbar").style.display="flex";
                    document.getElementById("message").style.display="flex";
                    editor_wrapper.style.height="93%";
                }
                else {
                    var live_preview = document.getElementById("tabbedview_preview");
                    var editor_wrapper = document.getElementById("tabbedview_editor");
                    live_preview.classList.add('col-6');
                    editor_wrapper.classList.remove('col-12');
                    editor_wrapper.classList.add('col-6');
                    live_preview.style.display = "block";
                    document.getElementById("tabbedview_toolbar").style.display="none";
                    document.getElementById("message").style.display="none";
                    editor_wrapper.style.height="100%";
                }

            } else if (tabName === 'Settings') {
                $tabEnable = $('#tabbedview_settings_wrapper');
                $tabDisable = $('#tabbedview_edit_wrapper');
                $otherTabName = 'Editor';
            }
            $(event.currentTarget).addClass('current');
            $('.edit-menu-tab[data-tab-name=' + $otherTabName + ']').removeClass('current');
            $tabDisable.addClass('is-hidden');
            $tabEnable.removeClass('is-hidden');
        }

        var $modalHeaderTabs = $('.editor-modes.action-list.action-modes');
        var isNotDummy = $('#sb-field-edit-href').val() !== '';
        var currentTabName;
        if(isNotDummy) {
            $modalHeaderTabs
                .append(
                    '<li class="inner-tab-wrap">' +
                    '   <button class="edit-menu-tab" data-tab-name="Settings">Settings</button>' +
                    '</li>',
                    '<li class="inner-tab-wrap">' +
                    '   <button class="edit-menu-tab current" data-tab-name="Editor">Editor</button>' +
                    '</li>'
                );
            // Bind listeners to the toggle buttons
            $('.edit-menu-tab').click(function(event) {
                currentTabName = $(event.currentTarget).attr('data-tab-name');
                toggleEditorTab(event, currentTabName);
            });
        }
        if(data['live_preview'] == true || data['live_preview'] === 'true') {
            live_preview.value = "enable";
            var live_preview_wrapper = document.getElementById("tabbedview_preview");
            var editor_wrapper = document.getElementById("tabbedview_editor");
            live_preview_wrapper.classList.add('col-6');
            editor_wrapper.classList.remove('col-12');
            editor_wrapper.classList.add('col-6');
            live_preview_wrapper.style.display = "block";
            document.getElementById("tabbedview_toolbar").style.display="none";
            document.getElementById("message").style.display="none";
            editor_wrapper.style.height="100%";
        }
        else {
            live_preview.value = "disable";
            var live_preview_wrapper = document.getElementById("tabbedview_preview");
            live_preview_wrapper.classList.remove('col-6');
            live_preview_wrapper.style.display = "none";
            var editor_wrapper = document.getElementById("tabbedview_editor");
            editor_wrapper.classList.remove('col-6');
            editor_wrapper.classList.add('col-12');
            document.getElementById("tabbedview_toolbar").style.display="flex";
            document.getElementById("message").style.display="flex";
            editor_wrapper.style.height="93%";
        }
    });
}
