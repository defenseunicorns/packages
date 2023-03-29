const fs = require('fs');

let controller;

module.exports = async ({github}) => {
  controller = github;
  makeReadme()
}


async function getPackages() {
  return controller.rest.packages.listPackagesForOrganization({
    package_type: 'container',
    org: 'defenseunicorns'
  });
}

async function getPkgVersions(pkgName) {
  return controller.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
		package_type: 'container',
		package_name: pkgName,
		org: 'defenseunicorns'
	});
}

async function makeReadme(pkgs) {
  const pkgs = await getPackages();

  let readme_table = '| Package | Repo | Tags |\n' +
                     '|---------|------|------|\n';

  for(const pkg of pkgs.data) {
    const versions = await getPkgVersions(pkg.name)
    readme_table += `[${pkg.name}](${pkg.html_url}) | [${pkg.repository && pkg.repository.name}](${pkg.repository.html_url}) | ${versions[0].metadata.container.tags.join('<br />')} |\n`
  }

  fs.writeFileSync('README.md', readme_table, 'utf-8');
}