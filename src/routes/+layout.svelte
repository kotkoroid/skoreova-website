<script lang="ts">
import "../app.css";
import { browser } from "$app/environment";
import { page } from "$app/state";
import { isMobileMenuOpen } from "$lib/stores.js";

const { children } = $props();
let mouseX = $state(0);
let mouseY = $state(0);
let targetX = $state(0);
let targetY = $state(0);

$effect(() => {
	if (browser) {
		document.documentElement.classList.add("dark");
	}
});

const isHomepage = $derived(page.url.pathname === "/");

function toggleMobileMenu() {
	isMobileMenuOpen.update((open) => !open);
}

function handleMouseMove(event: MouseEvent) {
	targetX = event.clientX;
	targetY = event.clientY + window.scrollY;
}

// Smooth animation loop
function animate() {
	mouseX += (targetX - mouseX) * 0.1;
	mouseY += (targetY - mouseY) * 0.1;
	requestAnimationFrame(animate);
}

// Start animation on mount
if (typeof window !== "undefined") {
	animate();
}
</script>

{#if isHomepage}
  <!-- Homepage Layout: Overlay Header + Full Width Content + Footer -->
  <div class="relative">
    <!-- Header - Fixed positioned to overlay content -->
    <header class="fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-50 transition-all duration-300 ease-in-out" style="background: transparent;">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-3">
            <!-- Logo placeholder -->
            <a href="/" class="flex items-center" style="cursor: pointer !important;">
              <img src="/Logo.png" alt="Skóreová logo" class="w-15 h-15" style="cursor: pointer !important;" />
            </a>
            <!-- Header text as link -->
            <a href="/" class="fontik text-3xl min-[480px]:text-3xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl tracking-wider font-semibold text-white hover:text-blue-400 transition-colors uppercase" style="cursor: pointer !important;">
              Skóreová
            </a>
          </div>

          <!-- Social Icons - Desktop Only (1024px+) -->
          <div class="hidden lg:flex items-center space-x-4">
            <a href="https://x.com/Skoreova" class="text-white/90 hover:text-blue-400 p-2" aria-label="X (Twitter)">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://threads.com/@skoreova" class="text-white/90 hover:text-blue-400 p-2" aria-label="Threads">
              <img src="/Threads.svg" alt="Threads" class="h-5 w-5 filter brightness-0 invert" />
            </a>
          </div>

          <!-- Mobile & Tablet menu button (up to 1024px) -->
          <div class="lg:hidden ml-4">
            <button
              onclick={toggleMobileMenu}
              class="text-white/90 hover:text-white focus:outline-none focus:text-white p-2 relative"
              aria-label="Toggle menu"
            >
              <img src={$isMobileMenuOpen ? "/Close.svg" : "/Menu.svg"} alt={$isMobileMenuOpen ? "Close menu" : "Open menu"} class="w-12 h-12 transition-all duration-300 ease-in-out" style="transform: rotate({$isMobileMenuOpen ? '90deg' : '0deg'});" />
            </button>
          </div>
        </div>

        <!-- Mobile & Tablet Navigation Menu - Extended within header -->
        <div class="lg:hidden transition-all duration-300 ease-in-out backdrop-blur-md {$isMobileMenuOpen ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}" style="background: transparent;">
          <nav class="px-0 pt-2 pb-4 space-y-1">
            <!-- Social Links -->
            <div class="flex items-center justify-center space-x-6 py-2">
              <a href="https://x.com" class="text-white/90 hover:text-blue-400 p-2 transition-colors duration-200" aria-label="X (Twitter)">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://threads.net" class="text-white/90 hover:text-blue-400 p-2 transition-colors duration-200" aria-label="Threads">
                <img src="/Threads.svg" alt="Threads" class="h-6 w-6 filter brightness-0 invert" />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Full Width Homepage Content -->
    <main class="w-full">
      {@render children()}
    </main>
  </div>

  <!-- Footer -->
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
    <div class="max-w-6xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p>&copy; 2025 Falkara</p>
      <p>Privacy Policy | Terms of Use | Contact</p>
    </div>
  </footer>

{:else}
  <!-- Other Pages Layout: Animated Background + A4 Container + Sidebar -->
  <div
    class="min-h-screen relative transition-all duration-1000 ease-out"
    onmousemove={handleMouseMove}
    role="application"
    style="background:
      radial-gradient(800px circle at {mouseX}px {mouseY}px, rgba(59, 130, 246, 0.4), transparent 70%),
      radial-gradient(600px circle at {mouseX + 200}px {mouseY + 100}px, rgba(147, 51, 234, 0.3), transparent 70%),
      radial-gradient(1000px circle at {mouseX - 150}px {mouseY - 100}px, rgba(16, 185, 129, 0.2), transparent 70%),
      linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #000000 100%)"
  >
    <div class="min-h-screen relative z-10">
      <!-- Header -->
      <header class="backdrop-blur-md shadow-sm sticky top-0 z-50" style="background-color: rgba(17, 24, 39, 0.8);">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-center h-20">
            <div class="flex items-center space-x-3">
              <!-- Logo placeholder -->
              <a href="/" class="flex items-center">
                <img src="/Logo.png" alt="Skóreová logo" class="w-12 h-12 min-[480px]:w-14 min-[480px]:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24" />
              </a>
              <!-- Header text as link -->
              <a href="/" class="text-lg min-[480px]:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white hover:text-blue-400 transition-colors uppercase hidden min-[320px]:block">
                Skóreová
              </a>
            </div>

            <!-- Desktop Navigation (1024px+) -->
            <nav class="hidden lg:flex space-x-6 xl:space-x-10">
              <a href="/hub" class="text-white/90 hover:text-blue-400 px-4 lg:px-5 xl:px-6 py-3 lg:py-4 text-base lg:text-lg xl:text-xl font-medium uppercase">Hub</a>
              <a href="/contact" class="text-white/90 hover:text-blue-400 px-4 lg:px-5 xl:px-6 py-3 lg:py-4 text-base lg:text-lg xl:text-xl font-medium uppercase">Kontakt</a>
            </nav>

            <!-- Social Icons - Desktop Only (1024px+) -->
            <div class="hidden lg:flex items-center space-x-3 xl:space-x-5">
              <a href="https://x.com" class="text-white/90 hover:text-blue-400 p-3 lg:p-4 xl:p-5" aria-label="X (Twitter)">
                <svg class="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://threads.net" class="text-white/90 hover:text-blue-400 p-3 lg:p-4 xl:p-5" aria-label="Threads">
                <img src="/Threads.svg" alt="Threads" class="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8 filter brightness-0 invert" />
              </a>
            </div>

            <!-- Mobile & Tablet menu button (up to 1024px) -->
            <div class="lg:hidden ml-4">
              <button
                onclick={toggleMobileMenu}
                class="text-white/90 hover:text-white focus:outline-none focus:text-white p-2 relative"
                aria-label="Toggle menu"
              >
                <img src={$isMobileMenuOpen ? "/Close.svg" : "/Menu.svg"} alt={$isMobileMenuOpen ? "Close menu" : "Open menu"} class="w-12 h-12 min-[480px]:w-14 min-[480px]:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 transition-all duration-300 ease-in-out" style="transform: rotate({$isMobileMenuOpen ? '90deg' : '0deg'});" />
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile & Tablet Navigation Menu -->
        <div class="lg:hidden absolute top-20 left-0 right-0 z-40 transition-all duration-300 ease-in-out backdrop-blur-md shadow-sm {$isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}" style="background-color: rgba(17, 24, 39, 0.8);">
          <nav class="px-4 pt-2 pb-4 space-y-1">
            <a href="/hub" class="block px-3 py-2 text-white/90 hover:text-blue-400 rounded-md text-sm font-medium transition-colors duration-200 uppercase">Hub</a>
            <a href="/contact" class="block px-3 py-2 text-white/90 hover:text-blue-400 rounded-md text-sm font-medium transition-colors duration-200 uppercase">Kontakt</a>

            <!-- Social Links Separator -->
            <div class="border-t border-white/20 my-3"></div>

            <!-- Social Links -->
            <div class="flex items-center justify-center space-x-6 py-2">
              <a href="https://x.com" class="text-white/90 hover:text-blue-400 p-2 transition-colors duration-200" aria-label="X (Twitter)">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://threads.net" class="text-white/90 hover:text-blue-400 p-2 transition-colors duration-200" aria-label="Threads">
                <img src="/ThreadsLogo.svg" alt="Threads" class="h-6 w-6 filter brightness-0 invert" />
              </a>
            </div>
          </nav>
        </div>
      </header>

      <!-- Main container -->
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- Main content - A4 paper style -->
          <main class="lg:col-span-3 order-1 lg:order-1">
            <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg mx-auto" style="width: 210mm; min-height: 297mm; max-width: 100%;">
              <div class="p-8 lg:p-12">
                {@render children()}
              </div>
            </div>
          </main>

          <!-- Sidebar on the right -->
          <aside class="lg:col-span-1 order-2 lg:order-2 sticky top-24 self-start">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 class="font-semibold mb-4 text-gray-900 dark:text-white">Sidebar</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Add your sidebar content here</p>
            </div>
          </aside>
        </div>
      </div>

      <!-- Footer at bottom of screen -->
      <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div class="max-w-6xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>&copy; 2025 Skóreová. All rights reserved.</p>
        </div>
      </footer>
    </div>
  </div>
{/if}

<style>
    .fontik {
        font-family: 'SpaceMonoBold';
    }
</style>
