from html.parser import HTMLParser
import urllib.request
import os

# create data folder with content and html folders in it
DATA_PATH = os.path.join(os.getcwd(), "..", "data")
CONTENT_FOLDER = os.path.join(DATA_PATH, "content")
if not os.path.exists(CONTENT_FOLDER):
    os.makedirs(CONTENT_FOLDER)
HTML_FOLDER = os.path.join(DATA_PATH, "html")
if not os.path.exists(HTML_FOLDER):
    os.makedirs(HTML_FOLDER)

counter = 0
#dir_path = os.path.dirname(os.path.realpath(__file__))

print(DATA_PATH)
# create a subclass and override the handler methods
class HParser(HTMLParser):
    currentTag = ""
    unimportant_tags = ["script"]
    nestedurls = set()
    content = ''

    def handle_starttag(self, tag, attrs):
        self.currentTag = tag
        #print("Encountered a start tag:", tag)
        for attr in attrs:
            if attr[0] == 'href' :
                if attr[1].startswith("http") :
                    self.nestedurls.add(attr[1])

    def handle_endtag(self, tag):
        pass
        #print("End tag :", tag)

    def handle_data(self, data):
        #print("\tDATA :", data)
        print(self.currentTag + "---" + data)

        if self.need_tag(self.currentTag) and self.need_data(data):
            #print(self.currentTag + "---"  + data)
            self.content+=data + "\n"

    def need_data(self, data):
        need_data = False
        if data != None and type(data) and data and data.strip():
            need_data = True
        return need_data

    def need_tag(self, tag):
        need_tag = False
        if (tag != None and type(tag) and tag.strip()):
            if tag not in self.unimportant_tags:
                need_tag = True
        return need_tag

    def get_nested_urls(self):
        return self.nestedurls
    def get_data(self):
        return self.content

def parse_page_recursively(page):
    global counter
    parser = HParser()
    response = urllib.request.urlopen(page)
    htmlContent = response.read()
    htmlString = htmlContent.decode("utf-8")
    parser.feed(htmlString)

    #print(parser.get_nested_urls())
    #print(parser.get_data())
    with open(os.path.join(CONTENT_FOLDER, 'content_' + str(counter)), "w+") as currentFile:
        currentFile.write(parser.get_data())
    with open(os.path.join(HTML_FOLDER, 'html_' + str(counter)), "w+") as currentFile:
        currentFile.write(htmlString)
    counter = counter + 1
    for child_page in parser.get_nested_urls():
        parse_page_recursively(child_page)

parse_page_recursively('http://en.wikipedia.org/wiki/List_of_Wikipedias')