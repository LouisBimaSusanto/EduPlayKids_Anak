'use client';

import { getGameComponent } from '@/game';

export default function GameRenderer({
  game,
  onComplete,
  onClose,
}) {
  if (!game) {
    return (
      <GameError
        message="Data game tidak ditemukan."
        onClose={onClose}
      />
    );
  }

  const gameType =
    game.type ||
    game.game_type ||
    game.slug ||
    game.id;

  console.log(
    '[GameRenderer] game:',
    game
  );

  console.log(
    '[GameRenderer] type:',
    gameType
  );

  const GameComponent =
    getGameComponent(
      gameType
    );

  if (!GameComponent) {
    return (
      <GameError
        message={`Game "${gameType}" belum terdaftar.`}
        onClose={onClose}
      />
    );
  }

  return (
    <div
      className="
        w-full
        h-full

        min-w-0
        min-h-0

        overflow-hidden
      "
    >
      <GameComponent
        game={game}
        onComplete={onComplete}
        onClose={onClose}
      />
    </div>
  );
}

function GameError({
  message,
  onClose,
}) {
  return (
    <div
      className="
        w-full
        h-full

        flex
        items-center
        justify-center

        p-6

        text-white
      "
    >
      <div
        className="
          w-full
          max-w-md

          rounded-3xl

          border
          border-white/20

          bg-black/20

          p-8

          text-center

          backdrop-blur-md
        "
      >
        <div className="text-5xl">
          🎮
        </div>

        <h2
          className="
            mt-4

            text-2xl
            md:text-3xl

            font-black
          "
        >
          Game tidak tersedia
        </h2>

        <p
          className="
            mt-3

            text-sm
            md:text-base

            text-white/70
          "
        >
          {message}
        </p>

        {onClose && (
          <button
            type="button"
            onClick={
              onClose
            }
            className="
              mt-6

              rounded-2xl

              bg-white

              px-6
              py-3

              font-black

              text-[#38277f]

              shadow-lg

              hover:scale-105
              active:scale-95

              transition-transform
            "
          >
            Kembali
          </button>
        )}
      </div>
    </div>
  );
}