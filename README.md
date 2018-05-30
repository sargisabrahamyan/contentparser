# Contentparser

Author: Sargis Abrahamyan

Project advisor: Adam Mathias Bittlingmayer

# Title               
Content Parsing

Captures content from your website, the system parses it into small, discrete entry. This makes it easier to get the main propose of the page.

# What is it done
  The first part is just collecting data.
    Collecting the web pages using Python client. Then for each page it does the the following:
      Gets the raw text content on one hand and and compares with the content parsed by Firfox then labels the lines "need" "skip".
      
  The second part is the training using fasttext 

# Similar
Find the main content in a web page, like Chrome, Safari and Firefox for mobile.The program has input is a web page and output is the brief main conpage.

# Results
  Accuracy 94.1%
  Number of examples: 1078868
  Trained on 18.5M lines ( 30.000 web pages )
  Tested on 1M lines
  Parameter for fasttext: fasttext supervised -minn 1 -maxn 3
