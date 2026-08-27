import GameBatuLoncatan from './modul1/level1/BatuLoncatan/Game';
import GameKeranjang from './modul1/level1/Keranjang/Game';
import GameKereta from './modul1/level1/Kereta/Game';
import GamePaluEs from './modul1/level1/PaluEs/Game';
import GamePancuran from './modul1/level1/Pancuran/Game';
import GameKatakLompat from './modul1/level2/KatakLompat/Game';
import GameKembarRima from './modul1/level2/KembarRima/Game';
import GamePintuOnset from './modul1/level2/PintuOnset/Game';
import GameRumahKembar from './modul1/level2/RumahKembar/Game';
import GameSulapKiko from './modul1/level2/SulapKiko/Game';
import GameGelembungBunyi from './modul1/level3/GelembungBunyi/Game';
import GameJaringIkan from './modul1/level3/JaringIkan/Game';
import GameKapalSelam from './modul1/level3/KapalSelam/Game';
import GamePenyusupLautan from './modul1/level3/PenyusupLautan/Game';
import GamePulauSama from './modul1/level3/PulauSama/Game';
import GameBrankasAjaib from './modul1/level4/BrankasAjaib/Game';
import GameMesinMembongkar from './modul1/level4/MesinMembongkar/Game';
import GameMesinMengganti from './modul1/level4/MesinMengganti/Game';
import GameMesinMerakit from './modul1/level4/MesinMerakit/Game';
import GameTongkatPenghilang from './modul1/level4/TongkatPenghilang/Game';
import GameBalonSukuKata from './modul1/level5/BalonSukuKata/Game';
import GameMeriamRima from './modul1/level5/MeriamRima/Game';
import GameRakitRoket from './modul1/level5/RakitRoket/Game';
import GameSulapKembangApi from './modul1/level5/SulapKembangApi/Game';
import GameTangkapFonem from './modul1/level5/TangkapFonem/Game';
import GameCerminAjaib from './modul1/level6/CerminAjaib/Game';
import GameGerbangCahaya from './modul1/level6/GerbangCahaya/Game';
import GameJembatanAwan from './modul1/level6/JembatanAwan/Game';
import GamePenyihirKata from './modul1/level6/PenyihirKata/Game';
import GamePetiHartaKarun from './modul1/level6/PetiHartaKarun/Game';
import GameAngkaTerbalik from './modul2/level1/AngkaTerbalik/Game';
import GameJejakWarna from './modul2/level1/JejakWarna/Game';
import GameBintangku from './modul2/level2/Bintangku/Game';
import GameDetektifGanda from './modul2/level2/DetektifGanda/Game';
import GameDetektorMatriks from './modul2/level3/DetektorMatriks/Game';
import GameDokterAngka from './modul2/level3/DokterAngka/Game';
import GameKodeRahasia from './modul2/level3/KodeRahasia/Game';
import GameKokiAjaib from './modul2/level4/KokiAjaib/Game';
import GameMelodiHutan from './modul2/level4/MelodiHutan/Game';
import GameOrkestraIngatan from './modul2/level4/OrkestraIngatan/Game';
import GamePetaBajakLaut from './modul2/level4/PetaBajakLaut/Game';
import GameRotasiBintang from './modul2/level4/RotasiBintang/Game';

// ============================================================
// GAME REGISTRY
// ============================================================

const GAME_REGISTRY = {
    'batu-loncatan': GameBatuLoncatan,
    'keranjang': GameKeranjang,
    'kereta': GameKereta,
    'palu-es': GamePaluEs,
    'pancuran': GamePancuran,
    'katak-lompat': GameKatakLompat,
    'kembar-rima': GameKembarRima,
    'pintu-onset': GamePintuOnset,
    'rumah-kembar': GameRumahKembar,
    'sulap-kiko': GameSulapKiko,
    'gelembung-bunyi': GameGelembungBunyi,
    'jaring-ikan': GameJaringIkan,
    'kapal-selam': GameKapalSelam,
    'penyusup-lautan': GamePenyusupLautan,
    'pulau-sama': GamePulauSama,
    'brankas-ajaib': GameBrankasAjaib,
    'mesin-membongkar': GameMesinMembongkar,
    'mesin-mengganti': GameMesinMengganti,
    'mesin-merakit': GameMesinMerakit,
    'tongkat-penghilang': GameTongkatPenghilang,
    'balon-suku-kata': GameBalonSukuKata,
    'meriam-rima': GameMeriamRima,
    'rakit-roket': GameRakitRoket,
    'sulap-kembang-api': GameSulapKembangApi,
    'tangkap-fonem': GameTangkapFonem,
    'cermin-ajaib': GameCerminAjaib,
    'gerbang-cahaya': GameGerbangCahaya,
    'jembatan-awan': GameJembatanAwan,
    'penyihir-kata': GamePenyihirKata,
    'peti-harta-karun': GamePetiHartaKarun,
    'angka-terbalik': GameAngkaTerbalik,
    'jejak-warna': GameJejakWarna,
    'bintangku': GameBintangku,
    'detektif-ganda': GameDetektifGanda,
    'detektor-matriks': GameDetektorMatriks,
    'dokter-angka': GameDokterAngka,
    'kode-rahasia': GameKodeRahasia,
    'koki-ajaib': GameKokiAjaib,
    'melodi-hutan': GameMelodiHutan,
    'orkestra-ingatan': GameOrkestraIngatan,
    'peta-bajak-laut': GamePetaBajakLaut,
    'rotasi-bintang': GameRotasiBintang,
};

// ============================================================
// GET GAME COMPONENT
// ============================================================

export function getGameComponent(gameType) {
    if (!gameType) return null;
    const normalizedType = String(gameType).trim().toLowerCase();
    console.log('[GAME REGISTRY] requested:', gameType);
    console.log('[GAME REGISTRY] normalized:', normalizedType);
    
    const GameComponent = GAME_REGISTRY[normalizedType];
    
    if (!GameComponent) {
        console.warn('[GAME REGISTRY] Game tidak ditemukan:', normalizedType);
        console.log('[GAME REGISTRY] Available:', Object.keys(GAME_REGISTRY));
        return null;
    }
    return GameComponent;
}

export default GAME_REGISTRY;
