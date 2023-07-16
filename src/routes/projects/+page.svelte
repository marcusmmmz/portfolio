<script lang="ts">
	const projects = [
		{
			name: 'Spotifds',
			description: 'A P2P music player built on IPFS',
			image: 'spotifds.png',
			url: 'https://github.com/marcusmmmz/spotifds'
		},
		{
			name: 'Logic-Ports',
			description: 'A digital circuit editor made with Godot Engine.',
			image: 'logicports.png',
			url: 'https://github.com/marcusmmmz/Logic-Ports'
		},
		{
			name: 'Tetris',
			description: 'Tetris, but made in a weekend',
			image: 'tetris.png',
			url: 'https://github.com/marcusmmmz/tetris'
		},
		{
			name: 'Rusty lang',
			description: 'A Rusty language with a compiler in Rust',
			image: 'rustylang.png',
			url: 'https://github.com/marcusmmmz/rusty-lang'
		},
		{
			name: 'Dsocial',
			description: 'A Discord-like Nostr client',
			image: 'dsocial.png',
			url: 'https://github.com/marcusmmmz/dsocial'
		},
		{
			name: 'Godot mod manager',
			image: 'modmanager.png',
			description: 'A simple mod manager for Godot games',
			url: 'https://github.com/marcusmmmz/Godot-ModManager'
		}
	];
</script>

<main>
	<h1><a href="/about">About me</a></h1>
	<h1>My projects:</h1>
	<section class="projects">
		{#each projects as { name, description, url, image }}
			<a class="project" href={url}>
				<p><strong>{name}</strong></p>
				<img src={'projects/' + image} alt="" />
				<p>{description}</p>
			</a>
		{/each}
	</section>
	<h1>
		And many more over at <a href="https://github.com/marcusmmmz">my github</a>
	</h1>
</main>

<style>
	.projects {
		display: grid;
		grid-template-columns: 45% 45%;
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
		display: flex;
		flex-direction: column;
		border-width: 4px;
		border-style: solid;
		color: white;
		text-decoration: none;
		transition: transform 0.1s;
	}
	.project:hover {
		transform: scale(1.05);
	}
	.project img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	@media only screen and (max-width: 600px) {
		.project {
			width: 80%;
		}
	}
</style>
