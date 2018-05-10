from html.parser import HTMLParser
import urllib.request

# create a subclass and override the handler methods
class HParser(HTMLParser):
    currentTag = ""
    unimportant_tags = ["script"]

    def handle_starttag(self, tag, attrs):
        self.currentTag = tag
        #print("Start tag:", tag)

    def handle_endtag(self, tag):
        pass
        #print("End tag :", tag)

    def handle_data(self, data):
        #print("\tDATA :", data)
        if self.need_tag(self.currentTag) and self.need_data(data):
            print(self.currentTag + "---"  + data)

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

parser = HParser()
response = urllib.request.urlopen('http://python.org/')
htmlContent = response.read()
htmlString = htmlContent.decode("utf-8")
parser.feed(htmlString)
