<script lang="ts">
	import { goto } from "$app/navigation";

	let projects = [
		{
			name: "Spotifds",
			description: "A P2P music player built on IPFS",
			url: "https://github.com/marcusmmmz/spotifds",
		},
		{
			name: "Rusty Lisp",
			description: "A Lisp-like language made with Rust",
			url: "https://github.com/marcusmmmz/rusty-lisp",
		},
		{
			name: "Dsocial",
			description: "A Discord-like Nostr client",
			url: "https://github.com/marcusmmmz/dsocial",
		},
		{
			name: "Logic-Ports",
			description: "A digital circuit editor made with Godot Engine.",
			url: "https://github.com/marcusmmmz/Logic-Ports",
		},
		{
			name: "Godot mod manager",
			description: "A simple mod manager for Godot games",
			url: "https://github.com/marcusmmmz/Godot-ModManager",
		},
		{
			name: "Anki Like App",
			description: "An app similar to Anki",
			url: "https://github.com/marcusmmmz/anki-like-app",
		},
	];
</script>

<main>
	<h1><a href="/about">About me</a></h1>
	<h1>My projects:</h1>
	<section class="projects">
		{#each projects as { name, description, url }}
			<div class="project" on:click={() => goto(url)}>
				<strong>{name}</strong>
				<p>{description}</p>
			</div>
		{/each}
	</section>
	<h1>
		And many more over at <a href="https://github.com/marcusmmmz">my github</a>
	</h1>
</main>

<style>
	.projects {
		/* display: flex;*/
		display: grid;
		grid-template-columns: 25% 25% 25%;
		grid-auto-rows: auto;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
		width: 100%;
	}
	@media only screen and (max-width: 600px) {
		.projects {
			display: flex;
		}
	}
	.project {
		padding: 1rem;
		border-width: 4px;
		border-style: solid;
		cursor: pointer;
	}
	@media only screen and (max-width: 600px) {
		.project {
			width: 80%;
		}
	}
</style>
