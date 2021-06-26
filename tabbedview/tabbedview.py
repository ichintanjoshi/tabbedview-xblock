"""An XBlock to allow internal and external CSS in your course"""

import pkg_resources

import uuid

from xblock.core import XBlock
from xblock.fields import Integer, Scope, String, Boolean
from xblock.fragment import Fragment

from xblockutils.publish_event import PublishEventMixin

tabHTMLString = """
<style>
/* Style the tab */
.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

/* Style the buttons inside the tab */
.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-size: 17px;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ccc;
}

/* Style the tab content */
.tabcontent {
  display: none;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}
</style>

<p>Simple Tabbed View</p>

<div class="tab">
  <button class="tablinks" onclick="openCity(event, 'London')" id="defaultOpen">London</button>
  <button class="tablinks" onclick="openCity(event, 'Paris')">Paris</button>
  <button class="tablinks" onclick="openCity(event, 'Tokyo')">Tokyo</button>
</div>

<div id="London" class="tabcontent">
  <h3>London</h3>
  <p>London is the capital city of England.</p>
</div>

<div id="Paris" class="tabcontent">
  <h3>Paris</h3>
  <p>Paris is the capital of France.</p> 
</div>

<div id="Tokyo" class="tabcontent">
  <h3>Tokyo</h3>
  <p>Tokyo is the capital of Japan.</p>
</div>

<script>
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
</script>

"""
class TabbedViewHTMLXBlock(XBlock, PublishEventMixin):
    """
    Tabbed View HTML Block
    Can be used multiple times in 1 page, as each block will have it's own id
    """

    display_name = String(
        default="Tabbed View HTML XBlock",
        help="The display name of the XBlock"
    )
    name = String(
        default="Tabbed View HTML XBlock"
    )
    has_score=False
    icon_class="other"
    unique_id = String(
        default="unique-id",
        help="Unique ID of this xblock",
        scope=Scope.user_state
    )

    # DONOT delete
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )
    htmlcontent = String(
        default=tabHTMLString, scope=Scope.content,
        help="Source code of HTML courseware"
    )
    live_preview = Boolean(
        default=True,
        scope = Scope.content,
        help="Live Preview Flag"
    )
    non_editable_metadata_fields=["display_name", "has_score", "icon_class", "htmlcontent", "unique_id"]

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def student_view(self, context=None):
        """
        The primary view of the TabHTMLXblock, shown to students
        when viewing courses.
        """
        if(self.count == 0):
            self.unique_id = str(uuid.uuid4())
            self.count = 1
        html = self.resource_string("static/html/tabbedview.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/tabbedview_student.css"))
        frag.add_javascript(self.resource_string("static/js/src/tabbedview.js"))
        frag.initialize_js('TabbedViewHTMLXBlock', {"unique-id" : self.unique_id})
        return frag

    def studio_view(self, context=None):
        """
        The view that opens on clicking edit button in studio
        """
        html = self.resource_string("static/html/tabbedview_edit.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/codemirror.css"))
        frag.add_css(self.resource_string("static/css/foldgutter.css"))
        frag.add_css(self.resource_string("static/css/bootstrap-grid.css"))
        frag.add_css(self.resource_string("static/css/tabbedview.css"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/codemirror.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/closebrackets.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/closetag.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/foldcode.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/foldgutter.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/brace-fold.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/comment-fold.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/indent-fold.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/xml-fold.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/css.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/htmlmixed.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/javascript.js"))
        frag.add_javascript(self.resource_string("static/js/src/codemirror/xml.js"))
        frag.add_javascript(self.resource_string("static/js/src/tabbedview_edit.js"))
        frag.initialize_js('TabbedViewHTMLXBlock_EditorInit', {"live_preview" : self.live_preview})
        return frag

    # Default XBlock function
    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        assert data['hello'] == 'world'

        self.count += 1
        return {"count": self.count}

    @XBlock.json_handler
    def get_html_content(self, data, suffix=''):
        assert data['need_data'] == 'true'
        return {"htmlcontent": self.htmlcontent}
    
    @XBlock.json_handler
    def set_html_content(self, data, suffix=''):
        self.htmlcontent = data['set_data']
        self.display_name = data['set_display_name']
        self.live_preview = data['set_live_preview']
        return {"htmlcontent": self.htmlcontent}
    
    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("TabbedViewHTMLXBlock",
             """<tabbedview/>
             """),
            ("Multiple TabbedViewHTMLXBlock",
             """<vertical_demo>
                <tabbedview/>
                <tabbedview/>
                <tabbedview/>
                </vertical_demo>
             """),
        ]
