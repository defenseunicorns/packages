const fs = require('fs');

module.exports = async ({github}) => {
 const pkgs = await github.rest.packages.listPackagesForOrganization({
    package_type: 'container',
    org: 'defenseunicorns'
  });

 makeReadme(pkgs)
}


async function getPkgVersions(pkgName) {
  return github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
		package_type: 'container',
		package_name: pkgName,
		org: 'defenseunicorns'
	});
}

async function makeReadme(pkgs) {

  let readme_table = '| Package | Repo | Tags |\n' +
                     '|---------|------|------|\n';

  for(const pkg of pkgs.data) {
    const versions = await getPkgVersions(pkg.name)
    readme_table += `[${pkg.name}](${pkg.html_url}) | [${pkg.repository && pkg.repository.name}](${pkg.repository.html_url}) | ${versions[0].metadata.container.tags.join('<br />')} |\n`
  }

  fs.writeFileSync('README.md', readme_table, 'utf-8');
}