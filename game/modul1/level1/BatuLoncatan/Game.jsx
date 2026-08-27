'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import { Leaf } from 'lucide-react';

import { useTTS } from '@/hooks/useAudio';

import { gameLog } from '../../../shared/gameLogger';

// ============================================================
// ROUNDS
// ============================================================

const ROUNDS = [
  {
    id: 1,
    name: 'Ara',
    emoji: '🦜',
    targetTaps: 2,
    instruction:
      'A... ra. Dua ketukan! Tekan daun dua kali.',
  },

  {
    id: 2,
    name: 'Kiko',
    emoji: '🦊',
    targetTaps: 2,
    instruction:
      'Ki... ko. Dua ketukan! Bantu Kiko menyeberang.',
  },

  {
    id: 3,
    name: 'Monyet',
    emoji: '🐒',
    targetTaps: 2,
    instruction:
      'Mo... nyet. Dua ketukan!',
  },

  {
    id: 4,
    name: 'Harimau',
    emoji: '🐯',
    targetTaps: 3,
    instruction:
      'Ha... ri... mau. Tiga ketukan! Tekan tiga kali.',
  },

  {
    id: 5,
    name: 'Kelinci',
    emoji: '🐰',
    targetTaps: 3,
    instruction:
      'Ke... lin... ci. Tiga ketukan!',
  },
];

// ============================================================
// SCORE
// ============================================================

const SCORE_PER_ROUND = 20;

// 5 round x 20 = 100 point maksimum.

// ============================================================
// GAME
// ============================================================

