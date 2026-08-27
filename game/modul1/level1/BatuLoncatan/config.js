export const GAME_CONFIG = {
    id: 'batu-loncatan',
    title: 'Batu Loncatan',

    score: 20,

    rounds: [
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
    ],
};