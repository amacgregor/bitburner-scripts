let baseUrl = '';
let url = path => `${baseUrl}${path}`;

async function get(ns, path) {
    return await ns.wget(url(path), path.split('/').pop());
}

export async function main(ns) {
    let files = ['hack/hack.script', 'hack/grow.script', 'hack/weaken.script', 'helper.js', 'Log.js', 'Runner.js', 'hack/distributed.js'];
    for (let i in files)
        await get(ns, files[i]);
    ns.tprint('<span style="color:white">Done updating!</span>');
}