export default function GameBatuLoncatan({
  game,
  onComplete,
  onClose,
}) {
  const [
    currentRound,
    setCurrentRound,
  ] = useState(0);

  const [
    taps,
    setTaps,
  ] = useState(0);

  const [
    isCrossing,
    setIsCrossing,
  ] = useState(false);

  const { speak } =
    useTTS();

  const roundData =
    ROUNDS[currentRound];

  // ==========================================================
  // ROUND INSTRUCTION
  // ==========================================================

  useEffect(() => {
    if (
      !isCrossing &&
      roundData
    ) {
      speak(
        roundData.instruction
      );
    }
  }, [
    currentRound,
    isCrossing,
    roundData,
    speak,
  ]);

  // ==========================================================
  // ROUND START LOGGER
  // ==========================================================

  useEffect(() => {
    if (!roundData) {
      return;
    }

    gameLog(
      'ROUND_START',
      {
        game:
          game?.type ||
          game?.slug ||
          'batu-loncatan',

        round:
          currentRound + 1,

        totalRounds:
          ROUNDS.length,
      }
    );
  }, [
    currentRound,
    game,
    roundData,
  ]);

  // ==========================================================
  // TAP
  // ==========================================================

  const handleTap = () => {
    if (
      !roundData ||
      isCrossing ||
      taps >=
        roundData.targetTaps
    ) {
      return;
    }

    const newTaps =
      taps + 1;

    setTaps(
      newTaps
    );

    gameLog(
      'TAP',
      {
        round:
          currentRound + 1,

        tap:
          newTaps,

        target:
          roundData.targetTaps,
      }
    );

    // --------------------------------------------------------
    // ROUND COMPLETE
    // --------------------------------------------------------

    if (
      newTaps ===
      roundData.targetTaps
    ) {
      setIsCrossing(
        true
      );

      speak(
        `Hore! ${roundData.name} berhasil menyeberang!`
      );

      gameLog(
        'ROUND_COMPLETE',
        {
          round:
            currentRound + 1,

          name:
            roundData.name,

          score:
            SCORE_PER_ROUND,
        }
      );

      setTimeout(() => {
        // ----------------------------------------------------
        // NEXT ROUND
        // ----------------------------------------------------

        if (
          currentRound <
          ROUNDS.length - 1
        ) {
          setCurrentRound(
            (previous) =>
              previous + 1
          );

          setTaps(0);

          setIsCrossing(
            false
          );

          return;
        }

        // ----------------------------------------------------
        // GAME COMPLETE
        // ----------------------------------------------------

        const finalScore =
          ROUNDS.length *
          SCORE_PER_ROUND;

        gameLog(
          'GAME_COMPLETE',
          {
            score:
              finalScore,

            rounds:
              ROUNDS.length,
          }
        );

        if (
          onComplete
        ) {
          onComplete({
            completed:
              true,

            score:
              finalScore,

            stars: 3,

            metadata: {
              rounds:
                ROUNDS.length,
            },
          });
        }
      }, 1800);

      return;
    }

    // --------------------------------------------------------
    // NORMAL TAP
    // --------------------------------------------------------

    speak(
      newTaps.toString()
    );
  };

  // ==========================================================
  // SAFETY
  // ==========================================================

  if (!roundData) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="
        relative

        w-full
        h-full

        min-w-0
        min-h-0

        overflow-hidden

        flex
        flex-col

        bg-gradient-to-b
        from-[#38277f]
        via-[#7928d7]
        to-[#10cfa5]
      "
    >
      {/* ====================================================
          GAME AREA
          ==================================================== */}

      <div
        className="
          relative

          flex-1

          min-h-0

          w-full

          overflow-hidden
        "
      >
        {/* ==================================================
            ROUND COUNTER
            ================================================== */}

        <div
          className="
            absolute

            top-4
            left-4

            md:top-6
            md:left-6

            z-30

            px-4
            py-2

            md:px-5
            md:py-2.5

            rounded-full

            bg-[#21145f]/80

            border
            border-white/20

            shadow-lg

            backdrop-blur-md
          "
        >
          <span
            className="
              text-sm
              md:text-base

              font-black

              text-white
            "
          >
            {currentRound + 1}
            {' / '}
            {ROUNDS.length}
          </span>
        </div>

        {/* ==================================================
            RIVER
            ================================================== */}

        <div
          className="
            absolute

            left-0
            right-0

            top-[34%]
            bottom-[27%]

            bg-gradient-to-b
            from-[#00E5C8]/10
            via-[#00E5C8]/35
            to-[#00E5C8]/10

            border-y
            border-white/5

            flex
            items-center
            justify-center

            px-8

            pointer-events-none
          "
        >
          <div
            className="
              flex

              items-center
              justify-center

              gap-6
              md:gap-10
              lg:gap-14
            "
          >
            <AnimatePresence>
              {Array.from({
                length:
                  roundData.targetTaps,
              }).map(
                (_, index) => (
                  <motion.div
                    key={`${currentRound}-${index}`}
                    initial={{
                      opacity: 0,
                      scale: 0.6,
                      y: 20,
                    }}
                    animate={
                      taps > index
                        ? {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                          }
                        : {
                            opacity: 0,
                            scale: 0.6,
                            y: 20,
                          }
                    }
                    transition={{
                      type: 'spring',
                      bounce: 0.45,
                    }}
                    className="
                      flex
                      items-center
                      justify-center

                      w-14
                      h-14

                      md:w-18
                      md:h-18

                      lg:w-20
                      lg:h-20

                      rounded-full

                      bg-[#55c878]/80

                      border-2
                      border-white/20

                      shadow-[0_8px_18px_rgba(0,0,0,0.25)]
                    "
                  >
                    <Leaf
                      className="
                        w-7
                        h-7

                        md:w-8
                        md:h-8

                        lg:w-9
                        lg:h-9

                        text-[#b8f5c6]

                        fill-current
                      "
                    />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ==================================================
            CHARACTER
            ================================================== */}

        <AnimatePresence
          mode="popLayout"
        >
          <motion.div
            key={`character-${currentRound}`}
            initial={{
              x: -100,
              opacity: 0,
            }}
            animate={
              isCrossing
                ? {
                    x: '70vw',

                    y: [
                      0,
                      -20,
                      0,
                      -20,
                      0,
                    ],

                    opacity: 0,

                    transition: {
                      duration: 1.4,
                      ease: 'easeInOut',
                    },
                  }
                : {
                    x:
                      taps * 45,

                    y:
                      taps > 0
                        ? [
                            0,
                            -16,
                            0,
                          ]
                        : 0,

                    opacity: 1,
                  }
            }
            exit={{
              x: '80vw',
              opacity: 0,
            }}
            transition={{
              x: {
                type: 'spring',
                bounce: 0.3,
              },

              y: {
                duration: 0.45,
                ease: 'easeInOut',
              },
            }}
            className="
              absolute

              left-[5%]

              bottom-[24%]

              z-20

              flex
              items-center
              justify-center

              w-24
              h-24

              sm:w-28
              sm:h-28

              md:w-32
              md:h-32

              lg:w-36
              lg:h-36
            "
          >
            <span
              className="
                text-[5.5rem]

                sm:text-[6rem]

                md:text-6xl md:text-[7rem]

                lg:text-6xl md:text-[8rem]

                leading-none

                drop-shadow-[0_12px_16px_rgba(0,0,0,0.35)]
              "
            >
              {roundData.emoji}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* ==================================================
            SUCCESS EFFECT
            ================================================== */}

        <AnimatePresence>
          {isCrossing && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: [
                  0,
                  0.8,
                  0,
                ],

                scale: [
                  0.5,
                  1.4,
                  2,
                ],
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 1,
              }}
              className="
                absolute

                left-1/2
                top-1/2

                -translate-x-1/2
                -translate-y-1/2

                z-10

                w-48
                h-48

                md:w-64
                md:h-64

                rounded-full

                bg-[radial-gradient(circle,rgba(0,255,128,0.5)_0%,transparent_70%)]

                pointer-events-none
              "
            />
          )}
        </AnimatePresence>
      </div>

      {/* ====================================================
          ACTION AREA
          ==================================================== */}

      <div
        className="
          shrink-0

          w-full

          flex
          justify-center

          px-4

          pb-5
          md:pb-7
          lg:pb-8

          relative

          z-40
        "
      >
        <motion.button
          type="button"
          onClick={
            handleTap
          }
          disabled={
            taps >=
              roundData.targetTaps ||
            isCrossing
          }
          whileTap={{
            scale: 0.97,
            y: 4,
          }}
          className={`
            relative

            flex
            items-center
            justify-center

            gap-3

            w-[min(78vw,360px)]

            h-16
            sm:h-[70px]
            md:h-[76px]

            rounded-[22px]
            md:rounded-[26px]

            border-[3px]
            md:border-4

            border-white

            bg-gradient-to-b
            from-[#43e695]
            to-[#16c978]

            text-white

            font-black

            text-3xl
            sm:text-4xl
            md:text-5xl

            shadow-[0_7px_0_#07843f,0_12px_24px_rgba(0,0,0,0.25)]

            transition-all

            ${
              taps <
                roundData.targetTaps &&
              !isCrossing
                ? 'hover:brightness-105'
                : 'opacity-50 grayscale cursor-not-allowed'
            }
          `}
        >
          <Leaf
            className="
              shrink-0

              w-7
              h-7

              sm:w-8
              sm:h-8

              md:w-9
              md:h-9

              text-white

              fill-current
            "
          />

          <span>
            TAP!
          </span>
        </motion.button>
      </div>
    </div>
  );
}