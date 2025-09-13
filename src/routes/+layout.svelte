<script lang="ts">
import "../app.css";
import { browser } from "$app/environment";
import { page } from "$app/state";
import { isMobileMenuOpen } from "$lib/stores.js";
import IconX from "$lib/components/IconX.svelte";
import IconThreads from "$lib/components/IconThreads.svelte";
import IconInstagram from "$lib/components/IconInstagram.svelte";
import IconTikTok from "$lib/components/IconTikTok.svelte";
import IconFacebook from "$lib/components/IconFacebook.svelte";

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
  <!-- Homepage Layout: Single Scroll Context with Fixed Header -->
    <!-- Header - Fixed positioned to overlay content -->
    <header class="fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-50 transition-all duration-300 ease-in-out" style="background: transparent;">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center space-x-3 brand-group">
            <!-- Logo placeholder -->
            <a href="/" class="flex items-center" style="cursor: pointer !important;">
              <img src="/Logo.svg" alt="Skóreová logo" class="w-14 h-14 bg-white rounded-full p-0 logo-circle" style="cursor: pointer !important;" />
            </a>
            <!-- Header text as link -->
            <a href="/" class="fontik text-3xl min-[480px]:text-3xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl tracking-wider font-semibold transition-all duration-500 uppercase gradient-text" style="cursor: pointer !important;">
              Skóreová
            </a>
          </div>

          <!-- Social Icons - Desktop Only (1024px+) -->
          <div class="hidden lg:flex items-center space-x-4">
            <a href="https://x.com/Skoreova" class="gradient-icon p-2" aria-label="X">
              <IconX class="h-5 w-5" />
            </a>
            <a href="https://tiktok.com/@skoreova" class="gradient-icon p-2" aria-label="TikTok">
              <IconTikTok class="h-5 w-5" />
            </a>
            <a href="https://instagram.com/skoreova" class="gradient-icon p-2" aria-label="Instagram">
              <IconInstagram class="h-5 w-5" />
            </a>
            <a href="https://threads.com/@skoreova" class="gradient-icon p-2" aria-label="Threads">
              <IconThreads class="h-5 w-5" />
            </a>
            <a href="https://facebook.com/skoreova" class="gradient-icon p-2" aria-label="Facebook">
              <IconFacebook class="h-5 w-5" />
            </a>
          </div>

          <!-- Mobile & Tablet menu button (up to 1024px) -->
          <div class="lg:hidden ml-4">
            <button
              onclick={toggleMobileMenu}
              class="gradient-icon-button p-2 relative"
              aria-label="Toggle menu"
            >
              <img src={$isMobileMenuOpen ? "/Close.svg" : "/Menu.svg"} alt={$isMobileMenuOpen ? "Close menu" : "Open menu"} class="hamburger-icon w-12 h-12 transition-all duration-300 ease-in-out" style="transform: rotate({$isMobileMenuOpen ? '90deg' : '0deg'});" />
              <img src={$isMobileMenuOpen ? "/Close.svg" : "/Menu.svg"} alt={$isMobileMenuOpen ? "Close menu" : "Open menu"} class="hamburger-icon-gradient w-12 h-12 absolute top-2 left-2 transition-all duration-300 ease-in-out" style="transform: rotate({$isMobileMenuOpen ? '90deg' : '0deg'});" />
            </button>
          </div>
        </div>

        <!-- Mobile & Tablet Navigation Menu - Extended within header -->
        <div class="lg:hidden transition-all duration-300 ease-in-out backdrop-blur-md {$isMobileMenuOpen ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'}" style="background: transparent;">
          <nav class="px-0 pt-2 pb-4 space-y-1">
            <!-- Social Links -->
            <div class="flex items-center justify-center space-x-6 py-2">
              <a href="https://x.com/Skoreova" class="gradient-icon p-2" aria-label="X">
                <IconX class="h-6 w-6" />
              </a>
              <a href="https://tiktok.com/@skoreova" class="gradient-icon p-2" aria-label="TikTok">
                <IconTikTok class="h-6 w-6" />
              </a>
              <a href="https://instagram.com/skoreova" class="gradient-icon p-2" aria-label="Instagram">
                <IconInstagram class="h-6 w-6" />
              </a>
              <a href="https://threads.com/@skoreova" class="gradient-icon p-2" aria-label="Threads">
                <IconThreads class="h-6 w-6" />
              </a>
              <a href="https://facebook.com/skoreova" class="gradient-icon p-2" aria-label="Facebook">
                <IconFacebook class="h-6 w-6" />
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

  <!-- Footer -->
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6">
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
            <div class="flex items-center space-x-3 brand-group">
              <!-- Logo placeholder -->
              <a href="/" class="flex items-center">
                <img src="/Logo.svg" alt="Skóreová logo" class="w-12 h-12 min-[480px]:w-14 min-[480px]:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-white rounded-full p-0 logo-circle" />
              </a>
              <!-- Header text as link -->
              <a href="/" class="text-lg min-[480px]:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold transition-all duration-500 uppercase hidden min-[320px]:block gradient-text">
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
              <a href="https://x.com/Skoreova" class="gradient-icon p-3 lg:p-4 xl:p-5" aria-label="X">
                <IconX class="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
              </a>
              <a href="https://tiktok.com/@skoreova" class="gradient-icon p-3 lg:p-4 xl:p-5" aria-label="TikTok">
                <IconTikTok class="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
              </a>
              <a href="https://instagram.com/skoreova" class="gradient-icon p-3 lg:p-4 xl:p-5" aria-label="Instagram">
                <IconInstagram class="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
              </a>
              <a href="https://threads.com/@skoreova" class="gradient-icon p-3 lg:p-4 xl:p-5" aria-label="Threads">
                <IconThreads class="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
              </a>
              <a href="https://facebook.com/skoreova" class="gradient-icon p-3 lg:p-4 xl:p-5" aria-label="Facebook">
                <IconFacebook class="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
              </a>
            </div>

            <!-- Mobile & Tablet menu button (up to 1024px) -->
            <div class="lg:hidden ml-4">
              <button
                onclick={toggleMobileMenu}
                class="gradient-icon-button p-2 relative"
                aria-label="Toggle menu"
              >
                <img src={$isMobileMenuOpen ? "/Close.svg" : "/Menu.svg"} alt={$isMobileMenuOpen ? "Close menu" : "Open menu"} class="hamburger-icon w-12 h-12 min-[480px]:w-14 min-[480px]:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 transition-all duration-300 ease-in-out" style="transform: rotate({$isMobileMenuOpen ? '90deg' : '0deg'});" />
                <img src={$isMobileMenuOpen ? "/Close.svg" : "/Menu.svg"} alt={$isMobileMenuOpen ? "Close menu" : "Open menu"} class="hamburger-icon-gradient w-12 h-12 min-[480px]:w-14 min-[480px]:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 absolute top-2 left-2 transition-all duration-300 ease-in-out" style="transform: rotate({$isMobileMenuOpen ? '90deg' : '0deg'});" />
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
              <a href="https://x.com/Skoreova" class="gradient-icon p-2" aria-label="X">
                <IconX class="h-6 w-6" />
              </a>
              <a href="https://tiktok.com/@skoreova" class="gradient-icon p-2" aria-label="TikTok">
                <IconTikTok class="h-6 w-6" />
              </a>
              <a href="https://instagram.com/skoreova" class="gradient-icon p-2" aria-label="Instagram">
                <IconInstagram class="h-6 w-6" />
              </a>
              <a href="https://threads.com/@skoreova" class="gradient-icon p-2" aria-label="Threads">
                <IconThreads class="h-6 w-6" />
              </a>
              <a href="https://facebook.com/skoreova" class="gradient-icon p-2" aria-label="Facebook">
                <IconFacebook class="h-6 w-6" />
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

    .animated-gradient {
        background: linear-gradient(-45deg, #f9a8d4, #f472b6, #ec4899, #db2777);
        background-size: 400% 400%;
        animation: gradient 3s ease infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .gradient-text {
        background: linear-gradient(to right, #f9a8d4, #f472b6, #ec4899);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: white;
        transition: -webkit-text-fill-color 0.5s ease-in-out;
    }

    .gradient-text:hover {
        -webkit-text-fill-color: transparent;
    }

    .gradient-icon {
        color: rgba(255, 255, 255, 0.9);
        transition: all 0.5s ease-in-out;
    }

    .gradient-icon:hover {
        color: #f472b6;
    }
    .gradient-icon:hover svg {
        color: #f472b6;
        fill: #f472b6;
    }
    .gradient-icon:hover img {
        filter: brightness(0) saturate(100%) invert(73%) sepia(87%) saturate(421%) hue-rotate(288deg) brightness(105%) contrast(89%);
    }

    .gradient-icon-button {
        outline: none;
    }

    .hamburger-icon {
        filter: brightness(0) invert(1);
        transition: all 0.3s ease-in-out;
    }

    .hamburger-icon-gradient {
        filter: brightness(0) saturate(100%) invert(73%) sepia(87%) saturate(421%) hue-rotate(288deg) brightness(105%) contrast(89%);
        opacity: 0;
        transition: opacity 0.5s ease-in-out, transform 0.3s ease-in-out;
        pointer-events: none;
    }

    .gradient-icon-button:hover .hamburger-icon-gradient {
        opacity: 1;
    }

    .brand-group {
        transition: all 0.5s ease-in-out;
        animation: fadeInUp 1s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
    }

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }



    .brand-group:hover .gradient-text {
        -webkit-text-fill-color: transparent;
        transition: -webkit-text-fill-color 0.5s ease-in-out;
    }

    .logo-circle {
        background-color: white;
        transition: background-color 0.5s ease-in-out;
    }

    .brand-group:hover .logo-circle {
        background-color: #f472b6;
    }
</style>
