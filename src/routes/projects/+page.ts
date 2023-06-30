import type { PageLoad } from "./$types";

interface Profile {
	name: string;
	url: string;
	description: string;
	bio: string;
	fork: boolean;
}

export const load: PageLoad = async () => {
	return {
		profile: await getProfile(),
		repos: await getRepos(),
	};
};

async function fetchJSON<T = any>(url: string) {
	let data = await fetch(url);
	let res: T = await data.json();
	return res;
}

async function getProfile() {
	return await fetchJSON("https://api.github.com/users/marcusmmmz");
}

async function getRepos() {
	const res = await fetchJSON<Profile[]>(
		"https://api.github.com/users/marcusmmmz/repos"
	);
	return res.filter((repo) => !repo.fork);
}
