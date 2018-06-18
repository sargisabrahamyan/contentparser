# contentparser

Author: Sargis Abrahamyan

Project advisor: Adam Mathias Bittlingmayer

Major browsers like Firefox, Chrome for Android and Safari for iOS include a feature to distill web pages into more readable and mobile-friendly versions by finding the main content and removing the other sections.  They use hand-built rules and site-specific hacks to achieve reasonable results on content parsing for many top websites and publishing platforms.

**contentparser** is a learning approach to content parsing - given training data, it trains a model that has similar effectiveness.  The results show that this task is learnable using standard word embeddings trained on raw HTML as input.

## Our Approach

This task can be seen as a sequence-to-sequence task, but we formulate it as simple binary classifcation.

We assume that the existing rules-based implementations either keep or delete sections, but do not change sections that they keep.

<img src="img/article.png" width="300px"> <img src="img/highlighted.png" width="300px">

Thus each input row is not the page but a single section in isolation, and the task is to predict whether to keep it or delete it.

<img src="img/section.png" width="600px">

## Implementation

### 1. **Build an unlabelled dataset**
**htmlparser** is our simple Python crawler script to download millions of raw HTML pages given a starting URL.

### 2. **Label the dataset**
Our NodeJS **label.js** fil uses one of the existing rules-based content parsers, Mozilla [**readability**](https://github.com/mozilla/readability), to get the main content of each HTML page.

Then we diff the new page against the original to find which sections were deleted.  Then we add a label `keep` or `delete` to each section in the original.

As each web page has many sections, we end up with orders of magnitude more labelled rows.

### 3. Train a classification model
We run **fastText** supervised to train a simple classification model to predict the label for each section, which can be applied to keep or delete it.

## Results

We ran fastText with the following parameters:
```
fasttext supervised -minn 1 -maxn 3 ...
```

Number of examples: 1078868

Trained on 18.5M lines (~30K web pages)
  
Tested on 1M lines
  
Accuracy **94.1%**


## Future Work

Upload trained model

Update HTML parser module

Runner module to run fasttext and return the content

Slice results by dimensions like line length and TLD
