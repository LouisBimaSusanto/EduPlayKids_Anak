export const LEVEL_2_DATA = {
  game1_KembarRima: [
    { audio: "Mana yang bunyinya sama? Bola, Kola, Meja", target: ["Bola", "Kola"], options: ["Bola", "Kola", "Meja"] },
    { audio: "Sapi, Topi, Buku", target: ["Sapi", "Topi"], options: ["Sapi", "Topi", "Buku"] },
    { audio: "Mata, Bata, Baju", target: ["Mata", "Bata"], options: ["Mata", "Bata", "Baju"] },
    { audio: "Jari, Tari, Kuda", target: ["Jari", "Tari"], options: ["Jari", "Tari", "Kuda"] },
    { audio: "Kuku, Buku, Bola", target: ["Kuku", "Buku"], options: ["Kuku", "Buku", "Bola"] }
  ],
  game2_KatakLompat: [
    { audio: "Cari teman rima untuk: Baju", target: "Maju", options: ["Maju", "Bola", "Sapi"] },
    { audio: "Cari teman rima untuk: Kuda", target: "Muda", options: ["Muda", "Meja", "Topi"] },
    { audio: "Cari teman rima untuk: Jari", target: "Tari", options: ["Tari", "Buku", "Baju"] },
    { audio: "Cari teman rima untuk: Mata", target: "Bata", options: ["Bata", "Sapi", "Kuku"] },
    { audio: "Cari teman rima untuk: Sapi", target: "Rapi", options: ["Rapi", "Meja", "Kuda"] }
  ],
  game3_RumahKembar: [
    { audio: "Kola", target: "RumahOla", item: "Kola", houses: [{id: "RumahOla", icon: "Bola"}, {id: "RumahUku", icon: "Buku"}] },
    { audio: "Kuku", target: "RumahUku", item: "Kuku", houses: [{id: "RumahOla", icon: "Bola"}, {id: "RumahUku", icon: "Buku"}] },
    { audio: "Pola", target: "RumahOla", item: "Pola", houses: [{id: "RumahOla", icon: "Bola"}, {id: "RumahUku", icon: "Buku"}] },
    { audio: "Suku", target: "RumahUku", item: "Suku", houses: [{id: "RumahOla", icon: "Bola"}, {id: "RumahUku", icon: "Buku"}] },
    { audio: "Lola", target: "RumahOla", item: "Lola", houses: [{id: "RumahOla", icon: "Bola"}, {id: "RumahUku", icon: "Buku"}] }
  ],
  game4_PintuOnset: [
    { audio: "Bunyi pertama dari Bo-la", target: "/b/", options: ["/b/", "/m/", "/s/"] },
    { audio: "Bunyi pertama dari Sa-pi", target: "/s/", options: ["/s/", "/k/", "/t/"] },
    { audio: "Bunyi pertama dari To-pi", target: "/t/", options: ["/t/", "/b/", "/m/"] },
    { audio: "Bunyi pertama dari Bu-ku", target: "/b/", options: ["/b/", "/s/", "/k/"] },
    { audio: "Bunyi pertama dari Me-ja", target: "/m/", options: ["/m/", "/t/", "/s/"] }
  ],
  game5_SulapKiko: [
    { audio: "Ba-ju, ganti B jadi M jadinya?", target: "Maju", options: ["Maju", "Sapi", "Bola"] },
    { audio: "Bo-la, ganti B jadi P jadinya?", target: "Pola", options: ["Pola", "Kuku", "Meja"] },
    { audio: "Ma-ta, ganti M jadi B jadinya?", target: "Bata", options: ["Bata", "Tari", "Kuda"] },
    { audio: "Ja-ri, ganti J jadi T jadinya?", target: "Tari", options: ["Tari", "Buku", "Baju"] },
    { audio: "Sa-pi, ganti S jadi R jadinya?", target: "Rapi", options: ["Rapi", "Meja", "Kuda"] }
  ]
};
