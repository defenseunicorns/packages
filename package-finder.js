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

async function makeReadme() {
  let pkgs = await getPackages();

  const regex = new RegExp('uds-package')

  pkgs.data.filter((p) => {regex.test(p.html_url)})

  let readme_table = '| Package | Repo | Tag |\n' +
                     '|---------|------|------|\n';

  for(const pkg of pkgs.data) {
    const versions = await getPkgVersions(pkg.name)
    const repo_name = pkg.repository && pkg.repository.name || '';
    const repo_url = pkg.repository && pkg.repository.html_url || '';
    const latest_version_tags = versions[0] && versions[0].metadata.container.tags.join('<br />') || '';

    readme_table += `[${pkg.name}](${pkg.html_url}) | [${repo_name}](${repo_url}) | ${latest_version_tags} |\n`
  }

  fs.writeFileSync('pkg-readme.md', readme_table, 'utf-8');
}