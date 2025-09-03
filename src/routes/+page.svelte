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
let isPaused = false;
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
  isPaused = false;

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

function pauseAutoRotate() {
  if (autoRotateTimer) {
    clearInterval(autoRotateTimer);
    autoRotateTimer = null;
  }
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  isPaused = true;
  // Don't reset progress - keep current value
}

function resumeAutoRotate() {
  if (autoRotateTimer) clearInterval(autoRotateTimer);
  if (progressTimer) clearInterval(progressTimer);

  isPaused = false;

  // Resume progress bar animation from current progress
  progressTimer = setInterval(() => {
    progress += (100 / (ROTATE_INTERVAL / PROGRESS_UPDATE_INTERVAL));
    if (progress >= 100) {
      progress = 0;
      currentArticle = (currentArticle + 1) % articles.length;
    }
  }, PROGRESS_UPDATE_INTERVAL);
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
    currentArticle = index;
  }
}

function goToArticleWithTimer(index) {
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
<section class="w-full relative h-[600px] overflow-hidden bg-black">
  <!-- Full Background Images -->
  {#each articles as article, index (article.title)}
    <div
      class="absolute inset-0 transition-opacity duration-700 ease-in-out {index === currentArticle ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
      style="transition-delay: {index === currentArticle ? '0ms' : '100ms'}"
    >
      <img
        src={article.image}
        alt={article.alt}
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      <!-- Gradual blur overlay from right side - only on desktop when sidebar is visible -->
      <div class="hidden md:block absolute top-0 right-0 bottom-0 w-96 backdrop-blur-[2px] bg-transparent" 
           style="mask: linear-gradient(to left, black 0%, black 85%, transparent 100%); -webkit-mask: linear-gradient(to left, black 0%, black 85%, transparent 100%);"></div>
    </div>
  {/each}
  
  <!-- Progress Bar - Mobile Only, at bottom of image -->
  {#if isMobile}
    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-30">
      <div
        class="h-full bg-white transition-all duration-75 ease-linear"
        style="width: {progress}%"
      ></div>
    </div>
  {/if}

  <!-- Content Container -->
  <div class="relative z-20 p-6 pt-20">
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
              class="group relative overflow-hidden rounded-lg cursor-pointer border-2 {currentArticle === index ? 'border-transparent' : 'border-white/30'} transform transition-transform duration-300 ease-out hover:scale-105"
              onmouseenter={() => {
                if (index !== currentArticle) {
                  // Switching to different article - reset timer but pause immediately
                  stopAutoRotate();
                  currentArticle = index;
                } else {
                  // Hovering over current article - always pause (even if re-hovering)
                  pauseAutoRotate();
                }
              }}
              onmouseleave={() => {
                if (isPaused) {
                  // Resume from where we left off
                  resumeAutoRotate();
                } else {
                  // Start fresh (for article switches)
                  startAutoRotate();
                }
              }}
            >
              <!-- Full-width Article Image -->
              <div class="relative h-28">
                <img
                  src={article.image}
                  alt={article.alt}
                  class="w-full h-full object-cover"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <!-- Article Title Overlay -->
                <div class="absolute bottom-0 left-0 right-0 p-2">
                  <h3 class="text-sm font-semibold text-white leading-tight overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    {article.title}
                  </h3>
                </div>
              </div>
              
              <!-- Progressive border color transformation for active article -->
              {#if currentArticle === index}
                <!-- Left border -->
                <div class="absolute left-0 w-0.5 rounded-full transition-all duration-75 ease-linear" 
                     style="height: 100%; bottom: 0; background: linear-gradient(to top, white {progress <= 50 ? (progress / 50) * 100 : 100}%, rgba(255,255,255,0.3) {progress <= 50 ? (progress / 50) * 100 : 100}%);"></div>
                     
                <!-- Top border -->
                <div class="absolute top-0 h-0.5 rounded-full transition-all duration-75 ease-linear" 
                     style="width: 100%; left: 0; background: linear-gradient(to right, {progress > 50 ? 'white' : 'rgba(255,255,255,0.3)'} 0%, white {progress > 50 ? ((progress - 50) / 50) * 100 : 0}%, rgba(255,255,255,0.3) {progress > 50 ? ((progress - 50) / 50) * 100 : 0}%);"></div>
                     
                <!-- Bottom border -->
                <div class="absolute bottom-0 h-0.5 rounded-full transition-all duration-75 ease-linear" 
                     style="width: 100%; left: 0; background: linear-gradient(to right, white {progress <= 50 ? (progress / 50) * 100 : 100}%, rgba(255,255,255,0.3) {progress <= 50 ? (progress / 50) * 100 : 100}%);"></div>
                     
                <!-- Right border -->
                <div class="absolute right-0 w-0.5 rounded-full transition-all duration-75 ease-linear" 
                     style="height: 100%; bottom: 0; background: linear-gradient(to top, {progress > 50 ? 'white' : 'rgba(255,255,255,0.3)'} 0%, white {progress > 50 ? ((progress - 50) / 50) * 100 : 0}%, rgba(255,255,255,0.3) {progress > 50 ? ((progress - 50) / 50) * 100 : 0}%);"></div>
              {/if}
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


