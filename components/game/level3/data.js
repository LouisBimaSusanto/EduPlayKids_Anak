export const LEVEL_3_DATA = {
  game1_GelembungBunyi: [
    { audio: "Bunyi pertama dari Bo-la", target: "/b/", options: ["/b/", "/m/", "/s/"] },
    { audio: "Bunyi pertama dari Sa-pi", target: "/s/", options: ["/s/", "/k/", "/t/"] },
    { audio: "Bunyi pertama dari Da-du", target: "/d/", options: ["/d/", "/b/", "/m/"] },
    { audio: "Bunyi pertama dari Gu-la", target: "/g/", options: ["/g/", "/s/", "/k/"] },
    { audio: "Bunyi pertama dari Pi-sang", target: "/p/", options: ["/p/", "/t/", "/s/"] }
  ],
  game2_PulauSama: [
    { audio: "Pilih semua yang awalnya /b/", target: ["Baju", "Buku"], options: ["Baju", "Sapi", "Buku", "Meja"] },
    { audio: "Pilih semua yang awalnya /m/", target: ["Mata", "Meja"], options: ["Topi", "Mata", "Kuda", "Meja"] },
    { audio: "Pilih semua yang awalnya /s/", target: ["Susu", "Sapi"], options: ["Susu", "Baju", "Sapi", "Tari"] },
    { audio: "Pilih semua yang awalnya /t/", target: ["Topi", "Tari"], options: ["Kuku", "Topi", "Bata", "Tari"] },
    { audio: "Pilih semua yang awalnya /k/", target: ["Kuda", "Kuku"], options: ["Kuda", "Bola", "Kuku", "Sapi"] }
  ],
  game3_PenyusupLautan: [
    { audio: "Mana yang aneh? Baju, Buku, Kuda", target: "Kuda", options: ["Baju", "Buku", "Kuda"] },
    { audio: "Mana yang aneh? Sapi, Susu, Meja", target: "Meja", options: ["Sapi", "Susu", "Meja"] },
    { audio: "Mana yang aneh? Topi, Tari, Bola", target: "Bola", options: ["Topi", "Tari", "Bola"] },
    { audio: "Mana yang aneh? Kuda, Kuku, Sapi", target: "Sapi", options: ["Kuda", "Kuku", "Sapi"] },
    { audio: "Mana yang aneh? Mata, Meja, Buku", target: "Buku", options: ["Mata", "Meja", "Buku"] }
  ],
  game4_JaringIkan: [
    { audio: "Tangkap yang awalnya /b/", target: "Bola", options: ["Bola", "Topi", "Sapi"] },
    { audio: "Tangkap yang awalnya /m/", target: "Meja", options: ["Buku", "Meja", "Kuda"] },
    { audio: "Tangkap yang awalnya /s/", target: "Susu", options: ["Susu", "Baju", "Topi"] },
    { audio: "Tangkap yang awalnya /t/", target: "Tari", options: ["Bola", "Meja", "Tari"] },
    { audio: "Tangkap yang awalnya /k/", target: "Kuda", options: ["Sapi", "Kuda", "Buku"] }
  ],
  game5_KapalSelam: [
    { audio: "Baju", target: "Kapal_B", item: "Baju", ships: [{id: "Kapal_B", icon: "/b/"}, {id: "Kapal_S", icon: "/s/"}] },
    { audio: "Sapi", target: "Kapal_S", item: "Sapi", ships: [{id: "Kapal_B", icon: "/b/"}, {id: "Kapal_S", icon: "/s/"}] },
    { audio: "Buku", target: "Kapal_B", item: "Buku", ships: [{id: "Kapal_B", icon: "/b/"}, {id: "Kapal_S", icon: "/s/"}] },
    { audio: "Susu", target: "Kapal_S", item: "Susu", ships: [{id: "Kapal_B", icon: "/b/"}, {id: "Kapal_S", icon: "/s/"}] },
    { audio: "Bola", target: "Kapal_B", item: "Bola", ships: [{id: "Kapal_B", icon: "/b/"}, {id: "Kapal_S", icon: "/s/"}] }
  ]
};
