var video_chunklist = [
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cinit_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn1_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn2_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn3_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn4_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn5_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn6_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn7_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn8_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn9_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn10_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn11_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn12_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctvideo_cfm4s_ridp0a0r0_cn13_w210162289_mpd.m4s',
];

var audio_chunklist = [
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cinit_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn1_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn2_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn3_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn4_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn5_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn6_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn7_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn8_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn9_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn10_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn11_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn12_w210162289_mpd.m4s',
    'http://192.168.0.8:1935/vod/_definst_/mp4:video_1080p.mp4/chunk_ctaudio_cfm4s_ridp0a1r0_cn13_w210162289_mpd.m4s',
];

var video_codec = 'avc1.640028';
var mime_type = 'video/mp4';

var video = document.querySelector('#player');
var media_source = new MediaSource();
var video_source_buffer;
var audio_source_buffer
video.src = window.URL.createObjectURL(media_source);

var current_video_chunk = 0;
var current_audio_chunk = 0;


function downloadVideoChunk() {
    var xhr = new XMLHttpRequest();
    console.log(current_video_chunk);
    console.log(video_chunklist[current_video_chunk]);
    xhr.open('GET', video_chunklist[current_video_chunk], true);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            appendVideoChunk(new Uint8Array(xhr.response));
        }
    };
    xhr.send();
}

function downloadAudioChunk() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', audio_chunklist[current_audio_chunk], true);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            appendAudioChunk(new Uint8Array(xhr.response));
        }
    };
    xhr.send();
}

function appendVideoChunk(chunk) {
    video_source_buffer.appendBuffer(chunk);
    if(video.paused) {
        video.play();
    }
    return;
    var file = new Blob([chunk], {type: 'video/mp4'});
    var reader = new FileReader();

    reader.onload = function(e) {
        video_source_buffer.appendBuffer(new Uint8Array(e.target.result));
    };
    reader.readAsArrayBuffer(file);
}

function appendAudioChunk(chunk) {
    var file = new Blob([chunk], {type: 'audio/mp4'});
    var reader = new FileReader();

    reader.onload = function(e) {
        audio_source_buffer.appendBuffer(new Uint8Array(e.target.result));
        current_audio_chunk++;
        //downloadAudioChunk(current_audio_chunk);
    };
    reader.readAsArrayBuffer(file);
}

function start() {
    video_source_buffer = media_source.addSourceBuffer('video/mp4; codecs="avc1.640028"');
    //audio_source_buffer = media_source.addSourceBuffer('audio/mp4; codecs="mp4a.40.2"');
    video_source_buffer.addEventListener('updateend', function() {
        console.log("updateend");
        current_video_chunk++;
        if(current_video_chunk < video_chunklist.length) {
            downloadVideoChunk(current_video_chunk);
        }
    }, false);

    var video = document.querySelector('video');
    new LicenseManager(video, 'http://192.168.0.8/license', 'http://192.168.0.8:9090/proxy');

    downloadVideoChunk();
    //downloadAudioChunk();
}

// media_source.addEventListener('sourceopen', start, false);
// media_source.addEventListener('webkitsourceopen', start, false);
new DashManifest('http://localhost:8888/mpegdash/radiohead.mp4/manifest.mpd', function(_self) {
    for(var i = 1; i < 10; i++) {
        console.log(_self.getChunk('video/mp4', i));
    }
});
