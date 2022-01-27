const { exec } = require('child_process');
const fs = require('fs');

const args = process.argv;
const name = args[2];
const destPath = `./packages/${name}`;

const execCallback = (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}
	console.log(`stdout: ${stdout}`);

	const destPkg = `${destPath}/package.json`;
	const pkg = JSON.parse(fs.readFileSync(destPkg));

	pkg.name = `@yeseh/${name}`;
	pkg.main = `dist/${name}.js`;
	pkg.module = `dist/${name}.mjs`;
	pkg.typings = `dist/${name}.d.ts`;

	fs.writeFileSync(destPkg, JSON.stringify(pkg));
};

exec(`rm -rf ${destPath} && mkdir ${destPath} && cp -r ./templates/library/** ${destPath}/`, execCallback);


