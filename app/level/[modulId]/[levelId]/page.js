'use client';

import { use } from 'react';

import GameRenderer from '@/components/games/GameRenderer.jsx';

import {
  useLevelController,
} from '@/hooks/useLevelController';

export default function LevelPage({
  params,
}) {
  const {
    modulId,
    levelId,
  } = use(params);

  const {
    introVideoUrl,
    games,
    currentGame,

    phase,
    currentIndex,
    progress,
    totalScore,

    gameCounter,

    handleStartGame,
    handleGameComplete,
    handleLevelClose,
  } = useLevelController({
    modulId,
    levelId,
  });

  if (phase === 'complete') {
    return (
      <main
        className="
          w-full
          h-[100dvh]

          overflow-hidden

          flex
          items-center
          justify-center

          bg-gradient-to-b
          from-indigo-900
          via-purple-700
          to-purple-500
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            justify-center

            px-6

            text-center
          "
        >
          <span
            className="
              text-7xl
              md:text-9xl

              animate-bounce
            "
          >
            🎉
          </span>

          <h1
            className="
              mt-6

              text-4xl
              md:text-6xl

              font-black

              text-white
            "
          >
            Level Selesai!
          </h1>

          <p
            className="
              mt-4

              text-xl
              md:text-3xl

              font-black

              text-white/90
            "
          >
            Skor: {totalScore}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        relative

        w-full
        h-[100dvh]

        flex
        flex-col

        overflow-hidden

        bg-gradient-to-b
        from-[#38277f]
        via-[#7928d7]
        to-[#10cfa5]
      "
    >

      <header
        className="
          relative
          z-50

          shrink-0

          w-full

          h-[64px]
          md:h-[72px]

          flex
          items-center

          gap-3
          md:gap-5

          px-4
          md:px-5

          bg-[#4285F4]

          border-b-[3px]
          border-black/10

          shadow-[0_4px_12px_rgba(0,0,0,0.22)]
        "
      >
        {/* CLOSE */}

        <button
          type="button"
          onClick={handleLevelClose}
          aria-label="Keluar"
          className="
            shrink-0

            w-11
            h-11

            md:w-12
            md:h-12

            rounded-full

            bg-[#EA4335]

            border-[3px]
            border-white

            shadow-[0_4px_0_#b31404]

            flex
            items-center
            justify-center

            text-white

            text-xl
            md:text-2xl

            font-black

            transition-all

            hover:brightness-105

            active:translate-y-1
            active:shadow-none
          "
        >
          ✕
        </button>

        {/* PROGRESS */}

        <div
          className="
            flex-1
            min-w-0
          "
        >
          <div
            className="
              w-full

              h-4
              md:h-5

              rounded-full

              border-2
              border-white

              bg-white/20

              p-[2px]

              overflow-hidden
            "
          >
            <div
              className="
                h-full

                rounded-full

                bg-[#34A853]

                transition-all
                duration-700
                ease-out
              "
              style={{
                width:
                  phase === 'intro'
                    ? '0%'
                    : `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* COUNTER */}

        <span
          className="
          shrink-0
          min-w-[44px]

          text-right

          text-white

          font-black

          text-lg
          md:text-2xl
        "
        >
          {games.length > 0
            ? `${Math.min(
              currentIndex + 1,
              games.length
            )}/${games.length}`
            : '--/--'}
        </span>
      </header>

      <section
        className="
          relative

          flex-1

          min-h-0
          min-w-0

          w-full

          overflow-hidden
        "
      >

        {phase === 'loading' && (
          <div
            className="
              w-full
              h-full

              flex
              items-center
              justify-center

              p-6
            "
          >
            <div
              className="
                text-center
                text-white
              "
            >
              <div
                className="
                  text-5xl

                  animate-bounce
                "
              >
                🎮
              </div>

              <p
                className="
                  mt-4

                  text-xl
                  md:text-2xl

                  font-black

                  animate-pulse
                "
              >
                Memuat level...
              </p>
            </div>
          </div>
        )}

        {phase === 'intro' && (
          <div
            className="
              w-full
              h-full

              min-h-0

              flex
              flex-col

              items-center
              justify-center

              gap-4
              md:gap-6

              px-4
              md:px-8

              py-4
              md:py-6

              overflow-y-auto
              overflow-x-hidden
            "
          >
            {/* VIDEO */}

            <div
              className="
                relative

                w-full

                max-w-[960px]

                shrink-0

                aspect-video

                max-h-[calc(100dvh-190px)]

                rounded-[24px]
                md:rounded-[32px]

                border-[5px]

                border-[#FABB05]

                bg-black

                overflow-hidden

                shadow-[0_12px_35px_rgba(0,0,0,0.4)]
              "
            >
              {introVideoUrl && (
                <iframe
                  src={introVideoUrl}
                  className="
                    absolute
                    inset-0

                    w-full
                    h-full

                    border-0
                  "
                  allow="
                    autoplay;
                    encrypted-media;
                    picture-in-picture
                  "
                  allowFullScreen
                  title="Video Pembuka"
                />
              )}
            </div>

            {/* START */}

            <button
              type="button"
              onClick={handleStartGame}
              className="
                shrink-0

                min-w-[220px]
                md:min-w-[300px]

                max-w-[90vw]

                px-8
                md:px-12

                py-3
                md:py-4

                rounded-[24px]
                md:rounded-[28px]

                border-[4px]
                border-white

                bg-[#18e6cf]

                text-[#00695c]

                font-black

                text-3xl
                md:text-5xl

                leading-[0.9]

                tracking-wide

                shadow-[0_7px_0_#008f80,0_12px_25px_rgba(0,0,0,0.35)]

                transition-all

                hover:brightness-105
                hover:-translate-y-0.5

                active:translate-y-[6px]
                active:shadow-[0_1px_0_#008f80]

                cursor-pointer
                select-none
              "
            >
              <span className="block">
                MULAI
              </span>

              <span className="block">
                MAIN 🚀
              </span>
            </button>
          </div>
        )}

        {phase === 'game' && (
          <>
            {games.length === 0 && (
              <div
                className="
                  w-full
                  h-full

                  flex
                  items-center
                  justify-center

                  p-6
                "
              >
                <div
                  className="
                    text-center
                    text-white
                  "
                >
                  <div
                    className="
                      text-5xl

                      animate-pulse
                    "
                  >
                    🎮
                  </div>

                  <p
                    className="
                      mt-4

                      text-xl
                      md:text-2xl

                      font-black
                    "
                  >
                    Memuat game...
                  </p>
                </div>
              </div>
            )}

            {currentGame && (
              <div
                className="
                  w-full
                  h-full

                  min-w-0
                  min-h-0

                  overflow-hidden
                "
              >
                <GameRenderer
                  key={`${currentGame.id}-${currentIndex}`}
                  game={currentGame}
                  onComplete={handleGameComplete}
                  onClose={handleLevelClose}
                />
              </div>
            )}
          </>
        )}

        <div
          className="
            absolute

            bottom-3
            right-3

            md:bottom-5
            md:right-5

            z-40
          "
        >
          <button
            type="button"
            aria-label="Sound"
            className="
              w-11
              h-11

              md:w-14
              md:h-14

              rounded-full

              bg-[#18215f]/90

              border-2
              border-white/30

              flex
              items-center
              justify-center

              text-white

              text-xl
              md:text-2xl

              shadow-[0_5px_15px_rgba(0,0,0,0.3)]

              backdrop-blur-sm

              transition-transform

              hover:scale-105
              active:scale-95

              cursor-pointer
            "
          >
            🔊
          </button>
        </div>
      </section>
    </main>
  );
}