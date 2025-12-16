
// Configuración de URL de YouTube
const MY_VIDEO_URL = "https://www.youtube.com/watch?v=4xDzrJKXOOY"; 

var player;
var isPlayerReady = false;

// 1. Cargar API de YouTube
if (!window.YT) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 2. Extraer ID
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 3. Configurar Player
window.onYouTubeIframeAPIReady = function() {
    const videoId = getYouTubeId(MY_VIDEO_URL);
    
    player = new YT.Player('youtube-player', {
        height: '0', width: '0',
        videoId: videoId,
        playerVars: { 
            'autoplay': 0, 
            'controls': 0, 
            'loop': 1, 
            'playlist': videoId 
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    isPlayerReady = true;
    player.setVolume(30);
    
    // Recuperar memoria (si el usuario ya le dio play antes)
    if (localStorage.getItem('cyberMusicPlaying') === 'true') {
        const musicBtn = document.getElementById('music-toggle');
        if(musicBtn) {
            musicBtn.classList.add('playing');
            musicBtn.querySelector('.music-text').innerText = "RESUMING...";
            player.playVideo();
        }
    }
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        // Actualizar título
        let title = player.getVideoData().title || "AUDIO STREAM";
        title = title.toUpperCase().replace(/\(.*\)|\[.*\]/g, '').trim();
        const btn = document.getElementById('music-toggle');
        if(btn) btn.querySelector('.music-text').innerText = title;
    }
}

// 4. Configurar Botón y Enlaces (Modo Simple)
document.addEventListener('DOMContentLoaded', () => {
    
    // Botón de Música
    const musicBtn = document.getElementById('music-toggle');
    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            if (!isPlayerReady) return;
            
            if (musicBtn.classList.contains('playing')) {
                player.pauseVideo();
                musicBtn.classList.remove('playing');
                musicBtn.querySelector('.music-text').innerText = "AUDIO: OFF";
                localStorage.setItem('cyberMusicPlaying', 'false');
            } else {
                player.playVideo();
                musicBtn.classList.add('playing');
                localStorage.setItem('cyberMusicPlaying', 'true');
            }
        });
    }

    // Transición Visual de las Compuertas (Sin Fetch)
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            if (!targetUrl || targetUrl.startsWith('#') || targetUrl.includes('mailto:')) return;

            e.preventDefault(); // Esperar un momento
            
            const container = document.querySelector('.shutter-container');
            const text = document.querySelector('.loading-text');

            if (container) {
                if(text) text.innerText = "LOADING...";
                container.classList.add('shutter-closed');
                container.style.pointerEvents = "all";
            }

            // Ir a la página (Esto recargará la música, es inevitable sin servidor)
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600);
        });
    });
});