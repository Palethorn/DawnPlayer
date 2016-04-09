function DashManifest(url, onload) {
    this.source = url;
    this.loaded = onload;
    this.retrieve();
}

DashManifest.prototype.retrieve = function () {
    _self = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', this.source, true);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            _self.parse(xhr.responseXML);
        }
    };
    xhr.send();
};

DashManifest.prototype.parse = function (xml) {
    console.log(xml);
    _self = this;
    _self.adaptation_sets = [];
    var adaptation_sets = xml.getElementsByTagName('AdaptationSet');
    for(var i = 0; i < adaptation_sets.length; i++) {
        var tmp = adaptation_sets[i];

        var representation_elements = tmp.getElementsByTagName('Representation');

        var as = {
            id: tmp.getAttribute('id'),
            maxWidth: tmp.getAttribute('maxWidth'),
            maxHeight: tmp.getAttribute('maxHeight'),
            maxFrameRate: tmp.getAttribute('maxFrameRate'),
            SegmentTemplate: {},
            Representation: []
        }

        for(var i = 0; i < representation_elements.length; i++) {
            var r = {
                id: representation_elements[i].getAttribute('id'),
                mimeType: representation_elements[i].getAttribute('mimeType'),
                codecs: representation_elements[i].getAttribute('codecs'),
                width: representation_elements[i].getAttribute('width'),
                height: representation_elements[i].getAttribute('height'),
                frameRate: representation_elements[i].getAttribute('frameRate'),
                startWithSAP: representation_elements[i].getAttribute('startWithSAP'),
                bandwidth: representation_elements[i].getAttribute('bandwidth')
            }
            as.Representation.push(r);
        }

        tmp = tmp.getElementsByTagName('SegmentTemplate')[0];
        var st = {
            timescale: tmp.getAttribute('timescale'),
            media: tmp.getAttribute('media'),
            initialization: tmp.getAttribute('initialization'),
            startNumber: tmp.getAttribute('startNumber'),
            SegmentTimeline: {
                s: []
            }
        }
        as.SegmentTemplate = st;
        tmp = tmp.getElementsByTagName('SegmentTimeline')[0];
        tmp = tmp.getElementsByTagName('S');
        for(var j = 0; j < tmp.length; j++) {
            var s = {
                d: tmp[j].getAttribute('d'),
                r: tmp[j].getAttribute('r')
            }
            as.SegmentTemplate.SegmentTimeline.s.push(s);
        }
        _self.adaptation_sets.push(as);
    }
    console.log(_self.adaptation_sets);
    _self.loaded(_self);
}

DashManifest.prototype.getInitialization = function (mime) {
    _self = this;
    for(var i = 0; i < _self.adaptation_sets.length; i++) {
        for(var j = 0; j < _self.adaptation_sets[i].Representation.length; j++) {
            if(_self.adaptation_sets[i].Representation[j].mimeType == mime) {
                return _self.adaptation_sets[i].Representation[j].initialization;
            }
        }
    }
}

DashManifest.prototype.getChunk = function (mime, number) {
    _self = this;
    for(var i = 0; i < _self.adaptation_sets.length; i++) {
        for(var j = 0; j < _self.adaptation_sets[i].Representation.length; j++) {
            if(_self.adaptation_sets[i].Representation[j].mimeType == mime) {
                media = _self.adaptation_sets[i].SegmentTemplate.media.replace('$Number$', number);
                media = media.replace('$RepresentationID$', _self.adaptation_sets[i].Representation[j].id);
                return media;
            }
        }
    }
}
