const fs = require('fs');



module.exports = async ({github}) => {
 const pkgs = await github.rest.packages.listPackagesForOrganization({
    package_type: 'container',
    org: 'defenseunicorns'
  });

 makeReadme(pkgs)
}

function makeReadme(pkgs) {

  let readme_table = '| Package | Repo |\n' +
                     '|---------|-----|\n';

  for(const pkg of pkgs.data) {
    readme_table += `[${pkg.name}](${pkg.html_url}) | ${pkg.repository.name} |\n`
  }

  fs.writeFileSync('README.md', readme_table, 'utf-8');
}