// SDDA — index des produits du catalogue.
// Source unique utilisée par : la recherche globale (header), la grille du catalogue
// et la fiche produit dynamique (produit.html?ref=...).
const SITE_CATEGORIES = [
  { key: 'irrigation', label: 'Irrigation', icon: 'water_drop' },
  { key: 'phyto', label: 'Produit Phytosanitaire', icon: 'psychiatry' },
  { key: 'gardening', label: 'Jardinage', icon: 'yard' },
  { key: 'garden-tools', label: 'Outils de Jardinage', icon: 'content_cut' },
  { key: 'seeds', label: 'Semences', icon: 'eco' },
  { key: 'vitamins', label: 'Vitamine', icon: 'science' },
  { key: 'farm-tools', label: 'Outillage Agricole', icon: 'agriculture' },
  { key: 'beekeeping', label: 'Apiculteur', icon: 'hive' },
];

const SITE_PRODUCTS = [
  {
    ref: 'IRR-001',
    name: "Pistolet d'Arrosage Multi-Jets Tramontina + Raccords",
    category: 'irrigation',
    categoryLabel: 'Irrigation',
    price: 2800,
    priceLabel: '2 800 DZD',
    image: 'assets/images/photo_8_2026-08-19_11-44-54.jpg',
    description:
      "Pistolet d'arrosage multi-jets réglable avec poignée ergonomique antidérapante, livré avec 3 raccords rapides pour tuyau d'arrosage. Idéal pour l'irrigation de jardins, serres et petites parcelles.",
    specs: [
      { label: 'Marque', value: 'Tramontina' },
      { label: 'Réglages de jet', value: '7 modes' },
      { label: 'Contenu', value: 'Pistolet + 3 raccords' },
      { label: 'Disponibilité', value: 'En stock' },
    ],
  },
  {
    ref: 'PHY-001',
    name: 'Herbicide Sélectif Maïs Pro-X',
    category: 'phyto',
    categoryLabel: 'Produit Phytosanitaire',
    price: 26500,
    priceLabel: '26 500 DZD',
    image: '',
    description:
      "Solution herbicide concentrée sélective pour cultures de maïs. Produit réglementé réservé aux professionnels agréés — un numéro d'agrément Certiphyto est requis avant expédition.",
    specs: [
      { label: 'Conditionnement', value: 'Bidon de 10L' },
      { label: 'Usage', value: 'Réservé aux professionnels agréés' },
      { label: 'Agrément requis', value: 'Certiphyto' },
      { label: 'Disponibilité', value: 'En stock' },
    ],
    regulated: true,
  },
  {
    ref: 'GAR-001',
    name: 'Substrat Tourbe Pindstrup Plus - Sac Horticole',
    category: 'gardening',
    categoryLabel: 'Jardinage',
    price: 1200,
    priceLabel: '1 200 DZD',
    image: 'assets/images/photo_5_2026-08-19_11-44-54.jpg',
    description:
      "Substrat de tourbe premium Pindstrup Plus, formulé pour offrir une structure aérée et une rétention d'eau optimale. Convient au rempotage, semis et cultures sous serre.",
    specs: [
      { label: 'Marque', value: 'Pindstrup' },
      { label: 'Type', value: 'Substrat tourbe horticole' },
      { label: 'Usage', value: 'Rempotage, semis, serre' },
      { label: 'Disponibilité', value: 'En stock' },
    ],
  },
  {
    ref: 'TOOL-001',
    name: 'Binette-Fourche Bimanche Tramontina',
    category: 'garden-tools',
    categoryLabel: 'Outils de Jardinage',
    price: 1450,
    priceLabel: '1 450 DZD',
    image: 'assets/images/photo_7_2026-08-19_11-44-54.jpg',
    description:
      "Outil de jardinage bimanche combinant une binette et une fourchette à 2 dents, manche en bois robuste. Idéal pour le désherbage, l'ameublissement du sol et les petits travaux de jardin.",
    specs: [
      { label: 'Marque', value: 'Tramontina' },
      { label: 'Type', value: 'Binette + fourche 2 dents' },
      { label: 'Manche', value: 'Bois' },
      { label: 'Disponibilité', value: 'En stock' },
    ],
  },
  {
    ref: 'VIT-001',
    name: "LIVA'S P-CU - Solution d'Engrais NP au Cuivre 1.1L",
    category: 'vitamins',
    categoryLabel: 'Vitamine',
    price: 950,
    priceLabel: '950 DZD',
    image: 'assets/images/photo_6_2026-08-19_11-44-54.jpg',
    description:
      "Solution d'engrais liquide NP enrichie au cuivre, pour la nutrition et le renforcement des cultures. Favorise la croissance et la résistance des plantes.",
    specs: [
      { label: 'Marque', value: "LIVA'S" },
      { label: 'Composition', value: 'Azote, Phosphore, Cuivre' },
      { label: 'Poids net', value: '1,1 L' },
      { label: 'Disponibilité', value: 'En stock' },
    ],
  },
  {
    ref: 'FARM-001',
    name: 'Débroussailleuse Électrique Professionnelle',
    category: 'farm-tools',
    categoryLabel: 'Outillage Agricole',
    price: 18500,
    priceLabel: '18 500 DZD',
    image: 'assets/images/photo_9_2026-08-19_11-44-54.jpg',
    description:
      "Débroussailleuse électrique professionnelle avec poignée ergonomique et interrupteur de sécurité. Conçue pour l'entretien intensif des espaces agricoles et espaces verts.",
    specs: [
      { label: 'Type', value: 'Débroussailleuse électrique' },
      { label: 'Poignée', value: 'Ergonomique avec sécurité' },
      { label: 'Usage', value: 'Professionnel' },
      { label: 'Disponibilité', value: 'En stock' },
    ],
  },
];
