// data/ubigeo.ts

export interface Ubigeo {
  provincia: string;
  region: string;
}

export const provinciasPeru: Ubigeo[] = [
  // Amazonas
  { provincia: "Chachapoyas", region: "Amazonas" }, { provincia: "Bagua", region: "Amazonas" }, { provincia: "Bongará", region: "Amazonas" }, { provincia: "Condorcanqui", region: "Amazonas" }, { provincia: "Luya", region: "Amazonas" }, { provincia: "Rodríguez de Mendoza", region: "Amazonas" }, { provincia: "Utcubamba", region: "Amazonas" },
  // Áncash
  { provincia: "Huaraz", region: "Áncash" }, { provincia: "Aija", region: "Áncash" }, { provincia: "Antonio Raymondi", region: "Áncash" }, { provincia: "Asunción", region: "Áncash" }, { provincia: "Bolognesi", region: "Áncash" }, { provincia: "Carhuaz", region: "Áncash" }, { provincia: "Carlos Fermín Fitzcarrald", region: "Áncash" }, { provincia: "Casma", region: "Áncash" }, { provincia: "Corongo", region: "Áncash" }, { provincia: "Huari", region: "Áncash" }, { provincia: "Huarmey", region: "Áncash" }, { provincia: "Huaylas", region: "Áncash" }, { provincia: "Mariscal Luzuriaga", region: "Áncash" }, { provincia: "Ocros", region: "Áncash" }, { provincia: "Pallasca", region: "Áncash" }, { provincia: "Pomabamba", region: "Áncash" }, { provincia: "Recuay", region: "Áncash" }, { provincia: "Santa", region: "Áncash" }, { provincia: "Sihuas", region: "Áncash" }, { provincia: "Yungay", region: "Áncash" },
  // Apurímac
  { provincia: "Abancay", region: "Apurímac" }, { provincia: "Andahuaylas", region: "Apurímac" }, { provincia: "Antabamba", region: "Apurímac" }, { provincia: "Aymaraes", region: "Apurímac" }, { provincia: "Cotabambas", region: "Apurímac" }, { provincia: "Chincheros", region: "Apurímac" }, { provincia: "Grau", region: "Apurímac" },
  // Arequipa
  { provincia: "Arequipa", region: "Arequipa" }, { provincia: "Camaná", region: "Arequipa" }, { provincia: "Caravelí", region: "Arequipa" }, { provincia: "Castilla", region: "Arequipa" }, { provincia: "Caylloma", region: "Arequipa" }, { provincia: "Condesuyos", region: "Arequipa" }, { provincia: "Islay", region: "Arequipa" }, { provincia: "La Unión", region: "Arequipa" },
  // Ayacucho
  { provincia: "Huamanga", region: "Ayacucho" }, { provincia: "Cangallo", region: "Ayacucho" }, { provincia: "Huanca Sancos", region: "Ayacucho" }, { provincia: "Huanta", region: "Ayacucho" }, { provincia: "La Mar", region: "Ayacucho" }, { provincia: "Lucanas", region: "Ayacucho" }, { provincia: "Parinacochas", region: "Ayacucho" }, { provincia: "Páucar del Sara Sara", region: "Ayacucho" }, { provincia: "Sucre", region: "Ayacucho" }, { provincia: "Víctor Fajardo", region: "Ayacucho" }, { provincia: "Vilcas Huamán", region: "Ayacucho" },
  // Cajamarca
  { provincia: "Cajamarca", region: "Cajamarca" }, { provincia: "Cajabamba", region: "Cajamarca" }, { provincia: "Celendín", region: "Cajamarca" }, { provincia: "Chota", region: "Cajamarca" }, { provincia: "Contumazá", region: "Cajamarca" }, { provincia: "Cutervo", region: "Cajamarca" }, { provincia: "Hualgayoc", region: "Cajamarca" }, { provincia: "Jaén", region: "Cajamarca" }, { provincia: "San Ignacio", region: "Cajamarca" }, { provincia: "San Marcos", region: "Cajamarca" }, { provincia: "San Miguel", region: "Cajamarca" }, { provincia: "San Pablo", region: "Cajamarca" }, { provincia: "Santa Cruz", region: "Cajamarca" },
  // Callao
  { provincia: "Callao", region: "Callao" },
  // Cusco
  { provincia: "Cusco", region: "Cusco" }, { provincia: "Acomayo", region: "Cusco" }, { provincia: "Anta", region: "Cusco" }, { provincia: "Calca", region: "Cusco" }, { provincia: "Canas", region: "Cusco" }, { provincia: "Canchis", region: "Cusco" }, { provincia: "Chumbivilcas", region: "Cusco" }, { provincia: "Espinar", region: "Cusco" }, { provincia: "La Convención", region: "Cusco" }, { provincia: "Paruro", region: "Cusco" }, { provincia: "Paucartambo", region: "Cusco" }, { provincia: "Quispicanchi", region: "Cusco" }, { provincia: "Urubamba", region: "Cusco" },
  // Huancavelica
  { provincia: "Huancavelica", region: "Huancavelica" }, { provincia: "Acobamba", region: "Huancavelica" }, { provincia: "Angaraes", region: "Huancavelica" }, { provincia: "Castrovirreyna", region: "Huancavelica" }, { provincia: "Churcampa", region: "Huancavelica" }, { provincia: "Huaytará", region: "Huancavelica" }, { provincia: "Tayacaja", region: "Huancavelica" },
  // Huánuco
  { provincia: "Huánuco", region: "Huánuco" }, { provincia: "Ambo", region: "Huánuco" }, { provincia: "Dos de Mayo", region: "Huánuco" }, { provincia: "Huacaybamba", region: "Huánuco" }, { provincia: "Huamalíes", region: "Huánuco" }, { provincia: "Leoncio Prado", region: "Huánuco" }, { provincia: "Marañón", region: "Huánuco" }, { provincia: "Pachitea", region: "Huánuco" }, { provincia: "Puerto Inca", region: "Huánuco" }, { provincia: "Lauricocha", region: "Huánuco" }, { provincia: "Yarowilca", region: "Huánuco" },
  // Ica
  { provincia: "Ica", region: "Ica" }, { provincia: "Chincha", region: "Ica" }, { provincia: "Nazca", region: "Ica" }, { provincia: "Palpa", region: "Ica" }, { provincia: "Pisco", region: "Ica" },
  // Junín
  { provincia: "Huancayo", region: "Junín" }, { provincia: "Concepción", region: "Junín" }, { provincia: "Chanchamayo", region: "Junín" }, { provincia: "Jauja", region: "Junín" }, { provincia: "Junín", region: "Junín" }, { provincia: "Satipo", region: "Junín" }, { provincia: "Tarma", region: "Junín" }, { provincia: "Yauli", region: "Junín" }, { provincia: "Chupaca", region: "Junín" },
  // La Libertad
  { provincia: "Trujillo", region: "La Libertad" }, { provincia: "Ascope", region: "La Libertad" }, { provincia: "Bolívar", region: "La Libertad" }, { provincia: "Chepén", region: "La Libertad" }, { provincia: "Julcán", region: "La Libertad" }, { provincia: "Otuzco", region: "La Libertad" }, { provincia: "Pacasmayo", region: "La Libertad" }, { provincia: "Pataz", region: "La Libertad" }, { provincia: "Sánchez Carrión", region: "La Libertad" }, { provincia: "Santiago de Chuco", region: "La Libertad" }, { provincia: "Gran Chimú", region: "La Libertad" }, { provincia: "Virú", region: "La Libertad" },
  // Lambayeque
  { provincia: "Chiclayo", region: "Lambayeque" }, { provincia: "Ferreñafe", region: "Lambayeque" }, { provincia: "Lambayeque", region: "Lambayeque" },
  // Lima
  { provincia: "Lima", region: "Lima" }, { provincia: "Barranca", region: "Lima" }, { provincia: "Cajatambo", region: "Lima" }, { provincia: "Canta", region: "Lima" }, { provincia: "Cañete", region: "Lima" }, { provincia: "Huaral", region: "Lima" }, { provincia: "Huarochirí", region: "Lima" }, { provincia: "Huaura", region: "Lima" }, { provincia: "Oyón", region: "Lima" }, { provincia: "Yauyos", region: "Lima" },
  // Loreto
  { provincia: "Maynas", region: "Loreto" }, { provincia: "Alto Amazonas", region: "Loreto" }, { provincia: "Loreto", region: "Loreto" }, { provincia: "Mariscal Ramón Castilla", region: "Loreto" }, { provincia: "Requena", region: "Loreto" }, { provincia: "Ucayali", region: "Loreto" }, { provincia: "Datem del Marañón", region: "Loreto" }, { provincia: "Putumayo", region: "Loreto" },
  // Madre de Dios
  { provincia: "Tambopata", region: "Madre de Dios" }, { provincia: "Manu", region: "Madre de Dios" }, { provincia: "Tahuamanu", region: "Madre de Dios" },
  // Moquegua
  { provincia: "Mariscal Nieto", region: "Moquegua" }, { provincia: "General Sánchez Cerro", region: "Moquegua" }, { provincia: "Ilo", region: "Moquegua" },
  // Pasco
  { provincia: "Pasco", region: "Pasco" }, { provincia: "Daniel Alcides Carrión", region: "Pasco" }, { provincia: "Oxapampa", region: "Pasco" },
  // Piura
  { provincia: "Piura", region: "Piura" }, { provincia: "Ayabaca", region: "Piura" }, { provincia: "Huancabamba", region: "Piura" }, { provincia: "Morropón", region: "Piura" }, { provincia: "Paita", region: "Piura" }, { provincia: "Sullana", region: "Piura" }, { provincia: "Talara", region: "Piura" }, { provincia: "Sechura", region: "Piura" },
  // Puno
  { provincia: "Puno", region: "Puno" }, { provincia: "Azángaro", region: "Puno" }, { provincia: "Carabaya", region: "Puno" }, { provincia: "Chucuito", region: "Puno" }, { provincia: "El Collao", region: "Puno" }, { provincia: "Huancané", region: "Puno" }, { provincia: "Lampa", region: "Puno" }, { provincia: "Melgar", region: "Puno" }, { provincia: "Moho", region: "Puno" }, { provincia: "San Antonio de Putina", region: "Puno" }, { provincia: "San Román", region: "Puno" }, { provincia: "Sandia", region: "Puno" }, { provincia: "Yunguyo", region: "Puno" },
  // San Martín
  { provincia: "Moyobamba", region: "San Martín" }, { provincia: "Bellavista", region: "San Martín" }, { provincia: "El Dorado", region: "San Martín" }, { provincia: "Huallaga", region: "San Martín" }, { provincia: "Lamas", region: "San Martín" }, { provincia: "Mariscal Cáceres", region: "San Martín" }, { provincia: "Picota", region: "San Martín" }, { provincia: "Rioja", region: "San Martín" }, { provincia: "San Martín", region: "San Martín" }, { provincia: "Tocache", region: "San Martín" },
  // Tacna
  { provincia: "Tacna", region: "Tacna" }, { provincia: "Candarave", region: "Tacna" }, { provincia: "Jorge Basadre", region: "Tacna" }, { provincia: "Tarata", region: "Tacna" },
  // Tumbes
  { provincia: "Tumbes", region: "Tumbes" }, { provincia: "Contralmirante Villar", region: "Tumbes" }, { provincia: "Zarumilla", region: "Tumbes" },
  // Ucayali
  { provincia: "Coronel Portillo", region: "Ucayali" }, { provincia: "Atalaya", region: "Ucayali" }, { provincia: "Padre Abad", region: "Ucayali" }, { provincia: "Purús", region: "Ucayali" }
];