const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const path = require('path');

const decode = require('./utils.js').decodeHtmlEntitiesFromDelta;

function getAssetsPath(){
    return path.join(__dirname + '/../public/').replace(new RegExp(/\\/g), '/');
}

const quillConfig = {
    urlSanitizer: (url) => {
        if (url[0] == '/')
            return url.substring(1);
        return 'http://' + url;
    }
};

const pdfConfig = {
	format: "Letter",
  	"base": "file:///" + getAssetsPath(),
  	"type": "pdf",
  	"quality": "80"
}

function convert(delta, filename){
    const convertedDelta = decode(delta, true);
    let converter = new QuillDeltaToHtmlConverter(convertedDelta.ops, quillConfig);
    return converter.convert();
}

module.exports = {
    convert,
    pdfConfig,
    getAssetsPath
}