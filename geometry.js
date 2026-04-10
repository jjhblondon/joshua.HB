const canvas = document.getElementById('math-canvas');

if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const numParticles = 65; 

    for(let i=0; i<numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const baseColor = "30, 255, 100";

    function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;

            ctx.fillStyle = `rgba(${baseColor}, 0.5)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI*2);
            ctx.fill();
        });

        ctx.setLineDash([2, 5]); 
        ctx.lineWidth = 1.5; 

        for(let i=0; i<particles.length; i++) {
            for(let j=i+1; j<particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if(dist < 140) {
                    ctx.strokeStyle = `rgba(${baseColor}, ${0.35 - dist/400})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            const mdx = particles[i].x - mouseX;
            const mdy = particles[i].y - mouseY;
            const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
            if(mdist < 180) {
                ctx.strokeStyle = `rgba(${baseColor}, ${0.7 - mdist/250})`;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.stroke();
            }
        }

        requestAnimationFrame(draw);
    }
    draw();
}

// Global Lightbox Engine (Bulletproof Event Delegation)
(function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    document.body.appendChild(lightbox);

    const lightboxImg = document.createElement('img');
    const lightboxCaption = document.createElement('div');
    lightboxCaption.id = 'lightbox-caption';
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(lightboxCaption);

    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Use event delegation so it works instantly regardless of load order or cached DOM
    document.body.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.masonry-item') && e.target.parentElement.tagName !== 'A') {
            lightbox.classList.add('active');
            lightboxImg.src = e.target.src;
            lightboxCaption.innerText = e.target.alt || 'Project Render';
        }
    });

    // Apply native zoom cursor without needing JS execution loops
    const style = document.createElement('style');
    style.innerHTML = '.masonry-item img { cursor: zoom-in; } .masonry-item a img { cursor: pointer; }';
    document.head.appendChild(style);
})();
