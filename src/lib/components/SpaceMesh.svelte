<script lang="ts">
import { onMount } from "svelte";
import { browser } from "$app/environment";

let canvas: HTMLCanvasElement;
let scene: any;
let camera: any;
let renderer: any;
let meshes: any[] = [];
let animationId: number;

onMount(async () => {
	if (!browser) return;

	try {
		const THREE = await import("three");

		// Scene setup
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		);
		renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 0);

		// Create multiple layered spherical meshes for organic feel
		const createFluidMesh = (
			radius: number,
			detail: number,
			position: [number, number, number],
			scale: number,
		) => {
			const geometry = new THREE.IcosahedronGeometry(radius, detail);

			// Add custom attributes for more organic deformation
			const vertices = geometry.attributes.position.array;
			const vertexCount = vertices.length / 3;

			// Create noise-based deformation
			for (let i = 0; i < vertexCount; i++) {
				const x = vertices[i * 3];
				const y = vertices[i * 3 + 1];
				const z = vertices[i * 3 + 2];

				// Add some initial organic deformation
				const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.sin(z * 0.1);
				vertices[i * 3] += noise * 0.3;
				vertices[i * 3 + 1] += noise * 0.2;
				vertices[i * 3 + 2] += noise * 0.4;
			}

			geometry.attributes.position.needsUpdate = true;
			geometry.computeVertexNormals();

			const material = new THREE.MeshBasicMaterial({
				color: new THREE.Color().setHSL(
					0.75 + Math.random() * 0.1,
					0.8,
					0.3 + Math.random() * 0.4,
				),
				wireframe: true,
				transparent: true,
				opacity: 0.1 + Math.random() * 0.3,
			});

			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(...position);
			mesh.scale.setScalar(scale);

			return mesh;
		};

		// Create multiple organic mesh layers
		meshes = [
			createFluidMesh(8, 2, [0, 0, -15], 1.2),
			createFluidMesh(6, 3, [-5, 3, -10], 0.8),
			createFluidMesh(7, 2, [6, -2, -12], 1.0),
			createFluidMesh(5, 4, [0, -4, -8], 0.6),
			createFluidMesh(9, 1, [3, 5, -18], 1.4),
			createFluidMesh(4, 3, [-8, 0, -6], 0.7),
		];

		meshes.forEach((mesh) => scene.add(mesh));

		// Add particle system for space dust
		const particleCount = 200;
		const particleGeometry = new THREE.BufferGeometry();
		const particlePositions = new Float32Array(particleCount * 3);

		for (let i = 0; i < particleCount * 3; i++) {
			particlePositions[i] = (Math.random() - 0.5) * 40;
		}

		particleGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(particlePositions, 3),
		);

		const particleMaterial = new THREE.PointsMaterial({
			color: 0x8b00ff,
			size: 0.1,
			transparent: true,
			opacity: 0.6,
		});

		const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
		scene.add(particleSystem);

		// Position camera
		camera.position.z = 10;
		camera.position.y = 0;

		// Animation loop
		const animate = () => {
			animationId = requestAnimationFrame(animate);

			const time = Date.now() * 0.001;

			// Animate each mesh organically
			meshes.forEach((mesh, index) => {
				// Fluid rotation
				mesh.rotation.x = Math.sin(time * 0.3 + index) * 0.2;
				mesh.rotation.y = time * 0.1 + index * 0.5;
				mesh.rotation.z = Math.cos(time * 0.2 + index) * 0.1;

				// Breathing scale animation
				const breathe = 1 + Math.sin(time * 0.8 + index * 2) * 0.1;
				mesh.scale.setScalar(mesh.userData?.baseScale || 1 * breathe);

				// Flowing position changes
				mesh.position.x += Math.sin(time * 0.15 + index) * 0.002;
				mesh.position.y += Math.cos(time * 0.1 + index) * 0.002;

				// Organic color shifting
				const hue = (0.75 + Math.sin(time * 0.5 + index) * 0.1) % 1;
				mesh.material.color.setHSL(
					hue,
					0.8,
					0.3 + Math.sin(time + index) * 0.2,
				);

				// Opacity pulsing
				mesh.material.opacity = 0.2 + Math.sin(time * 2 + index) * 0.15;
			});

			// Animate particles
			if (particleSystem) {
				particleSystem.rotation.y = time * 0.05;
				const positions = particleSystem.geometry.attributes.position.array;
				for (let i = 0; i < positions.length; i += 3) {
					positions[i + 1] += Math.sin(time + positions[i] * 0.1) * 0.001;
				}
				particleSystem.geometry.attributes.position.needsUpdate = true;
			}

			renderer.render(scene, camera);
		};

		animate();

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
			if (renderer) {
				renderer.dispose();
			}
		};
	} catch (error) {
		console.error("Failed to load Three.js:", error);
	}
});
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full"></canvas>

<style>
canvas {
	background: radial-gradient(circle at 30% 20%, #1a0033 0%, #0d001a 40%, #000000 100%);
}
</style>
