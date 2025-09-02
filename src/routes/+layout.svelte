<script lang="ts">
import "../app.css";
import { browser } from "$app/environment";
import { page } from "$app/state";

const { children } = $props();

let isMobileMenuOpen = $state(false);
let isDarkMode = $state(false);

let mouseX = $state(0);
let mouseY = $state(0);
let targetX = $state(0);
let targetY = $state(0);

$effect(() => {
	if (browser) {
		const storedDarkMode = localStorage.getItem("darkMode");
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;

		isDarkMode = storedDarkMode === "true" || (!storedDarkMode && prefersDark);
	}
});

$effect(() => {
	if (browser) {
      isDarkMode ? document.documentElement.classList.add("dark") : document.documentElement.classList.remove("dark")
	}
});

const isHomepage = $derived(page.url.pathname === "/");

function toggleMobileMenu() {
	isMobileMenuOpen = !isMobileMenuOpen;
}

function toggleDarkMode() {
	isDarkMode = !isDarkMode;

	if (browser) {
		localStorage.setItem("darkMode", isDarkMode.toString());
	}
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
  <!-- Homepage Layout: Header + Full Width Content + Footer -->
  <!-- Header -->
  <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-3">
          <!-- Logo placeholder -->
          <a href="/" class="flex items-center">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <!-- Replace this div with your SVG logo -->
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </a>
          <!-- Header text as link -->
          <a href="/" class="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
            Skóreová
          </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <a href="/articles" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">Články</a>
          <a href="/about" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">Hráčky</a>
          <a href="/results" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">Výsledky</a>
          <a href="/contact" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">Kontakt</a>
        </nav>

        <!-- Dark Mode Toggle & Social Icons -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button
            onclick={toggleDarkMode}
            class="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Toggle dark mode"
          >
            {#if isDarkMode}
              <!-- Sun icon for light mode -->
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            {:else}
              <!-- Moon icon for dark mode -->
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            {/if}
          </button>

          <a href="https://x.com" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2" aria-label="X (Twitter)">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://threads.net" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2" aria-label="Threads">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.86 12.48c-.03-.8-.05-1.89-.05-1.89s-.02-2.42-.49-3.48c-.27-.62-.67-1.18-1.18-1.61-.51-.43-1.13-.73-1.8-.87-1.06-.47-3.48-.49-3.48-.49s-1.09-.02-1.89-.05c-.8.03-1.89.05-1.89.05s-2.42.02-3.48.49c-.67.14-1.29.44-1.8.87-.51.43-.91.99-1.18 1.61-.47 1.06-.49 3.48-.49 3.48s-.02 1.09-.05 1.89c.03.8.05 1.89.05 1.89s.02 2.42.49 3.48c.27.62.67 1.18 1.18 1.61.51.43 1.13.73 1.8.87 1.06.47 3.48.49 3.48.49s1.09.02 1.89.05c.8-.03 1.89-.05 1.89-.05s2.42-.02 3.48-.49c.67-.14 1.29-.44 1.8-.87.51-.43.91-.99 1.18-1.61.47-1.06.49-3.48.49-3.48s.02-1.09.05-1.89zM9.93 15.65V8.35l5.77 3.65-5.77 3.65z"/>
            </svg>
          </a>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden ml-4">
          <button
            onclick={toggleMobileMenu}
            class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:text-gray-900 dark:focus:text-white p-2"
            aria-label="Toggle menu"
          >
            {#if isMobileMenuOpen}
              <!-- X icon -->
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            {:else}
              <!-- Hamburger icon -->
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if isMobileMenuOpen}
      <div class="md:hidden border-t border-gray-200 dark:border-gray-700">
        <nav class="px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900">
          <a href="/" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium">Články</a>
          <a href="/about" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium">Hráčky</a>
          <a href="/services" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium">Něco</a>
          <a href="/contact" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium">Kontakt</a>
        </nav>
      </div>
    {/if}
  </header>

  <!-- Full Width Homepage Content -->
  <main class="w-full">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
    <div class="max-w-6xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
      <p>&copy; 2025 Skóreová. All rights reserved.</p>
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
      <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-3">
              <!-- Logo placeholder -->
              <a href="/" class="flex items-center">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <!-- Replace this div with your SVG logo -->
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </a>
              <!-- Header text as link -->
              <a href="/" class="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
                Skóreová
              </a>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex space-x-8">
              <a href="/" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">Články</a>
              <a href="/about" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">Hráčky</a>
              <a href="/services" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">Něco</a>
              <a href="/contact" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">Kontakt</a>
            </nav>

            <!-- Dark Mode Toggle & Social Icons -->
            <div class="flex items-center space-x-4">
              <!-- Dark Mode Toggle -->
              <button
                onclick={toggleDarkMode}
                class="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Toggle dark mode"
              >
                {#if isDarkMode}
                  <!-- Sun icon for light mode -->
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                {:else}
                  <!-- Moon icon for dark mode -->
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                  </svg>
                {/if}
              </button>

              <a href="https://x.com" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2" aria-label="X (Twitter)">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://threads.net" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2" aria-label="Threads">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.86 12.48c-.03-.8-.05-1.89-.05-1.89s-.02-2.42-.49-3.48c-.27-.62-.67-1.18-1.18-1.61-.51-.43-1.13-.73-1.8-.87-1.06-.47-3.48-.49-3.48-.49s-1.09-.02-1.89-.05c-.8.03-1.89.05-1.89.05s-2.42.02-3.48.49c-.67.14-1.29.44-1.8.87-.51.43-.91.99-1.18 1.61-.47 1.06-.49 3.48-.49 3.48s-.02 1.09-.05 1.89c.03.8.05 1.89.05 1.89s.02 2.42.49 3.48c.27.62.67 1.18 1.18 1.61.51.43 1.13.73 1.8.87 1.06.47 3.48.49 3.48.49s1.09.02 1.89.05c.8-.03 1.89-.05 1.89-.05s2.42-.02 3.48-.49c.67-.14 1.29-.44 1.8-.87.51-.43.91-.99 1.18-1.61.47-1.06.49-3.48.49-3.48s.02-1.09.05-1.89zM9.93 15.65V8.35l5.77 3.65-5.77 3.65z"/>
                </svg>
              </a>
            </div>

            <!-- Mobile menu button -->
            <div class="md:hidden ml-4">
              <button
                onclick={toggleMobileMenu}
                class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:text-gray-900 dark:focus:text-white p-2"
                aria-label="Toggle menu"
              >
                {#if isMobileMenuOpen}
                  <!-- X icon -->
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                {:else}
                  <!-- Hamburger icon -->
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                {/if}
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        {#if isMobileMenuOpen}
          <div class="md:hidden border-t border-gray-200 dark:border-gray-700">
            <nav class="px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900">
              <a href="/" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium">Články</a>
              <a href="/about" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium">Hráčky</a>
              <a href="/services" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium">Něco</a>
              <a href="/contact" class="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium">Kontakt</a>
            </nav>
          </div>
        {/if}
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
