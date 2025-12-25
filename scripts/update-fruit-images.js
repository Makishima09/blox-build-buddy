const fs = require('fs');
const path = require('path');

// Leer el JSON de frutas
const fruitsPath = 'src/data/fruits.json';
const fruits = JSON.parse(fs.readFileSync(fruitsPath, 'utf8'));

// Directorio de imágenes
const imgDir = 'public/fruit_img';

if (!fs.existsSync(imgDir)) {
  console.log('Creando directorio public/fruit_img...');
  fs.mkdirSync(imgDir, { recursive: true });
}

// Obtener todas las imágenes
const files = fs.readdirSync(imgDir).filter(f => 
  f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
);

console.log(`\n📸 Imágenes encontradas en ${imgDir}:`);
files.forEach(f => console.log(`  - ${f}`));

let updated = 0;
let notFound = [];

files.forEach(file => {
  // Buscar patrón: Nombre_Fruit.ext
  const nameMatch = file.match(/^(.+?)_Fruit\.(webp|png|jpg|jpeg)$/i);
  
  if (nameMatch) {
    const fruitName = nameMatch[1];
    
    // Buscar la fruta en el JSON (por nombre, case insensitive)
    const fruit = fruits.find(f => 
      f.name.toLowerCase() === fruitName.toLowerCase() ||
      f.id.toLowerCase() === fruitName.toLowerCase()
    );
    
    if (fruit) {
      const oldImage = fruit.image;
      fruit.image = `/fruit_img/${file}`;
      updated++;
      console.log(`\n✅ Actualizado: ${fruit.name}`);
      console.log(`   ID: ${fruit.id}`);
      if (oldImage && oldImage !== fruit.image) {
        console.log(`   Antes: ${oldImage}`);
      }
      console.log(`   Ahora: ${fruit.image}`);
    } else {
      notFound.push(fruitName);
      console.log(`\n❌ No encontrado en JSON: ${fruitName}`);
      console.log(`   Archivo: ${file}`);
    }
  } else {
    console.log(`\n⚠️  Formato no reconocido: ${file}`);
    console.log(`   Formato esperado: Nombre_Fruit.webp (ej: Rocket_Fruit.webp)`);
  }
});

// Guardar JSON actualizado
fs.writeFileSync(fruitsPath, JSON.stringify(fruits, null, 2));

console.log(`\n📊 Resumen:`);
console.log(`   ✅ Actualizadas: ${updated}`);
console.log(`   ❌ No encontradas: ${notFound.length}`);
if (notFound.length > 0) {
  console.log(`   Frutas no encontradas: ${notFound.join(', ')}`);
}
console.log(`\n✨ JSON actualizado exitosamente!\n`);

