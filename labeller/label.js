const Readable = require('./readable.js');
const fs = require('fs');

async function _label(url, datastream, urlstream) {

  console.log('Making Readable', url);
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const _ = await Readable.run(url);
  //console.log(_);

  console.log('Labelling text');
  const readableLines = _.readable.text.split('\n');
  for (let line of _.original.text.split('\n')) {

    if (line === '') {
      //console.log('');
    } else {
      var label;
      if (readableLines.includes(line)) {
        label = '__label__keep';
      } else {
        label = '__label__delete';
      }
      //console.log(label, line);
      datastream.write(label + " " + line +"\n");
     
    }

  }
   urlstream.write(url + "\n")
}

async function run(urlFilePath) {
  var fs = require('fs');
  //fs.appendFile(__dirname + "//data.txt", "ssssyrics", (err) => {});
  var dataStream = fs.createWriteStream("//media//saq//linuxdata//data.txt", {'flags': 'a'});
  var urlStream = fs.createWriteStream("//media//saq//linuxdata//url.txt", {'flags': 'a'});
  //var stream = fs.createWriteStream(__dirname + "//data.txt");
  //console.log(__dirname + "/data.txt");
  //var txtFile = new File(filepath);
  //txtFile.open("w");

  console.log('Reading URLS from', urlFilePath);
  var urls = require('fs').readFileSync(urlFilePath, 'utf-8')
      .split('\n')
      .filter(Boolean);
  var i = 0;
  for (let url of urls) {
    console.log(i++);
    await _label(url, dataStream, urlStream);
    // TODO: write to a file with the URL name
  }
}

run(process.argv[2]);
