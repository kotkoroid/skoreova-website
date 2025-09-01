<!-- Hero Section with Full Width -->
<section class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
  <!-- Background pattern -->
  <div class="absolute inset-0 opacity-10">
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
  
  <div class="relative z-10 text-center px-6 max-w-6xl mx-auto">
    <h1 class="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
      Skóreová
    </h1>
    <p class="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
      Váš domov pro nejnovější zprávy ze světa ženského fotbalu
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#articles" class="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl">
        Nejnovější články
        <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </a>
      <a href="/about" class="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-medium rounded-xl transition-all">
        Poznat hráčky
        <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<!-- Featured Articles Section -->
<section id="articles" class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-bold text-gray-900 mb-4">Hlavní články</h2>
      <p class="text-xl text-gray-600">Sledujte nejnovější zprávy a analýzy</p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Featured Article -->
      <article class="lg:col-span-2 group cursor-pointer">
        <div class="relative overflow-hidden rounded-2xl shadow-xl">
          <img src="https://via.placeholder.com/800x500/1e293b/ffffff?text=Featured+Article" alt="Featured Article" class="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div class="absolute bottom-0 p-8 text-white">
            <span class="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">Hlavní zpráva</span>
            <h3 class="text-3xl font-bold mb-3 group-hover:text-blue-400 transition-colors">Historický úspěch v Lize mistrů</h3>
            <p class="text-gray-200 text-lg mb-4">Naše hráčky dosáhly neuvěřitelného milníku v evropské soutěži...</p>
            <div class="flex items-center text-sm text-gray-300">
              <time datetime="2025-08-30">30. srpna 2025</time>
              <span class="mx-2">•</span>
              <span>10 min čtení</span>
            </div>
          </div>
        </div>
      </article>

      <!-- Side Articles -->
      <div class="space-y-8">
        <article class="group cursor-pointer">
          <div class="relative overflow-hidden rounded-xl">
            <img src="https://via.placeholder.com/400x250/4f46e5/ffffff?text=Article+2" alt="Article 2" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div class="absolute bottom-0 p-6 text-white">
              <h3 class="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Nová trenérka přebírá tým</h3>
              <div class="text-sm text-gray-300">
                <time datetime="2025-08-28">28. srpna 2025</time>
              </div>
            </div>
          </div>
        </article>

        <article class="group cursor-pointer">
          <div class="relative overflow-hidden rounded-xl">
            <img src="https://via.placeholder.com/400x250/059669/ffffff?text=Article+3" alt="Article 3" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div class="absolute bottom-0 p-6 text-white">
              <h3 class="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Příprava na novou sezónu</h3>
              <div class="text-sm text-gray-300">
                <time datetime="2025-08-26">26. srpna 2025</time>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="text-center mt-12">
      <a href="/" class="inline-flex items-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-lg">
        Všechny články
        <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<!-- Players Teaser Section -->
<section class="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
  <!-- Background effects -->
  <div class="absolute inset-0 opacity-20">
    <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
  </div>
  
  <div class="relative z-10 max-w-7xl mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-bold mb-6">Poznejte naše hvězdy</h2>
      <p class="text-xl text-blue-100 max-w-3xl mx-auto">
        Objevte příběhy talentovaných fotbalistek, jejich úspěchy a cesty k vrcholu
      </p>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
      <div class="text-center group">
        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/30 transition-all">
          <div class="text-4xl font-bold mb-2">45</div>
          <div class="text-blue-100">Aktivních hráček</div>
        </div>
      </div>
      <div class="text-center group">
        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/30 transition-all">
          <div class="text-4xl font-bold mb-2">12</div>
          <div class="text-blue-100">Národností</div>
        </div>
      </div>
      <div class="text-center group">
        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/30 transition-all">
          <div class="text-4xl font-bold mb-2">8</div>
          <div class="text-blue-100">Reprezentantek</div>
        </div>
      </div>
      <div class="text-center group">
        <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/30 transition-all">
          <div class="text-4xl font-bold mb-2">156</div>
          <div class="text-blue-100">Gólů celkem</div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <a href="/about" class="inline-flex items-center px-10 py-5 bg-white text-gray-900 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all hover:scale-105">
        Prohlédnout všechny hráčky
        <svg class="ml-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<!-- Newsletter Section -->
<section class="py-20 bg-gray-50">
  <div class="max-w-4xl mx-auto text-center px-6">
    <h2 class="text-4xl font-bold text-gray-900 mb-6">Zůstaňte v obraze</h2>
    <p class="text-xl text-gray-600 mb-8">Přihlaste se k odběru novinek a nezmeškejte žádné důležité zprávy</p>
    
    <div class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
      <input 
        type="email" 
        placeholder="Váš e-mail" 
        class="flex-1 px-6 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
      >
      <button class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
        Přihlásit se
      </button>
    </div>
    
    <p class="text-sm text-gray-500 mt-4">Žádný spam, jen kvalitní obsah o ženském fotbalu</p>
  </div>
</section>
