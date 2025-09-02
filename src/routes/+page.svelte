<script>
import { onMount, onDestroy } from 'svelte';
import { crossfade, fly } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';
import { isMobileMenuOpen } from '$lib/stores.js';

let currentArticle = 0;
let autoRotateTimer = null;
let progressTimer = null;
let progress = 0;
let isMobile = false;
let isTransitioning = false;
let swipeDirection = 0;
const ROTATE_INTERVAL = 5000;
const PROGRESS_UPDATE_INTERVAL = 10;

const [send, receive] = crossfade({
  duration: 500,
  easing: cubicOut
});

const articles = [
  {
    image: "/src/lib/Image_1.jpg",
    alt: "Nejnovější články",
    title: "DOHRÁNO TŘETÍ KOLO DRUHÉ LIGY",
    description: "Raptorky se společně s Hradcem Králové ujímají špice ligové tabulky.",
    hoverColor: "text-blue-300"
  },
  {
    image: "/src/lib/Image_2.jpg",
    alt: "Profily hráček",
    title: "ČESKÉ TÝMY LETOS BEZ UWCL",
    description: "Oba české týmy narazily na přemožitele ve finále druhého předkola.",
    hoverColor: "text-purple-300"
  },
  {
    image: "/src/lib/Image_3.jpg",
    alt: "Zápasové reporty",
    title: "PŘEDEHRÁVKA SEDMÉHO KOLA",
    description: "Slovácko nadělovalo. FC Praha opět bez vstřelené branky.",
    hoverColor: "text-green-300"
  }
];

function startAutoRotate() {
  if (autoRotateTimer) clearInterval(autoRotateTimer);
  if (progressTimer) clearInterval(progressTimer);

  progress = 0;

  // Progress bar animation
  progressTimer = setInterval(() => {
    progress += (100 / (ROTATE_INTERVAL / PROGRESS_UPDATE_INTERVAL));
    if (progress >= 100) {
      progress = 0;
      currentArticle = (currentArticle + 1) % articles.length;
    }
  }, PROGRESS_UPDATE_INTERVAL);
}

function stopAutoRotate() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer);
    autoRotateTimer = null;
  }
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progress = 0;
}

function goToPrevious() {
  if (isTransitioning) return;
  isTransitioning = true;
  swipeDirection = -1;
  stopAutoRotate();
  setTimeout(() => {
    currentArticle = (currentArticle - 1 + articles.length) % articles.length;
    swipeDirection = 0;
    isTransitioning = false;
    startAutoRotate();
  }, 150);
}

function goToNext() {
  if (isTransitioning) return;
  isTransitioning = true;
  swipeDirection = 1;
  stopAutoRotate();
  setTimeout(() => {
    currentArticle = (currentArticle + 1) % articles.length;
    swipeDirection = 0;
    isTransitioning = false;
    startAutoRotate();
  }, 150);
}

function goToArticle(index) {
  if (index !== currentArticle && !isTransitioning) {
    isTransitioning = true;
    stopAutoRotate();
    setTimeout(() => {
      currentArticle = index;
      isTransitioning = false;
      startAutoRotate();
    }, 150);
  }
}

