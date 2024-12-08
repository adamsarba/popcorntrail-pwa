import confetti from "canvas-confetti";

// Basic Canon
export const confettiCanon = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

// Realistic Look
export const confettiAnimation = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.65 },
  };

  function fire(particleRatio: number, opts: Record<string, unknown>) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

// Emoji Confetti
export const emojiConfetti = () => {
  const scalar = 3;
  const emoji1 = confetti.shapeFromText({ text: "🎬", scalar });
  const emoji2 = confetti.shapeFromText({ text: "🍿", scalar });

  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 0,
    decay: 0.96,
    startVelocity: 20,
    scalar,
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 15,
      shapes: [emoji1],
    });

    confetti({
      ...defaults,
      particleCount: 15,
      shapes: [emoji2],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 500);
  setTimeout(shoot, 1000);
};
