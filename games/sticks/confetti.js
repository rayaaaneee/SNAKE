class confetti{

	static maxParticleCount = 150;
	static particleSpeed = 2;

	static colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"]
	static streamingConfetti = false;
	static animationTimer = null;
	static particles = [];
	static waveAngle = 0;

	static canvas = document.querySelector("#confetti-canvas");

	static context = confetti.canvas.getContext("2d");

	constructor(){
		confetti.canvas.setAttribute("width", window.innerWidth);
		confetti.canvas.setAttribute("height", window.innerHeight);
	}

	static startConfetti() {
		confetti.startConfettiInner();
	}

	static stopConfetti() {
		confetti.stopConfettiInner();
	}

	static toggleConfetti() {
		confetti.toggleConfettiInner();
	}

	static removeConfetti() {
		confetti.removeConfettiInner();
	}
	
	static resetParticle(particle, width, height) {
		particle.color = confetti.colors[(Math.random() * confetti.colors.length) | 0];
		particle.x = Math.random() * width;
		particle.y = Math.random() * height - height;
		particle.diameter = Math.random() * 10 + 5;
		particle.tilt = Math.random() * 10 - 10;
		particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
		particle.tiltAngle = 0;
		return particle;
	}

	static startConfettiInner() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		window.requestAnimFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, 16.6666667);
				};
		})();

		if (confetti.canvas === null) {
			confetti.canvas.style.display ="block";
			confetti.canvas.style.pointerEvents = "none";
		}

		while (confetti.particles.length < confetti.maxParticleCount)
			confetti.particles.push(confetti.resetParticle({}, width, height));
		confetti.streamingConfetti = true;
		if (confetti.animationTimer === null) {
			confetti.runAnimation();
		}
	}

	static runAnimation() {
		confetti.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
		confetti.drawParticles(confetti.context);
		confetti.updateParticles();
		confetti.animationTimer = window.requestAnimFrame(confetti.runAnimation);
	};

	static stopConfettiInner() {
		confetti.streamingConfetti = false;
	}

	static removeConfettiInner() {
		stopConfetti();
		confetti.particles = [];
	}

	static toggleConfettiInner() {
		if (confetti.streamingConfetti)
			stopConfettiInner();
		else
			startConfettiInner();
	}

	static drawParticles(context) {
		var particle;
		var x;
		for (var i = 0; i < confetti.particles.length; i++) {
			particle = confetti.particles[i];
			context.beginPath();
			context.lineWidth = particle.diameter;
			context.strokeStyle = particle.color;
			x = particle.x + particle.tilt;
			context.moveTo(x + particle.diameter / 2, particle.y);
			context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
			context.stroke();
		}
	}

	static updateParticles() {
		var width = window.innerWidth;
		var height = window.innerHeight;
		var particle;
		confetti.waveAngle += 0.01;
		for (var i = 0; i < confetti.particles.length; i++) {
			particle = confetti.particles[i];
			if (!confetti.streamingConfetti && particle.y < -15)
				particle.y = height + 100;
			else {
				particle.tiltAngle += particle.tiltAngleIncrement;
				particle.x += Math.sin(confetti.waveAngle);
				particle.y += (Math.cos(confetti.waveAngle) + particle.diameter + confetti.particleSpeed) * 0.5;
				particle.tilt = Math.sin(particle.tiltAngle) * 15;
			}
			if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
				if (confetti.streamingConfetti && confetti.particles.length <= confetti.maxParticleCount)
					confetti.resetParticle(particle, width, height);
				else {
					confetti.particles.splice(i, 1);
					i--;
				}
			}
		}
	}

	static resize() {
		let canva = document.querySelector("#confetti-canvas");
		canva.setAttribute("width", window.innerWidth);
		canva.setAttribute("height", window.innerHeight);
	}
}