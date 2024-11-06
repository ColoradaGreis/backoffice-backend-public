const currentProviders = [
  {
    name: 'reite'
  }
]
const currentReiteProducts = [
  {
    short_name: 'Popcorn Mantequilla',
    productId: 'DEV_gTh8NYBajBQUaz1CN52R',
    name: 'Puri Popcorn Variedades 25gr'
  },
  {
    short_name: 'Popcorn Caramelo',
    productId: 'DEV_gTh8NYBajBQUaz1CN52R',
    name: 'Puri Popcorn Variedades 25gr'
  },
  {
    short_name: 'Jugo Variedades 200cc',
    productId: 'DEV_CNV_003',
    name: 'Jugo AMA Variedades 200cc'
  },
  {
    short_name: 'Gusanos Acidos',
    productId: 'DEV_ifWrUd86RukLVCYEPbgs',
    name: 'Gusanos Acidos 40 g'
  },
  {
    short_name: 'Jugo Piña Sin azúcar 200ml',
    productId: 'DEV_CNV_004',
    name: 'Jugo Piña Sin azúcar 200ml'
  },
  {
    short_name: 'Atun Lomitos en aceite',
    productId: 'DEV_vyrwilWb7IX7sKYrZUmO',
    name: 'Atún Lomitos Variedades 160 g'
  },
  {
    short_name: 'Atun Lomitos en agua',
    productId: 'DEV_vyrwilWb7IX7sKYrZUmO',
    name: 'Atún Lomitos Variedades 160 g'
  },
  {
    short_name: 'Pomarola Italiana 200gr',
    productId: 'DEV_FfTTfcHz0uEyWZfD158l',
    name: 'Salsa de Tomate Natural 200 Grs'
  },
  {
    short_name: 'Churu tuna & salmon',
    productId: 'DEV_QMLKG3uSnGCIud2KRKDh',
    name: 'Churu Tuna with Salmon Recipe'
  },
  {
    short_name: 'Coca Normal 1.5lt',
    productId: 'DEV_CNV_006',
    name: 'Coca-Cola Original 1.5lt'
  },
  {
    short_name: 'Sprite Zero 1.5lt',
    productId: 'DEV_CNV_053',
    name: 'Sprite Zero 1.5lt'
  },
  {
    short_name: 'Coca Zero 350ml',
    productId: 'DEV_CNV_008',
    name: 'Coca-Cola Zero 350ml'
  },
  {
    short_name: 'Coca Zero 1.5 lt',
    productId: 'DEV_CNV_007',
    name: 'Coca-Cola Zero 1.5 lt'
  },
  {
    short_name: 'Fanta zero 1.5lt',
    productId: 'DEV_CNV_013',
    name: 'Fanta 1.5lt'
  },
  {
    short_name: 'Protein+ pouch frutilla platano',
    productId: 'DEV_dptdUIpWKBvkn5bKoSTK',
    name: 'Protein Plus Pouch 150gr'
  },
  {
    short_name: 'Protein+ pouch vainilla',
    productId: 'DEV_dptdUIpWKBvkn5bKoSTK',
    name: 'Protein Plus Pouch 150gr'
  },
  {
    short_name: 'Protein+ pouch frutilla',
    productId: 'DEV_dptdUIpWKBvkn5bKoSTK',
    name: 'Protein Plus Pouch 150gr'
  },
  {
    short_name: 'Quesillo 320g',
    productId: 'DEV_CNV_043',
    name: 'Quesillo 320gr'
  },
  {
    short_name: 'Mantequilla con Sal 250gr',
    productId: 'DEV_CNV_027',
    name: 'Mantequilla con Sal 250gr'
  },
  {
    short_name: 'Rolls Crocante 150gr',
    productId: 'DEV_CNV_050',
    name: 'Chocolate Rolls Crocante 150gr'
  },
  {
    short_name: 'Crackelet tripack 255gr',
    productId: 'DEV_CNV_010',
    name: 'Crackelet tripack 255gr'
  },
  {
    short_name: 'Barra Low Carb',
    productId: 'DEV_YmNGqFEBgU6jfYPMJ4Nt',
    name: 'Barra Low Carb'
  },
  {
    short_name: 'Ramitas Queso 250gr',
    productId: 'DEV_CNV_046',
    name: 'Ramitas Queso 250gr'
  },
  {
    short_name: 'Gusanos Ácidos 90gr',
    productId: 'DEV_CNV_014',
    name: 'Gusanos Ácidos 90gr'
  },
  {
    short_name: 'Gusanos ácidos pequño',
    productId: 'DEV_ifWrUd86RukLVCYEPbgs',
    name: 'Gusanos Acidos 40 g'
  },
  {
    short_name: 'Pan Molde Multigrano',
    productId: 'DEV_CNV_038',
    name: 'Pan Molde Multigrano'
  },
  {
    short_name: 'Yerba Mate Orgánico Cranberry 355ml',
    productId: 'DEV_CNV_058',
    name: 'Yerba Mate Orgánico Cranberry 355ml'
  },
  {
    short_name: 'Mayonesa Regular Doypack 372gr.',
    productId: 'DEV_CNV_030',
    name: 'Mayonesa Regular Doypack 372gr.'
  },
  {
    short_name: 'Inca Kola 350ml',
    productId: 'DEV_CNV_020',
    name: 'Inca Kola 350ml'
  },
  {
    short_name: 'Ketchup Doypack 500 gr',
    productId: 'DEV_CNV_022',
    name: 'Ketchup Doypack 500 gr'
  },
  {
    short_name: 'Yogur Granola Mango/Frambuesa',
    productId: 'DEV_CNV_017',
    name: 'Granola Mango/Frambuesa'
  },
  {
    short_name: 'Kem Piña 350ml',
    productId: 'DEV_leRdydVvVSEBJnQRfViH',
    name: 'Kem Piña 350ml'
  },
  {
    short_name: 'Papas Fritas Original 130gr',
    productId: 'DEV_CNV_023',
    name: 'Papas Fritas Original 130gr'
  },
  {
    short_name: 'Papas Fritas Original 37gr',
    productId: 'DEV_CNV_024',
    name: 'Papas Fritas Original 37gr'
  },
  {
    short_name: 'Jamón Pierna 125gr',
    productId: 'DEV_CNV_021',
    name: 'Jamón Pierna Ahumado 125gr'
  },
  {
    short_name: 'Fruits & Nuts Bora bora',
    productId: 'DEV_CQuVvCtEUruFNaeaZlFM',
    name: 'Fruits & Nuts Variedades'
  },
  {
    short_name: 'Fruits & nuts Maui',
    productId: 'DEV_CQuVvCtEUruFNaeaZlFM',
    name: 'Fruits & Nuts Variedades'
  },
  {
    short_name: 'Mankeke (un)',
    productId: 'DEV_CNV_026',
    name: 'Mankeke un.'
  },
  {
    short_name: 'Maruchan Pollo 64g',
    productId: 'DEV_CNV_029',
    name: 'Maruchan Queso 64gr'
  },
  {
    short_name: 'Sachet p/perro sabor pollo',
    productId: 'DEV_TrPoTBF2zvMiGktfLJcx',
    name: 'Sachet snack Perro variedades'
  },
  {
    short_name: 'Sachet p/perro sabor carne',
    productId: 'DEV_TrPoTBF2zvMiGktfLJcx',
    name: 'Sachet snack Perro variedades'
  },
  {
    short_name: 'Galleta Tritón Vainilla 126gr',
    productId: 'DEV_CNV_057',
    name: 'Galleta Tritón Vainilla 126gr'
  },
  {
    short_name: 'Galletas Arroz Chocolate 20g',
    productId: 'DEV_CNV_016',
    name: 'Galletas Arroz Chocolate 20g'
  },
  {
    short_name: 'Monster Regular 473ml',
    productId: 'DEV_CNV_033',
    name: 'Monster Regular 473ml'
  },
  {
    short_name: 'Monster Sin Azúcar 473ml',
    productId: 'DEV_CNV_034',
    name: 'Monster Sin Azúcar 473ml'
  },
  {
    short_name: 'Harina Pan 1kg',
    productId: 'DEV_CNV_019',
    name: 'Harina Pan 1kg'
  },
  {
    short_name: 'Popcorn snack',
    productId: 'DEV_Ya2LY8LJHNUdDWFMKXez',
    name: 'Popcorn Oliva sal de mar 15gr'
  },
  {
    short_name: 'Ramitas de garbanzo queso',
    productId: 'DEV_FVBFzNdsHuAqJ9DVjw0X',
    name: 'Ramitas de Garbanzo Queso'
  },
  {
    short_name: 'Galleton Casero Arándano rojo',
    productId: 'DEV_s7AiFcoNhV30z7mxzJOK',
    name: 'Galleton Casero Variedades 40gr'
  },
  {
    short_name: 'Galletón Casero Chocolate',
    productId: 'DEV_s7AiFcoNhV30z7mxzJOK',
    name: 'Galleton Casero Variedades 40gr'
  },
  {
    short_name: 'Mini Chorizo',
    productId: 'DEV_ZbTKqOfhSkKSW26VwCoe',
    name: 'Mini Chorizo'
  },
  {
    short_name: 'Redbull 250ml',
    productId: 'DEV_CNV_048',
    name: 'Redbull 250ml'
  },
  {
    short_name: 'Redbull Light 250ml',
    productId: 'DEV_CNV_049',
    name: 'Redbull Light 250ml'
  },
  {
    short_name: 'Sémola Caramelo Soprole 140gr',
    productId: 'DEV_CNV_051',
    name: 'Sémola Caramelo Soprole 140gr'
  },
  {
    short_name: 'Queso Gauda Laminado 250gr',
    productId: 'DEV_gNfXKMwp6zNULBXQ5hy9',
    name: 'Queso Gauda Laminado 250gr'
  },
  {
    short_name: 'Leche Protein Chocolate 200ml',
    productId: 'DEV_CNV_052',
    name: 'Leche Protein Chocolate 200ml'
  },
  {
    short_name: 'Protein+ semillas zapallo nueces 150g',
    productId: 'DEV_CNV_059',
    name: 'Yogurt Protein con Frutos Secos 150gr'
  },
  {
    short_name: 'Agua con Gas 600ml',
    productId: 'DEV_CNV_001',
    name: 'Agua con Gas 600ml'
  },
  {
    short_name: 'Agua sin Gas 600ml',
    productId: 'DEV_CNV_002',
    name: 'Agua sin Gas 600ml'
  },
  {
    short_name: 'Compota durazno 90gr',
    productId: 'DEV_CNV_009',
    name: 'Compota Vivo Variedades 90gr'
  },
  {
    short_name: 'Compota Manzana 90gr',
    productId: 'DEV_CNV_009',
    name: 'Compota Vivo Variedades 90gr'
  },
  {
    short_name: 'Compota Pera 90gr',
    productId: 'DEV_CNV_009',
    name: 'Compota Vivo Variedades 90gr'
  },
  {
    short_name: 'Protein bar chocolate mani',
    productId: 'DEV_CNV_005',
    name: 'Barra Wild Protein Variedades 45gr'
  },
  {
    short_name: 'Protin bar chocolate coco',
    productId: 'DEV_CNV_005',
    name: 'Barra Wild Protein Variedades 45gr'
  },
  {
    short_name: 'Barra Wild Chocolate Maní 45gr',
    productId: 'DEV_CNV_005',
    name: 'Barra Wild Protein Variedades 45gr'
  },
  {
    short_name: 'Panini Carne y Pepinillos',
    productId: 'DEV_CNV_039',
    name: 'Panini Carne y Pepinillos'
  },
  {
    short_name: 'Panini Tomate Albahaca Mozarella',
    productId: 'DEV_CNV_040',
    name: 'Panini Deli Market Variedades'
  }
]

module.exports = {
  load: async (models) => {
    for (const provider of currentProviders) {
      await models.service_provider.create(provider)
    }
    console.log('service providers loaded!')
  },
  loadProducts: async (models) => {
    const productDBList = await models.product.findAll()
    // console.log((JSON.parse(JSON.stringify(productDBList))), 'productDBList')

    for (const product of currentReiteProducts) {
      const shortName = product.short_name.toLowerCase()
      const productDB = productDBList.find(p => p.short_name.toLowerCase() === shortName)

      if (productDB !== undefined) {
        const [serviceProviderProduct, created] = await models.service_provider_product.findOrCreate({
          where: {
            internal_id: product.productId
          },
          defaults: {
            train_status: 'completed',
            trained_product: true,
            stock: 0,
            product_id: productDB.id,
            service_provider_id: 1
          }
        })
        if (!created) {
          await serviceProviderProduct.update({
            train_status: 'repeated'
          })
        }
      }
    }

    console.log('products loaded!')
  },
  currentReiteProducts

}