onMount(() => {
  startAutoRotate();
  // Check if mobile
  const checkMobile = () => {
    isMobile = window.innerWidth < 768;
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  return () => {
    window.removeEventListener('resize', checkMobile);
  };
});

onDestroy(() => {
  stopAutoRotate();
});
</script>

<!-- Featured Articles Section -->
<section class="w-full relative h-[600px] overflow-hidden">
  <!-- Full Background Image -->
  {#each articles as article, index (article.title)}
    {#if index === currentArticle}
      <div
        in:fly|global={{ 
          x: isMobile ? (swipeDirection === 1 ? 300 : swipeDirection === -1 ? -300 : 0) : 0, 
          duration: 300, 
          easing: cubicOut 
        }}
        out:fly|global={{ 
          x: isMobile ? (swipeDirection === 1 ? -300 : swipeDirection === -1 ? 300 : 0) : 0, 
          duration: 300, 
          easing: cubicOut 
        }}
        class="absolute inset-0"
      >
        <img
          src={article.image}
          alt={article.alt}
          class="w-full h-full object-cover transition-transform duration-700 {isTransitioning && !isMobile ? 'scale-105' : ''}"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        
        <!-- Progress Bar - Mobile Only, at bottom of image -->
        {#if isMobile}
          <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
            <div
              class="h-full bg-white transition-all duration-75 ease-linear"
              style="width: {progress}%"
            ></div>
          </div>
        {/if}
      </div>
    {/if}
  {/each}

  <!-- Content Container -->
  <div class="relative z-10 p-6 pt-20">
    <div class="flex flex-col md:flex-row gap-6 h-full min-h-[480px]">
      <!-- Main Article Content Area -->
      <div class="flex-1 flex flex-col justify-end">
        <div class="max-w-3xl">
          <div class="mb-2">
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white group-hover:{articles[currentArticle].hoverColor} transition-colors uppercase tracking-wide">
              {articles[currentArticle].title}
            </h2>
          </div>
          <div>
            <p class="text-white/90 text-base md:text-lg">
              {articles[currentArticle].description}
            </p>
          </div>
        </div>
      </div>

      <!-- Sidebar with All Article Previews -->
      <div class="w-full md:w-80 relative">
        
        <!-- Desktop: Show all articles - Always visible on desktop -->
        <div class="hidden md:flex flex-col gap-3 mt-12">
          {#each articles as article, index}
            <div
              class="group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 border-2 border-white/30 {currentArticle === index ? 'border-white' : 'hover:shadow-xl hover:border-white/50'}"
              onmouseenter={() => goToArticle(index)}
            >
              <!-- Full-width Article Image -->
              <div class="relative h-28">
                <img
                  src={article.image}
                  alt={article.alt}
                  class="w-full h-full object-cover transition-transform duration-300 {currentArticle === index ? 'scale-105' : 'group-hover:scale-105'}"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <!-- Article Title Overlay -->
                <div class="absolute bottom-0 left-0 right-0 p-2">
                  <h3 class="text-sm font-semibold text-white leading-tight overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    {article.title}
                  </h3>
                </div>
                
                <!-- Progress Bar for Desktop - Only on current article -->
                {#if currentArticle === index}
                  <div class="absolute bottom-0 left-0 w-full h-0.5 bg-white/20">
                    <div
                      class="h-full bg-white transition-all duration-75 ease-linear"
                      style="width: {progress}%"
                    ></div>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <!-- View All Articles Button - Desktop Only -->
        <div class="hidden md:flex justify-center mt-4">
          <a
            href="/articles"
            class="flex items-center justify-center h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 backdrop-blur-sm"
          >
Všechny články
          </a>
        </div>
      </div>
    </div>
  </div>
  

</section>

<!-- Mobile Navigation Controls - Outside and under the image -->
<div class="md:hidden py-10 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-gray-950 dark:via-slate-900 dark:to-black transition-all duration-300 ease-in-out">
  <div class="max-w-4xl mx-auto px-6 transform transition-transform duration-300 ease-in-out">
      <div class="flex justify-between items-center">
        <a
          href="/articles"
          class="text-white hover:text-gray-200 font-medium transition-colors duration-300 uppercase"
        >
          VŠECHNY ČLÁNKY
        </a>
        <div class="flex gap-6 items-center">
          <button 
            onclick={goToPrevious}
            class="text-white hover:text-gray-200 font-medium transition-colors duration-300 uppercase {isTransitioning ? 'opacity-50' : ''}"
            aria-label="PŘEDCHOZÍ"
            disabled={isTransitioning}
            title="PŘEDCHOZÍ"
          >
            ← PŘEDCHOZÍ
          </button>
          <button 
            onclick={goToNext}
            class="text-white hover:text-gray-200 font-medium transition-colors duration-300 uppercase {isTransitioning ? 'opacity-50' : ''}"
            aria-label="DALŠÍ"
            disabled={isTransitioning}
            title="DALŠÍ"
          >
            DALŠÍ →
          </button>
        </div>
      </div>
    </div>
  </div>

<!-- Player Search Section -->
<section class="relative py-10 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-gray-950 dark:via-slate-900 dark:to-black text-white">
  <div class="max-w-4xl mx-auto text-center px-6">
    <h2 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
      Hledáte konkrétní hráčku?
    </h2>

    <div class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
      <div class="flex-1">
        <input
          type="text"
          placeholder="Zadejte jméno..."
          class="w-full px-6 py-4 text-lg border-2 border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300 focus:border-blue-400 dark:focus:border-blue-300 transition-all text-white placeholder-white/60 dark:placeholder-white/40"
          onfocus={(e) => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        >
      </div>
      <button class="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
        <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        Hledat
      </button>
    </div>

    <div>
      <a
        href="/about"
        class="inline-flex items-center px-8 py-4 bg-white/20 dark:bg-white/10 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20 dark:border-white/10"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
        Procházet databázi hráček
      </a>
    </div>
  </div>
</section>


<!-- Quick Stats Section -->
<section class="py-16 bg-white dark:bg-gray-900">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div class="text-center">
        <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">156</div>
        <div class="text-gray-600 dark:text-gray-400">Gólů celkem</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">24</div>
        <div class="text-gray-600 dark:text-gray-400">Vítězství</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">8</div>
        <div class="text-gray-600 dark:text-gray-400">Reprezentantek</div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">12</div>
        <div class="text-gray-600 dark:text-gray-400">Národností</div>
      </div>
    </div>
  </div>
</section>

<!-- Players Teaser Section -->
<section class="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 text-white relative overflow-hidden">
  <!-- Background effects -->
  <div class="absolute inset-0 opacity-20 dark:opacity-10">
    <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-white dark:bg-gray-200 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-400 rounded-full blur-3xl"></div>
  </div>

  <div class="relative z-10 max-w-7xl mx-auto px-6">
    <div class="text-center mb-16">
      <h2 class="text-5xl font-bold mb-6">Poznejte naše hvězdy</h2>
      <p class="text-xl text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
        Objevte příběhy talentovaných fotbalistek, jejich úspěchy a cesty k vrcholu
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
      <div class="text-center group">
        <div class="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-all">
          <div class="text-4xl font-bold mb-2">45</div>
          <div class="text-blue-100 dark:text-blue-200">Aktivních hráček</div>
        </div>
      </div>
      <div class="text-center group">
        <div class="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-all">
          <div class="text-4xl font-bold mb-2">12</div>
          <div class="text-blue-100 dark:text-blue-200">Národností</div>
        </div>
      </div>
      <div class="text-center group">
        <div class="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-all">
          <div class="text-4xl font-bold mb-2">8</div>
          <div class="text-blue-100 dark:text-blue-200">Reprezentantek</div>
        </div>
      </div>
      <div class="text-center group">
        <div class="bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-all">
          <div class="text-4xl font-bold mb-2">156</div>
          <div class="text-blue-100 dark:text-blue-200">Gólů celkem</div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <a href="/about" class="inline-flex items-center px-10 py-5 bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-800 font-bold text-lg rounded-2xl hover:shadow-2xl transition-all hover:scale-105">
        Prohlédnout všechny hráčky
        <svg class="ml-3 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<!-- Newsletter Section -->
<section class="py-20 bg-gray-50 dark:bg-gray-800">
  <div class="max-w-4xl mx-auto text-center px-6">
    <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">Zůstaňte v obraze</h2>
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">Přihlaste se k odběru novinek a nezmeškejte žádné důležité zprávy</p>

    <div class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
      <input
        type="email"
        placeholder="Váš e-mail"
        class="flex-1 px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      >
      <button class="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition-colors">
        Přihlásit se
      </button>
    </div>

    <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">Žádný spam, jen kvalitní obsah o ženském fotbalu</p>
  </div>
</section>
