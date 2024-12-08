import {
  confettiCanon,
  confettiAnimation,
  emojiConfetti,
} from "./confettiUtils";

// ConfettiDemo component
export const ConfettiDemo = () => {
  return (
    <div className="my-12 flex flex-col items-stretch gap-3 child:rounded-xl child:bg-neutral-900 child:px-3 child:py-2">
      <button onClick={confettiAnimation}>Basic Animation</button>
      <button onClick={confettiCanon}>Confetti Canon</button>
      <button onClick={emojiConfetti}>Emoji Confetti</button>
    </div>
  );
};
