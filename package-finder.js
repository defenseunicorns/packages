const fs = require('fs');



module.exports = async ({github}) => {
 const pkgs = await github.rest.packages.listPackagesForOrganization({
    package_type: 'container',
    org: 'defenseunicorns'
  });

 makeReadme(pkgs)
}

function makeReadme(pkgs) {

  let readme_table = '| Package | URL |\n' +
                     '|---------|-----|\n';

  for(const pkg of pkgs.data) {
    readme_table += `${pkg.name} | [${pkg.url}](${pkg.url}) |\n`
  }

  fs.writeFileSync('README.md', readme_table, 'utf-8');
}